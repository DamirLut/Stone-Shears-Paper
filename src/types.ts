import { CommandInteraction, Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export interface ICommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute(...args: any[]): any;
}
export interface IEvent {
    once?: boolean;
    execute(...args: any[]): any;
}

export enum DuelAction {
    NONE,
    STONE,
    SHEARS,
    PAPER,
}

export interface IDuel {
    attacker: string;
    defender: string;
    amount: number;
    attacker_action: DuelAction;
    defender_action: DuelAction;
    message: CommandInteraction;
}

export interface IlocalStorage {
    activeDuel: Array<IDuel>;
}
