import * as DiscordJS from "discord.js";
import { Collection, ClientOptions } from "discord.js";
import { ICommand, IEvent, IlocalStorage } from "./types";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

interface IConfig {
    token: string;
    client_id: string;
}

export default class Client extends DiscordJS.Client {
    public commands: Collection<string, (...args: any[]) => void>;
    private _rest: REST;
    private config: IConfig;
    public localStorage!: IlocalStorage;

    constructor(option: ClientOptions, config: IConfig) {
        super(option);
        this.config = config;
        this._rest = new REST({ version: "9" }).setToken(config.token);
        this.commands = new Collection();

        this.loadComponents();

        this.login(config.token);
    }

    private loadJS(path: string) {
        const files = [];
        const _files = fs
            .readdirSync(path)
            .filter((file) => file.endsWith(".js"));
        for (const file of _files) {
            files.push({
                name: file.split(".").shift() || "",
                data: require(`${path}/${file}`).default,
            });
        }
        return files;
    }

    private loadComponents(): void {
        /// Load Events;
        const eventsFiles = this.loadJS(`${__dirname}/events`);
        for (const file of eventsFiles) {
            const event = file.data as IEvent;
            const eventName = file.name;
            const listener = (...args: any[]) => {
                event.execute(this, ...args);
            };
            if (event.once) {
                this.once(eventName, listener);
            } else {
                this.on(eventName, listener);
            }
            console.log(`Event '${eventName}' loaded`);
        }
        /// Load Commands;
        const commands = [];
        const commandsFiles = this.loadJS(`${__dirname}/commands`);
        for (const file of commandsFiles) {
            const command = file.data as ICommand;
            const listener = (...args: any[]) => {
                command.execute(this, ...args);
            };
            this.commands.set(command.data.name, listener.bind(this));
            commands.push(command.data.toJSON());
            console.log(`Command '${command.data.name}' loaded`);
        }
        (async () => {
            try {
                console.log("Started refreshing application (/) commands.");
                await this._rest.put(
                    Routes.applicationCommands(this.config.client_id),
                    { body: commands }
                );

                console.log("Successfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
