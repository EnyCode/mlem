import { type Config } from 'mlem';
import type { MinecraftPlayer } from 'mlem/types/mlem';
import { markdownToMC, mcToMarkdown, titleCase } from 'mlem/util';

const avatar = (id: string) => `https://vzge.me/face/128/${id}?no=ears`;
const webhookTemplate = (player: MinecraftPlayer) => ({
    username: player.name,
    avatarURL: avatar(player.uuid),
});

const commandAvatar = avatar(
    'd174349f79311d104d7917d32bf7a0dcee423421ca9e8a131f2d402a3c538572',
);
const villagerAvatar = avatar(
    'cebd7badd31d92a2bde819d52f3cf0439f63ab118d696077225151197bb5eb17',
);

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
            from: 'minecraftServerMessage',
            to: 'discordWebhook',
            fn: ({ chat: { components } }) => ({
                content: mcToMarkdown(components),
                username: 'Server',
                avatarURL: commandAvatar,
            }),
        },
        {
            from: 'minecraftCommandFeedback',
            to: 'discordWebhook',
            fn: ({ feedback: { display }, sender }) => ({
                embeds: [{ description: `*${display}*` }],
                ...(sender
                    ? webhookTemplate(sender)
                    : { username: '@', avatarURL: commandAvatar }),
            }),
        },
        {
            from: 'minecraftJoin',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ title: display }],
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftLeave',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ title: display }],
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftAdvancement',
            to: 'discordWebhook',
            fn: ({ player, message, description }) => ({
                embeds: [
                    {
                        title: message.display,
                        description: description.display,
                    },
                ],
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftDeath',
            to: 'discordWebhook',
            fn: ({ player, message: { display } }) => ({
                embeds: [{ title: display }],
                ...webhookTemplate(player),
            }),
        },
        {
            from: 'minecraftVillagerDeath',
            to: 'discordWebhook',
            fn: ({ message: { display }, villager: { profession } }) => ({
                embeds: [{ title: display }],
                username: profession ? titleCase(profession) : 'Villager',
                avatarURL: villagerAvatar,
            }),
        },
    ],
};
