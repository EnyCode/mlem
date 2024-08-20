export type { Config } from './types/config';
export { mcToMarkdown } from './util';

import type { Config } from './types/config';
import type { PacketS2C } from './types/mlem';
import { drain } from './sink';
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';

const configFile = process.cwd() + '/' + (process.argv[2] || 'config.ts');
const config = (await import(configFile)).config as Config;

// listening to the minecraft server

export const socket = new WebSocket('ws://localhost:1701');

socket.onopen = () => console.log('connected to minecraft server!');

socket.onmessage = (socketMsg) => {
    const msg = JSON.parse(socketMsg.data.toString()) as PacketS2C;

    config.tunnels.forEach((tunnel) => {
        if (tunnel.from === 'minecraftChat' && msg.type === 'chat') {
            drain(tunnel.to, tunnel.fn(msg), config);
        }
        if (
            (tunnel.from === 'minecraftJoin' && msg.type === 'player_join') ||
            (tunnel.from === 'minecraftLeave' && msg.type === 'player_leave')
        ) {
            drain(tunnel.to, tunnel.fn(msg), config);
        }
    });
};

// listening to discord

const token = config.discord?.botToken;
if (token) {
    const client = new DiscordClient({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    client.once('ready', () => console.log('connected to discord!'));

    client.on('messageCreate', (msg) => {
        if (msg.author.bot) return;

        if (msg.channelId === config.discord?.channel) {
            config.tunnels.forEach((tunnel) => {
                if (tunnel.from === 'discord') {
                    drain(tunnel.to, tunnel.fn(msg), config);
                }
            });
        }
    });

    client.login(token);
}
