import { WAConnection, MessageType, Mimetype } from '@adiwajshing/baileys';
import sharp from 'sharp';
import { Bot, Composer, Context, NextFunction, InlineKeyboard } from 'grammy';
import { createCanvas } from 'canvas';
import { StringSession } from './StringSession';
import { limit } from '@grammyjs/ratelimiter';
import * as https from 'https';
import env from './env';
import * as zlib from 'zlib';

const lottie = require('lottie-node');

const client = new WAConnection();
const bot = new Bot(env.BOT_TOKEN as string);
const middleware = new Composer();

let wa_regex = {
    debug: new RegExp("[/!]" + "debug" + "(?:[\\s\\n]|$)?([\\s\\S]+)?$", "i"),
    chat_id: new RegExp("[/!]" + "chat_id" + "(?:[\\s\\n]|$)?([\\s\\S]+)?$", "i")
}

client.logger.level = "fatal";

function download_url(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks: any[] = []

            res.on('error', (err) => reject(err));
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));;
        })
    });
}

function ungzip(input: zlib.InputType, options?: zlib.ZlibOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        zlib.gunzip(input, options || {}, (error, result) => {
            if (!error) resolve(result)
            else reject(Error(error as any))
        });
    });
}

async function getFileLink(bot: Bot, file_id: string, bot_token: string) {
    let get_file = await bot.api.getFile(file_id);
    let url = `https://api.telegram.org/file/bot${bot_token}/${get_file.file_path}`;
    return url;
}

async function proses_gambar(picture: Buffer): Promise<Buffer> {
    let im = await sharp(picture).metadata();
    let image = await sharp(picture);
    let size1 = im.width as number;
    let size2 = im.height as number;
    if ((size1 && size2) < 512) {
        let sizenew1; let sizenew2;
        let scale: number;
        if ((im.width as number) > (im.height as number)) {
            scale = 512 / size1;
            sizenew1 = 512;
            sizenew2 = size2 * scale;
        } else {
            scale = 512 / size2;
            sizenew1 = size1 * scale;
            sizenew2 = 512;
        }
        sizenew1 = Math.floor(sizenew1);
        sizenew2 = Math.floor(sizenew2);
        image = image.resize({
            width: sizenew1,
            height: sizenew2,
        });
    } else {
        image = image.resize(512, 512, {
            fit: "inside",
            position: 'center'
        });
    }
    let buffer = await image.webp({ quality: 55 }).toBuffer();
    return buffer;
}

async function connectWA() {
    const session = new StringSession(env.STRING_SESSION as string, true).auth_data;
    client.loadAuthInfo(session);
    await client.connect();
    client.on('chat-update', (chat) => {
        if (chat.messages && chat.hasNewMessage) {
            let update = chat.messages.all()[0];
            let update_json = update.toJSON() as any;
            if (update_json['ephemeralMessage']) {
                update_json['message'] = update_json['ephemeralMessage']['message'];
            }
            let chat_id = update_json.key.remoteJid;
            let from_me = update_json.key.fromMe as boolean;
            let check_text = [MessageType.text, MessageType.extendedText];
            let update_type = Object.keys(update_json.message)[0];
            if (check_text.includes(update_type as MessageType)) {
                let text = update_json.message[update_type];
                if (typeof text != 'string') {
                    text = update_json.message[update_type]['text'];
                }
                if (wa_regex.chat_id.test(text) && from_me) {
                    client.sendMessage(chat_id, `Chat Id this chat is : \`\`\`${chat_id}\`\`\``, MessageType.text);
                    return;
                } else if (wa_regex.debug.test(text)) {
                    console.log(JSON.stringify(update_json, null, 2));
                    client.sendMessage(chat_id, 'See you log...', MessageType.text);
                    return;
                }
            }
        }
    });
};

