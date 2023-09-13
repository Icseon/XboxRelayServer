export default class XboxClient {

    /* Remote address of the client */
    remoteAddress: string;

    /* Remote port number of the client */
    remotePortNumber: number;

    /* Date of last packet received from this client */
    lastPacket: Date;

    constructor(remoteAddress: string, remotePortNumber: number)
    {
        this.remoteAddress = remoteAddress;
        this.remotePortNumber = remotePortNumber;
        this.lastPacket = new Date();
    }

}