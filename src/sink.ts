import { WebhookClient } from 'discord.js';
import type { TunnelSink } from './types/tunnel';
import { socket, type Config } from 'mlem';
import type { BroadcastC2S } from './types/mlem';

export const sinkDrains: {
    [K in keyof TunnelSink]: (value: TunnelSink[K], config: Config) => void;
} = {
    discordWebhook: (value, config) => {
        const maybeWebhook = config.discord?.webhook;
        if (maybeWebhook === undefined) return;

        const client = new WebhookClient(
            typeof maybeWebhook === 'string'
                ? { url: maybeWebhook }
                : maybeWebhook,
        );
        client.send(value);
    },
    minecraft: (value) => {
        const packet: BroadcastC2S = {
            type: 'broadcast',
            message: value,
        };
        socket.send(JSON.stringify(packet));
    },
};

export function drain<K extends keyof TunnelSink>(
    key: K,
    value: TunnelSink[K],
    config: Config,
) {
    sinkDrains[key](value, config);
}
