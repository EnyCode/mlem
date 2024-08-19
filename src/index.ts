import type { PacketS2C } from './types/mlem';

const socket = new WebSocket('ws://localhost:1701');

socket.onopen = () => console.log('connected to socket!');

socket.onmessage = (socketMsg) => {
    const msg = JSON.parse(socketMsg.data.toString()) as PacketS2C;

    console.log(msg);
};
