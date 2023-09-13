/**
 * @author Icseon <me@icseon.com>
 * @description This method will convert a sequence of bytes that represent a MAC address
 *              to a human readable MAC address.
 * @param buffer
 * @param offset
 */
export const ReadMacAddress = (buffer: Buffer, offset: number) => {

    /* Retrieve the byte sequence from the buffer */
    const sequence:Buffer = Buffer.alloc(6);
    buffer.copy(sequence, 0, offset, offset + 6);

    /* Initialize empty array for the bytes */
    let bytes:Array<String> = [];

    for (let i = 0; i < sequence.length; i++)
    {

        /* Convert byte to hexadecimal (radix of 16) */
        let hexadecimal = sequence.readUInt8(i).toString(16);

        if (hexadecimal.length < 2)
        {
            hexadecimal = `0${hexadecimal}`;
        }

        /* Add hexadecimal to bytes array */
        bytes.push(hexadecimal);

    }

    return bytes.join(":");

}