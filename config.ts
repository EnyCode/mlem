import { mcToMarkdown, type Config } from 'mlem';

export const config: Config = {
    discord: {
        webhook: '',
    },
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
            to: 'discord:webhook',
            fn: ({ message, player }) => ({
                content: mcToMarkdown(message),
                username: player.name,
                avatarURL: `https://visage.surgeplay.com/face/128/${player.uuid}?no=ears`,
            }),
        },
    ],
};
