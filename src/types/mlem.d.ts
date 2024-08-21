import type { MinecraftText } from './minecraft';

export type PacketC2S = BroadcastC2S;

/** broadcasts a given message to all online players. */
export type BroadcastC2S = {
    type: 'broadcast';
    /** a message to be broadcasted to all online players. */
    message: MinecraftText;
};

export type PacketS2C =
    | PlayerListUpdateS2C
    | ChatMessageS2C
    | ServerMessageS2C
    | AdvancementS2C
    | PlayerDeathS2C;

/** a player has left or joined the server. */
export type PlayerListUpdateS2C = {
    type: 'player_join' | 'player_leave';
    /** indicates whether the player joined or left. */
    joined: boolean;
    /** the player that joined or left. */
    player: MinecraftPlayer;
    /** the message displayed in chat. */
    message: MlemText;
};

/** a message sent by an online player. */
export type ChatMessageS2C = {
    type: 'chat' | 'chat_say' | 'chat_me';
    /** the message's content. */
    chat: MlemText;
    /** the player who sent this message. */
    player: MinecraftPlayer;
};

/** a message sent from the console using /say. */
export type ServerMessageS2C = {
    type: 'server_message';
    /** the message's content. */
    chat: MlemText;
};

/** a player has achieved an advancement. */
export type AdvancementS2C = {
    type: 'advancement';
    /** the player receiving the advancement. */
    player: MinecraftPlayer;
    /** the namespaced id of the advancement. */
    advancement: string;
    /** the type of the advancement. */
    advancement_type: 'task' | 'challenge' | 'goal';
    /** the message displayed in chat. */
    message: MlemText;
    /** the name of the advancement. */
    title: MlemText;
    /** the description of the advancement. */
    description: MlemText;
};

/** a player has died. */
export type PlayerDeathS2C = {
    type: 'player_death';
    /** the player who died. */
    player: MinecraftPlayer;
    /** the death message. */
    message: MlemText;
};

export type MinecraftPlayer = {
    /** the player's name. */
    name: string;
    /** the player's uuid (hyphenated lowercase). */
    uuid: string;
};

export type MlemText = {
    /** the components making up the text. */
    components: MinecraftText;
    /** the text as displayed in-game, without formatting. */
    display: string;
};
