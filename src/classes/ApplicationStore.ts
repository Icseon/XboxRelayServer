import XboxClient from "./XboxClient";
import { RemoteInfo } from "dgram";
import dgram from "node:dgram";

import createDebugMessages from "debug";
const debug = createDebugMessages("Icseon.XboxRelayServer.Classes.ApplicationStore");

export default class ApplicationStore {
    xboxClients: Map<String, XboxClient>;
    server: dgram.Socket | null

    constructor()
    {
        this.xboxClients = new Map();
        this.server = null;
    }

    addClient(sourceAddress: String, details:RemoteInfo)
    {

        /* Construct a new XboxClient instance for our connection */
        const xboxClient:XboxClient = new XboxClient(details.address, details.port);

        /* Add the newly constructed XboxClient instance to the Store's xboxClients map */
        this.xboxClients.set(sourceAddress, xboxClient);

        debug(`New peer for ${sourceAddress} created and attached to ${xboxClient.remoteAddress}:${xboxClient.remotePortNumber}`);
        this.getConnectedCount();

    }

    removeClient(sourceAddress: String)
    {
        this.xboxClients.delete(sourceAddress);
        debug(`${sourceAddress} has disconnected`);
        this.getConnectedCount();
    }

    getConnectedCount()
    {
        debug(`${this.xboxClients.size} client(s) currently connected to the relay server`);
    }

    removeExpiredClients()
    {

        for (const [address, client] of this.xboxClients)
        {

            const secondsAfterLastPacket = Math.round((new Date().getTime() - client.lastPacket.getTime()) / 1000);

            if (secondsAfterLastPacket >= 90)
            {
                this.removeClient(address);
            }

        }

    }

}