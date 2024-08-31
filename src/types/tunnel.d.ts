import type {
    Message as DiscordMessage,
    WebhookMessageCreateOptions,
} from 'discord.js';
import type { MinecraftText } from './minecraft';
import type {
    AdvancementS2C,
    ChatMessageS2C,
    CommandFeedbackS2C,
    PlayerDeathS2C,
    PlayerListUpdateS2C,
    ServerMessageS2C,
    VillagerDeathS2C,
} from './mlem';

// source definitions

export type TunnelSource = {
    minecraftChat: ChatMessageS2C;
    minecraftServerMessage: ServerMessageS2C;
    minecraftCommandFeedback: CommandFeedbackS2C;
    minecraftJoin: PlayerListUpdateS2C;
    minecraftLeave: PlayerListUpdateS2C;
    minecraftAdvancement: AdvancementS2C;
    minecraftDeath: PlayerDeathS2C;
    minecraftVillagerDeath: VillagerDeathS2C;
    discord: DiscordMessage<boolean>;
};

// sink definitions

export type TunnelSink = {
    discordWebhook: DiscordWebhook;
    minecraft: MinecraftText;
};

export type DiscordWebhook = WebhookMessageCreateOptions;
