import { marked } from 'marked';
import type { MinecraftText, MinecraftTextComponent } from './types/minecraft';

export function mcToMarkdown(mc: MinecraftText): string {
    return componentToMarkdown(textToComponent(mc));
}

type MarkdownStyles = {
    bold: boolean;
    italic: boolean;
    underlined: boolean;
    strikethrough: boolean;
};

function matchingStyles(a: MinecraftTextComponent, b: MinecraftTextComponent) {
    return (
        a.bold! === b.bold! &&
        a.italic! === b.italic! &&
        a.underlined! === b.underlined! &&
        a.strikethrough! === b.strikethrough!
    );
}

function componentToMarkdown(comp: MinecraftTextComponent) {
    // TODO: escape existing markdown

    const flat = mergeFlatComponents(flattenComponent(comp));
    let output = '';

    for (const comp of flat) {
        let text = componentText(comp);
        let startSpace = text.match(/^ */)![0];
        let endSpace = text.match(/ *$/)![0];
        text = text.trim();

        if (text.length) {
            if (comp.bold) text = `**${text}**`;
            if (comp.italic) text = `*${text}*`;
            if (comp.underlined) text = `__${text}__`;
            if (comp.strikethrough) text = `~~${text}~~`;
        }

        output += startSpace + text + endSpace;
    }

    return output;
}

function flattenComponent(
    comp: MinecraftTextComponent,
    parentStyles: MarkdownStyles = {
        bold: false,
        italic: false,
        underlined: false,
        strikethrough: false,
    },
) {
    const newStyles = {
        bold: comp.bold ?? parentStyles.bold,
        italic: comp.italic ?? parentStyles.italic,
        underlined: comp.underlined ?? parentStyles.underlined,
        strikethrough: comp.strikethrough ?? parentStyles.strikethrough,
    };
    let output: MinecraftTextComponent[] = [
        { ...comp, ...newStyles, extra: undefined },
    ];

    for (const child of comp.extra ?? []) {
        output = [
            ...output,
            ...flattenComponent(textToComponent(child), newStyles),
        ];
    }

    return output;
}

function mergeFlatComponents(components: MinecraftTextComponent[]) {
    return components.reduce((flattened, component) => {
        if (
            flattened.length === 0 ||
            !matchingStyles(flattened.at(-1)!, component)
        )
            return [...flattened, component];
        const lastComp = flattened.at(-1)!;
        setComponentText(
            lastComp,
            componentText(lastComp) + componentText(component),
        );
        return flattened;
    }, [] as MinecraftTextComponent[]);
}

function componentText(comp: MinecraftTextComponent) {
    return 'text' in comp ? comp.text : '';
}

function setComponentText(comp: MinecraftTextComponent, text: string) {
    'text' in comp && (comp.text = text);
}

export function textToComponent(text: MinecraftText): MinecraftTextComponent {
    if (Array.isArray(text)) {
        return { ...text[0], extra: text.splice(1) };
    } else if (typeof text === 'string') {
        return { text };
    }
    return text;
}

export function markdownToMC(
    markdown: string,
): (MinecraftTextComponent | string)[] {
    // TODO:
    // - nested lists
    // - ordered lists
    // - code block parsing
    // - code block font?
    // - block quote formatting
    // - spoilers
    // - mentions (users + roles)
    // - channels
    // - custom emojis
    // - stickers
    // - timestamps
    // - better headers?
    // - disable alternate code block format

    const escape = (content: string) =>
        content
            .replaceAll('\\', '\\\\')
            .replaceAll('"', '\\"')
            .replaceAll('\n', '\\n');
    const paragraph = (content: string) =>
        content.replace(/,"\\n\\n"$/, '').substring(1);

    marked.use({
        useNewRenderer: true,
        renderer: {
            code(token) {
                return ',"\\n","' + escape(token.text) + '","\\n"';
            },
            codespan(token) {
                return ',"' + escape(token.text) + '"';
            },
            blockquote(token) {
                return this.parser.parse(token.tokens);
            },
            space() {
                // interpret new line as line break
                return ',"\\n"';
            },

            // do nothing for these
            table(token) {
                return ',"' + escape(token.raw) + '"';
            },
            br(token) {
                return ',"' + escape(token.raw) + '"';
            },
            image(token) {
                return ',"' + escape(token.raw) + '"';
            },
            html(token) {
                return ',"' + escape(token.raw) + '"';
            },
            hr(token) {
                return ',"\\n","' + escape(token.raw) + '","\\n"';
            },

            heading(token) {
                return (
                    ',"' +
                    '#'.repeat(token.depth) +
                    ' "' +
                    this.parser.parseInline(token.tokens) +
                    ',"\\n"'
                );
            },
            list(token) {
                return token.items
                    .map(
                        (item) =>
                            ',"\\n - "' +
                            JSON.parse(paragraph(this.listitem(item))),
                    )
                    .join('');
            },
            listitem(item) {
                return this.parser.parse(item.tokens);
            },
            paragraph(token) {
                // two line gap between paragraphs
                return this.parser.parseInline(token.tokens) + ',"\\n\\n"';
            },

            strong(token) {
                return `,{"text":"","extra":[${this.parser
                    .parseInline(token.tokens)
                    .substring(1)}],"bold":true}`;
            },
            em(token) {
                return `,{"text":"","extra":[${this.parser
                    .parseInline(token.tokens)
                    .substring(1)}],"italic":true}`;
            },
            del(token) {
                return `,{"text":"","extra":[${this.parser
                    .parseInline(token.tokens)
                    .substring(1)}],"strikethrough":true}`;
            },

            text(token) {
                return 'tokens' in token && token.tokens
                    ? this.parser.parseInline(token.tokens)
                    : `,"${escape(token.text)}"`;
            },
            link(token) {
                return `,{"text":"","extra":[${this.parser
                    .parseInline(token.tokens)
                    .substring(
                        1,
                    )}],"color":"#7878ff","underlined":true,"clickEvent":{"action":"open_url","value":"${escape(
                    token.href,
                )}"}}`;
            },
        },
        tokenizer: {
            // disable setext
            lheading() {
                return undefined;
            },
        },
        extensions: [
            // stolen mostly from https://github.com/markedjs/marked/issues/2737
            {
                name: 'underline',
                level: 'inline',
                start(src) {
                    return src.match(/__(.*?)__/)?.index;
                },
                tokenizer(src) {
                    const match = src.match(/^__(.*?)__/);
                    if (match)
                        return {
                            type: 'underline',
                            raw: match[0],
                            tokens: this.lexer.inlineTokens(match[1].trim()),
                        };
                },
                renderer(token) {
                    return `,{"text":"","extra":[${this.parser
                        .parseInline(token.tokens!)
                        .substring(1)}],"underlined":true}`;
                },
            },
        ],
    });

    const parsed = '[' + paragraph(marked.parse(markdown) as string) + ']';

    return JSON.parse(parsed) as (MinecraftTextComponent | string)[];
}

export function titleCase(str: string) {
    return str
        .split(' ')
        .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1))
        .join(' ');
}
