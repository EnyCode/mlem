import { Config, markdown } from './mlem';

export const config: Config = {
    tunnels: [
        {
            from: 'discord',
            to: 'minecraft',
            fn: ({ author, content, attachments }) => ({
                translate: 'chat.type.text',
                with: [
                    {
                        text: author.name,
                        hoverEvent: {
                            action: 'show_text',
                            contents: { text: `@${author.username}` },
                        },
                    },

                    {
                        text: content,
                        extra: attachments
                            ? [
                                  {
                                      text: ' (media)',
                                      clickEvent: {
                                          action: 'open_url' as const,
                                          value: attachments[0].url,
                                      },
                                  },
                              ]
                            : undefined,
                    },
                ],
            }),
        },
        {
            from: 'minecraft:chat',
            to: 'discord',
            fn: ({ message, player }) => ({
                content: markdown(message),
                username: player.name,
                avatar_url: `https://example.com/head/${player.uuid}.png`,
            }),
        },
    ],
};
