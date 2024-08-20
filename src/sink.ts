import { WebhookClient } from 'discord.js';
import type { TunnelSink } from './types/tunnel';
import type { Config } from 'mlem';

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
    minecraft: (value, config) => {
        //
    },
};

export function drain<K extends keyof TunnelSink>(
    key: K,
    value: TunnelSink[K],
    config: Config,
) {
    sinkDrains[key](value, config);
}
