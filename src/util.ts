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

export function markdown(markdown: string): MinecraftTextComponent {
    return { text: markdown };
}
