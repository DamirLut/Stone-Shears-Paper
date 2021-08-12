import { Intents } from "discord.js";
import Client from "./Client";
import config from "./config.json";

const client = new Client(
    {
        intents: [Intents.FLAGS.GUILDS],
    },
    config.discord
);
