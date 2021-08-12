import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ICommand } from "../types";
import Client from "../Client";

const Ping: ICommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping to bot"),
    execute: async (client: Client, event: CommandInteraction) => {
        event.reply("Pong");
    },
};
export default Ping;
