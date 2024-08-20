import { mcToMarkdown, type Config } from 'mlem';
import type { MinecraftPlayer } from 'mlem/types/mlem';
import { markdownToMC } from 'mlem/util';

const webhookTemplate = (player: MinecraftPlayer) => ({
    username: player.name,
    avatarURL: `https://visage.surgeplay.com/face/128/${player.uuid}?no=ears`,
});

export const config: Config = {
    discord: {
        webhook: '',
        botToken: '',
        channel: '',
    },
    tunnels: [
        {
            from: 'discord',
            to: 'minecraft',
            fn: ({ author, content, attachments }) => ({
                translate: 'chat.type.text',
                with: [
                    {
                        text: author.displayName,
                        hoverEvent: {
                            action: 'show_text',
                            contents: {
                                text: `@${author.username} on Discord`,
                            },
                        },
                    },
                    {
                        text: '',
                        extra: [
                            ...markdownToMC(content),
                            ...attachments.map((attach) => ({
                                text: ' (media)',
                                color: 'aqua' as const,
                                clickEvent: {
                                    action: 'open_url' as const,
                                    value: attach.url,
                                },
                            })),
                        ],
                    },
                ],
            }),
        },
        {
            from: 'minecraftChat',
            to: 'discordWebhook',
            fn: ({ player, chat: { components } }) => ({
                content: mcToMarkdown(components),
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftJoin',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ description: display }],
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftLeave',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ description: display }],
                ...webhookTemplate(player),
            }),
        },
    ],
};
