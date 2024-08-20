import type { Config } from 'mlem';
import type { PacketS2C } from './types/mlem';
import { drain } from './sink';

const configFile = process.cwd() + '/' + (process.argv[2] || 'config.ts');
const config = (await import(configFile)).config as Config;

const socket = new WebSocket('ws://localhost:1701');

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
