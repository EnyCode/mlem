export type { Config } from './types/config';

import type { Config } from './types/config';
import type { PacketS2C } from './types/mlem';
import { drain } from './sink';
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';

const configFile = process.cwd() + '/' + (process.argv[2] || 'config.ts');
const config = (await import(configFile)).config as Config;

// listening to the minecraft server

export let serverSocket = openSocket();

function openSocket() {
    const socket = new WebSocket('ws://localhost:1701');

    socket.onopen = () => console.log('connected to minecraft server!');

    socket.onclose = () => {
        console.log(
            'server connection closed; will try to reconnect in 3 seconds!',
        );
        setTimeout(() => {
            serverSocket = openSocket();
        }, 3_000);
    };

    socket.onmessage = (socketMsg) => {
        const msg = JSON.parse(socketMsg.data.toString()) as PacketS2C;

        config.tunnels.forEach((tunnel) => {
            try {
                executeTunnel(tunnel, msg);
            } catch (err) {
                console.error(
                    `error executing tunnel ${tunnel.from} -> ${tunnel.to}`,
                );
                console.error(err);
            }
        });
    };

    return socket;
}

function executeTunnel(tunnel: Config['tunnels'][number], msg: PacketS2C) {
    if (tunnel.from === 'minecraftChat' && msg.type === 'chat')
        drain(tunnel.to, tunnel.fn(msg), config);
    if (
        tunnel.from === 'minecraftServerMessage' &&
        msg.type === 'server_message'
    )
        drain(tunnel.to, tunnel.fn(msg), config);
    if (
        tunnel.from === 'minecraftCommandFeedback' &&
        msg.type === 'command_feedback'
    )
        drain(tunnel.to, tunnel.fn(msg), config);
    if (
        (tunnel.from === 'minecraftJoin' && msg.type === 'player_join') ||
        (tunnel.from === 'minecraftLeave' && msg.type === 'player_leave')
    )
        drain(tunnel.to, tunnel.fn(msg), config);
    if (tunnel.from === 'minecraftAdvancement' && msg.type === 'advancement')
        drain(tunnel.to, tunnel.fn(msg), config);
    if (tunnel.from === 'minecraftDeath' && msg.type === 'player_death')
        drain(tunnel.to, tunnel.fn(msg), config);
    if (
        tunnel.from === 'minecraftVillagerDeath' &&
        msg.type === 'villager_death'
    )
        drain(tunnel.to, tunnel.fn(msg), config);
}

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
