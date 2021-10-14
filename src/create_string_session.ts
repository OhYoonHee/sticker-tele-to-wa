import { WAConnection } from '@adiwajshing/baileys';
import { StringSession } from './StringSession';

async function main() {
    const client = new WAConnection();
    client.connectOptions.phoneResponseTime = 1000*1000*1000;
    client.logger.level = "fatal";
    await client.connect();
    const AuthInfo = client.base64EncodedAuthInfo();
    const session = new StringSession(AuthInfo);
    await client.close();
    console.clear();
    console.log("Your session string :\n" + session.string_session);
    return;
}

main().then();