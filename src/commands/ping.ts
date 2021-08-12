import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ICommand } from "../types";
import Client from "../Client";

const Ping: ICommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping to bot"),
    execute: async (client: Client, event: CommandInteraction) => {
        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Сурсы")
                .setStyle("LINK")
                .setURL("https://github.com/DamirLut/Stone-Shears-Paper")
        );
        event.reply({
            content: "Pong",
            components: [buttons],
        });
    },
};
export default Ping;
