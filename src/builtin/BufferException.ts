export default class BufferException extends Error {

    public static INVALID_LENGTH: string = "The received buffer has an invalid length";
    public static CLIENT_NOT_FOUND: string = "The client belonging to our connection could not be found";
    public static ADDRESS_MISMATCH: string = "The received buffer contains an invalid origin address";
    public static UNKNOWN_DESTINATION: string = "The destination of the payload is not known";
    public static DESTINATION_OWN: string = "Unable to send payload to destination because the destination is equal to the source";

    constructor(public message: string)
    {
        super(message);
        this.name = "BufferException";
        this.stack = (<any> new Error()).stack;
    }

}