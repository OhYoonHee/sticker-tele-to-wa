import { AnyAuthenticationCredentials } from '@adiwajshing/baileys';
import * as lzstring from 'lz-string';

export class StringSession {

    readonly auth_data: AnyAuthenticationCredentials|string;

    constructor(AuthData: AnyAuthenticationCredentials|string, string_session:boolean = false) {
        this.auth_data = AuthData;
        if (string_session) {
            this.auth_data = this.encodeSession(AuthData as string);
        }
    }

    encodeSession(string_session: string): any {
        return JSON.parse(lzstring.decompressFromBase64(string_session) as string)
    }
    get string_session(): string {
        return lzstring.compressToBase64(JSON.stringify(this.auth_data));
    }

}