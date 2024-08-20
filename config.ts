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
            from: 'minecraftChat',
            to: 'discordWebhook',
            fn: ({ chat: { components }, player }) => ({
                content: mcToMarkdown(components),
                username: player.name,
                avatarURL: `https://visage.surgeplay.com/face/128/${player.uuid}?no=ears`,
            }),
        },
        {
            from: 'minecraftJoin',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ description: display }],
                username: player.name,
                avatarURL: `https://visage.surgeplay.com/face/128/${player.uuid}?no=ears`,
            }),
        },
        {
            from: 'minecraftLeave',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ description: display }],
                username: player.name,
                avatarURL: `https://visage.surgeplay.com/face/128/${player.uuid}?no=ears`,
            }),
        },
    ],
};
