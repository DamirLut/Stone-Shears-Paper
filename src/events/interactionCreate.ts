import { CommandInteraction } from "discord.js";
import { DuelAction, IEvent } from "../types";
import Client from "../Client";

const onMessage: IEvent = {
    once: false,
    execute: async (client: Client, interaction: CommandInteraction) => {
        if (interaction.isCommand()) {
            if (!client.commands.has(interaction.commandName)) return;

            try {
                const execute = client.commands.get(interaction.commandName);
                if (execute) return await execute(interaction);
                return await interaction.reply({
                    content: "Callback not found",
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
        if (interaction.isButton()) {
            for (let i = 0; i < client.localStorage.activeDuel.length; i++) {
                const duel = client.localStorage.activeDuel[i];
                if (
                    duel.attacker == interaction.user.id ||
                    duel.defender == interaction.user.id
                ) {
                    const action =
                        duel.attacker == interaction.user.id
                            ? "attacker_action"
                            : "defender_action";
                    switch (interaction.customId.toUpperCase()) {
                        case "PAPER":
                            duel[action] = DuelAction.PAPER;
                            break;
                        case "SHEARS":
                            duel[action] = DuelAction.SHEARS;
                            break;
                        case "STONE":
                            duel[action] = DuelAction.STONE;
                            break;
                    }
                    let content = `<@${duel.attacker}> вызвал на дуэль <@${duel.defender}> со ставкой ${duel.amount}\n`;

                    if (
                        duel.attacker_action != DuelAction.NONE &&
                        duel.defender_action != DuelAction.NONE
                    ) {
                        const typesAction = [
                            "Ничего",
                            "Камень",
                            "Ножницы",
                            "Бумага",
                        ];
                        content += `\n<@${duel.attacker}>: ${
                            typesAction[duel.attacker_action]
                        }`;
                        content += `\n<@${duel.defender}>: ${
                            typesAction[duel.defender_action]
                        } `;

                        if (duel.attacker_action == duel.defender_action) {
                            content += "\n\n Ничья, все забрали свои ставки";
                            interaction.reply({
                                content: `Вам вернули: ${duel.amount}`,
                                ephemeral: true,
                            });
                        } else {
                            let win = "";
                            switch (duel.attacker_action) {
                                case DuelAction.PAPER: {
                                    switch (duel.defender_action) {
                                        case DuelAction.SHEARS: {
                                            win = duel.defender;
                                            break;
                                        }
                                        case DuelAction.STONE: {
                                            win = duel.attacker;
                                        }
                                    }
                                    break;
                                }
                                case DuelAction.SHEARS: {
                                    switch (duel.defender_action) {
                                        case DuelAction.STONE: {
                                            win = duel.defender;
                                            break;
                                        }
                                        case DuelAction.PAPER: {
                                            win = duel.attacker;
                                        }
                                    }
                                    break;
                                }
                                case DuelAction.STONE: {
                                    switch (duel.defender_action) {
                                        case DuelAction.PAPER: {
                                            win = duel.defender;
                                            break;
                                        }
                                        case DuelAction.SHEARS: {
                                            win = duel.attacker;
                                        }
                                    }
                                    break;
                                }
                            }
                            content += `\n\nДуэль выиграл <@${win}>`;
                            interaction.reply({
                                content:
                                    win == interaction.user.id
                                        ? `Вы выиграли: ${duel.amount * 2}`
                                        : `Вы проиграли`,
                                ephemeral: true,
                            });
                        }
                        duel.message.editReply({
                            content,
                            components: [],
                        });

                        return client.localStorage.activeDuel.splice(i, 1);
                    } else {
                        content += `\n<@${duel.attacker}>: ${
                            duel.attacker_action != DuelAction.NONE
                                ? "Выбрал действие"
                                : "Ожидание"
                        } `;
                        content += `\n<@${duel.defender}>: ${
                            duel.defender_action != DuelAction.NONE
                                ? "Выбрал действие"
                                : "Ожидание"
                        }`;
                        return duel.message.editReply(content);
                    }
                }
            }
            return interaction.reply("Вы не участвуете в данном дуэли :(");
        }
    },
};
export default onMessage;
