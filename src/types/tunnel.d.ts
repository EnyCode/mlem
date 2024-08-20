import type { WebhookMessageCreateOptions } from 'discord.js';
import type { MinecraftText } from './minecraft';
import type { ChatMessageS2C, PlayerListUpdateS2C } from './mlem';

// source definitions

export type TunnelSource = {
    minecraftChat: ChatMessageS2C;
    minecraftJoin: PlayerListUpdateS2C;
    minecraftLeave: PlayerListUpdateS2C;
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
    discordWebhook: DiscordWebhook;
    minecraft: MinecraftText;
};

export type DiscordWebhook = WebhookMessageCreateOptions;
