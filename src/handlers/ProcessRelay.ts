import { Store, handleError } from "../RelayServer";
import { RemoteInfo, Socket } from "dgram";
import BufferException from "../builtin/BufferException";

import createDebugMessages from "debug";
const debug = createDebugMessages("Icseon.XboxRelayServer.Handlers.ProcessRelay");

const DESTINATION_GLOBAL : string = 'ff:ff:ff:ff:ff:ff';

/**
 * @author Icseon <me@icseon.com>
 * @description This method will process relay messages
 * @param buffer
 * @param destinationAddress
 * @param sourceAddress
 * @param details
 */
export const processRelay = (buffer: Buffer, destinationAddress: string, sourceAddress: string, details: RemoteInfo) => {

    /* Do we already know about the connection? If not - we want to know about the connection now */
    if (!Store.xboxClients.has(sourceAddress))
    {
        Store.addClient(sourceAddress, details);
    }

    /* Attempt retrieval of the xboxClient instance which belongs to our own connection */
    const xboxClient = Store.xboxClients.get(sourceAddress);

    /* If the xboxClient instance does not exist, we are going to throw an error indicating that the client could not be found */
    if (!xboxClient)
    {
        return handleError(new BufferException(BufferException.CLIENT_NOT_FOUND));
    }

    /* Verify whether the IP address stored in the retrieved xboxClient instance matches the address from the remote information object */
    if (xboxClient.remoteAddress !== details.address)
    {
        return handleError(new BufferException(BufferException.ADDRESS_MISMATCH));
    }

    /* Update lastPacket timestamp for our xboxClient instance since we processing a message */
    xboxClient.lastPacket = new Date();

    switch(destinationAddress)
    {

        case DESTINATION_GLOBAL:

            /* Loop through all xboxClients and send the payload to everyone */
            for (const [address, xboxClient] of Store.xboxClients)
            {

                /* We do never send to ourselves */
                if (address === sourceAddress)
                    continue;

                /* Send buffer to the remote xboxClient */
                if (Store.server instanceof Socket)
                {
                    Store.server.send(buffer, xboxClient.remotePortNumber, xboxClient.remoteAddress);
                }

                debug(`${sourceAddress} (${xboxClient.remoteAddress}) has broadcast to ${Store.xboxClients.size - 1} client(s)`);

            }
            break;

        default:

            /* Do not allow sending to self */
            if (sourceAddress === destinationAddress)
                return handleError(new BufferException(BufferException.DESTINATION_OWN));

            /* Retrieve remote client from the store */
            const remoteClient = Store.xboxClients.get(destinationAddress);

            /* Check if the remote client could be found */
            if (!remoteClient)
                return handleError(new BufferException(BufferException.UNKNOWN_DESTINATION));

            /* Send buffer to the remote client */
            if (Store.server instanceof Socket)
            {
                Store.server.send(buffer, remoteClient.remotePortNumber, remoteClient.remoteAddress);
            }

            debug(`${sourceAddress} (${xboxClient.remoteAddress}) has broadcast to ${destinationAddress} (${remoteClient.remoteAddress})`);
            break;

    }

}