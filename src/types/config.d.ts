import type { TunnelSink, TunnelSource } from './tunnel';

export type Config = {
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
