import { DuelAction, IDuel } from "./../types";
import {
    CommandInteraction,
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageButton,
    User,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ICommand } from "../types";
import Client from "../Client";

const Duel: ICommand = {
    data: new SlashCommandBuilder()
        .setName("duel")
        .setDescription("Вызвать на дуэль в камень - ножницы - бумага")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Ставка денег")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Вызвать пользователя на дуэль")
                .setRequired(false)
        ),
    execute: async (client: Client, event: CommandInteraction) => {
        const amount = event.options.getInteger("amount") || 0;
        let mention = event.options.getUser("user");
        if (mention === null) mention = client.user as User;

        if (mention.id === event.user.id) {
            return event.reply({
                content: "Нельзя вызывать дуэль с самим собой",
                ephemeral: true,
            });
        }
        for (const duels of client.localStorage.activeDuel) {
            if (
                duels.attacker == event.user.id ||
                duels.defender == event.user.id
            ) {
                return event.reply({
                    content: "Вы уже участвуете в дуэли",
                    ephemeral: true,
                });
            }
            if (
                mention.id !== client?.user?.id &&
                (duels.attacker == mention.id || duels.defender === mention.id)
            ) {
                return event.reply({
                    content: "Противник уже участвует в дуэли",
                    ephemeral: true,
                });
            }
        }

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Камень")
                .setStyle("DANGER")
                .setCustomId("stone"),
            new MessageButton()
                .setLabel("Ножницы")
                .setStyle("PRIMARY")
                .setCustomId("shears"),
            new MessageButton()
                .setLabel("Бумага")
                .setStyle("SUCCESS")
                .setCustomId("paper")
        );

        const isBot = mention.id === client.user?.id;
        let content = `<@${event.user.id}> вызвал на дуэль <@${mention.id}> со ставкой ${amount}\n`;
        content += `${event.user.username}: Ожидание`;
        if (isBot) {
            content += `\n${mention.username}: Выбрал действие `;
        } else {
            content += `\n${mention.username}: Ожидание`;
        }

        await event.reply({
            content,
            components: [buttons],
        });
        const duel: IDuel = {
            attacker: event.user.id,
            defender: mention.id,
            amount,
            attacker_action: DuelAction.NONE,
            defender_action: isBot
                ? [DuelAction.PAPER, DuelAction.SHEARS, DuelAction.STONE][
                      Math.floor(Math.random() * 2)
                  ]
                : DuelAction.NONE,
            message: event,
        };
        client.localStorage.activeDuel.push(duel);
    },
};
export default Duel;
