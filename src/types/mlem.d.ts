import type { MinecraftText } from './minecraft';

export type PacketC2S = BroadcastC2S;

/** broadcasts a given message to all online players. */
export type BroadcastC2S = {
    type: 'broadcast';
    /** a message to be broadcasted to all online players. */
    message: MinecraftText;
};

export type PacketS2C = PlayerListUpdateS2C | ChatMessageS2C | ServerMessageS2C;

/** a player has left or joined the server. */
export type PlayerListUpdateS2C = {
    type: 'player_join' | 'player_leave';
    /** the player that joined or left. */
    player: MinecraftPlayer;
};

/** a message sent by an online player. */
export type ChatMessageS2C = {
    type: 'chat' | 'chat_say' | 'chat_me';
    /** the raw message content as the user entered. */
    message: string;
    /** the message content after processing. */
    text: MinecraftText;
    /** the player who sent this message. */
    player: MinecraftPlayer;
};

/** a message sent from the console using /say. */
export type ServerMessageS2C = {
    type: 'server_message';
    /** the raw message content as entered in the console. */
    message: string;
    /** the message content after processing. */
    text: MinecraftText;
};

export type MinecraftPlayer = {
    /** the player's name. */
    name: string;
    /** the player's uuid (hyphenated lowercase). */
    uuid: string;
};
