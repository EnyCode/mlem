import type { MinecraftText } from './minecraft';
import type { ChatMessageS2C } from './mlem';

// source definitions

export type TunnelSource = {
    'minecraft:chat': ChatMessageS2C;
    discord: DiscordMessage;
};

export type DiscordMessage = {
    author: {
        name: string;
        username: string;
    };
    content: string;
    attachments: {
        url: string;
    }[];
};

// sink definitions

export type TunnelSink = {
    discord: DiscordWebhook;
    minecraft: MinecraftText;
};

export type DiscordWebhook = {
    content: string;
};