function proses_pesan(ctx: Context, next: NextFunction) {
    new Promise(async (resolve, reject) => {
        let loading = await ctx.reply('Mengubah sticker anda ke whatsapp.....', {
            reply_to_message_id: ctx.message?.message_id,
            allow_sending_without_reply: true
        });
        if (ctx.message?.sticker != undefined) {
            try {
                let url = await getFileLink(bot, ctx.message.sticker.file_id, bot.token);
                let file = await download_url(url);
                let photo;
                if (ctx.message.sticker.is_animated == false && ctx.message.sticker.set_name != undefined) {
                    photo = await proses_gambar(file);
                } else if (ctx.message.sticker.is_animated == false && typeof ctx.message.sticker.set_name == "string") {
                    photo = file;
                } else {
                    let jsonLottie = await ungzip(file);
                    let canvas = createCanvas(512, 512);
                    let parsed = JSON.parse(jsonLottie.toString());
                    let animation = lottie(parsed, canvas);
                    let frame = Math.floor(animation.getDuration(true) / 2);
                    animation.goToAndStop(frame, true);
                    photo = await sharp(canvas.toBuffer('image/png')).webp().toBuffer();
                }
                await client.sendMessage(env.GROUP_WA as string, photo, MessageType.sticker);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Success sending the sticker to whatsapp!!");
                resolve(true);
            } catch (e) {
                console.error(e);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Failed sending the sticker to whatsapp!!");
                reject(e);
            }
        } else if (ctx.message?.photo != undefined) {
            try {
                let message_photo = ctx.message.photo;
                let file_id = message_photo.pop()?.file_id as string;
                let url = await getFileLink(bot, file_id, bot.token);
                let file_photo = await download_url(url);
                let photo = await proses_gambar(file_photo);
                await client.sendMessage(env.GROUP_WA as string, photo, MessageType.sticker);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Success sending the sticker to whatsapp!!");
                resolve(true);
            } catch (e) {
                console.error(e);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Failed sending the sticker to whatsapp!!");
                reject(e);
            }
        } else if (ctx.message?.document != undefined && [Mimetype.jpeg, Mimetype.png, Mimetype.webp].includes(ctx.message.document.mime_type as any) && (ctx.message.document.file_size as number) <= 5242880) {
            try {
                let url = await getFileLink(bot, ctx.message.document.file_id, bot.token);
                let file_photo = await download_url(url);
                let photo = await proses_gambar(file_photo);
                await client.sendMessage(env.GROUP_WA as string, photo, MessageType.sticker);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Success sending the sticker to whatsapp!!");
                resolve(true);
            } catch (e) {
                console.error(e);
                await ctx.api.editMessageText(loading.chat.id, loading.message_id, "Failed sending the sticker to whatsapp!!");
                reject(e);
            }
        }
    })
}

middleware.use(limit({
    limit: 3,
    timeFrame: 1000,
    onLimitExceeded: (ctx) => false
}));

middleware.command('start', async (ctx) => {
    let reply_markup = new InlineKeyboard();
    if (env.UPDATE_CHANNEL) {
        reply_markup.url('My Channel', env.UPDATE_CHANNEL); 
    } if (env.SUPPORT_GROUP) {
        reply_markup.url('My Group', env.SUPPORT_GROUP);
    }
    let pesan = `Hello!! my name is ${ctx.me.first_name}, i can help you to convert telegram sticker to whatsapp sticker.`;
    pesan += "\nI only work in the specified chat."
    await ctx.reply(pesan, {
        reply_markup,
        reply_to_message_id: ctx.message?.message_id,
        allow_sending_without_reply: true
    })
});

middleware.filter(async (ctx) => String(ctx.chat?.id) == String(env.TELEGRAM_ID)).on(['message:sticker', 'message:photo', 'message:document'], (ctx, next) => new Promise((res) => res(proses_pesan(ctx, next))));

bot.use(async (ctx, next) => {
    new Promise(res => res(middleware.middleware()(ctx, next)))
});

process.once('SIGINT', () => {
    console.log('💬 Killing..');
    client.close();
    process.exit(0);
});

process.once('SIGTERM', () => {
    console.log('💬 Killing..');
    client.close();
    process.exit(0);
});

process.on('unhandledRejection', (e) => {
    console.log('Stopped');
    console.error('ERROR:', e);
    client.close();
    process.exit(0);
})

connectWA().then(() => {
    bot.start({
        drop_pending_updates: true,
        allowed_updates: ['message'],
        onStart(botinfo) {
            let bot_name = botinfo.first_name;
            console.log(bot_name, "ready!!");
        }
    })
}).catch((e) => {
    console.error(e);
    process.exit();
});