import type {
    Message as DiscordMessage,
    WebhookMessageCreateOptions,
} from 'discord.js';
import type { MinecraftText } from './minecraft';
import type { ChatMessageS2C, PlayerListUpdateS2C } from './mlem';

// source definitions

export type TunnelSource = {
    minecraftChat: ChatMessageS2C;
    minecraftJoin: PlayerListUpdateS2C;
    minecraftLeave: PlayerListUpdateS2C;
    discord: DiscordMessage<boolean>;
};

// sink definitions

export type TunnelSink = {
    discordWebhook: DiscordWebhook;
    minecraft: MinecraftText;
};

export type DiscordWebhook = WebhookMessageCreateOptions;
