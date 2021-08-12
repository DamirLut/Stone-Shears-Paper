import Client from "../Client";
import { IEvent } from "../types";

const Ready: IEvent = {
    once: true,
    execute: async (client: Client) => {
        console.log("Logged as: " + client.user?.username);

        client.localStorage = {
            activeDuel: [],
        };
    },
};
export default Ready;
