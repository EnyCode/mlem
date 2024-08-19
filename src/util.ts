import type { MinecraftText, MinecraftTextComponent } from './types/minecraft';

export function mcToMarkdown(mc: MinecraftText): string {
    const component = textToComponent(mc);
    if ('text' in component) {
        return component.text;
    }
    return '';
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
