import type { WebhookClientDataIdWithToken } from 'discord.js';
import type { TunnelSink, TunnelSource } from './tunnel';

export type Config = {
    discord?: {
        webhook?: WebhookClientDataIdWithToken | string;
    };

    tunnels: {
        [Source in keyof TunnelSource]: {
            [Sink in keyof TunnelSink]: {
                from: Source;
                to: Sink;
                fn: (value: TunnelSource[Source]) => TunnelSink[Sink];
            };
        }[keyof TunnelSink];
    }[keyof TunnelSource][];
};
