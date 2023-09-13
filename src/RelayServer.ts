import dgram from "node:dgram";
import { ReadMacAddress } from "./utils/MacAddress";

import createDebugMessages from "debug";
const debug = createDebugMessages("Icseon.XboxRelayServer.Server");

import BufferException from "./builtin/BufferException";

import ApplicationStore from "./classes/ApplicationStore";
import { processRelay } from "./handlers/ProcessRelay";
import { RemoteInfo, Socket } from "dgram";

export const Store = new ApplicationStore();

/**
 * @author Icseon <me@icseon.com>
 * @description This method will start the server
 * @param port
 */
export const createRelayServer = (port: number = 9938) => {

    /* Create socket and begin bind */
    const relayServer: dgram.Socket = dgram.createSocket("udp4");
    relayServer.bind(port);
    debug(`Relay server bind on port: ${port}`);

    relayServer.on("message", (buffer: Buffer, details: RemoteInfo) => {

        /* The buffer length must be at least 12 */
        if (buffer.length < 12)
        {
            return handleError(new BufferException(BufferException.INVALID_LENGTH));
        }

        /* Read destination and source address from buffer */
        const destination: string = ReadMacAddress(buffer, 0);
        const source: string = ReadMacAddress(buffer, 6);

        /* Process message */
        if (Store.server instanceof Socket)
        {
            processRelay(buffer, destination, source, details);
        }

    });

    setInterval(() => {
        Store.removeExpiredClients();
    }, 1000);

    Store.server = relayServer;

}

/**
 * @author Icseon <me@icseon.com>
 * @description This method is used for error handling
 * @param error
 */
export const handleError = (error: any) => {

    if (error instanceof BufferException)
    {
        return debug(`A buffer exception has been thrown: ${error.message}`);
    }

    debug(`An unknown exception has been thrown: ${error.message} [${error.stack}]`);

}