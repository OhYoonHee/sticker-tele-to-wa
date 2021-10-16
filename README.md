# Sticker Telegram to Whatsapp
Convert telegram sticker or photo to whatsapp sticker

## ENV Variables
> REQUIRED VARIABLE
- `BOT_TOKEN` - Telegram bot token get it from [@botfather](https://t.me/botfather)
- `GROUP_WA` - Telegram chat id, where bot can work
- `STRING_SESSION` - More information in [here](./tutorial/session.md)
- `GROUP_WA` - More information in [here](./tutorial/chat_id.md)
> OPTIONAL VARIABLE
- `UPDATE_CHANNEL` - Update channel link
- `SUPPORT_GROUP` - Support group link

## Deploy to [heroku](https://heroku.com/)
Get the [ENV Variables](#env-variables) and then click the button below!  

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FOhYoonHee%2Fsticker-tele-to-wa&template=https%3A%2F%2Fgithub.com%2FOhYoonHee%2Fsticker-tele-to-wa)

## Deploy to [replit](https://replit.com/)
Get the [ENV Variables](#env-variables) and then click the button below!

[![Deploy on Repl.it](https://replit.com/badge/github/OhYoonHee/sticker-tele-to-wa)](https://repl.it/github/OhYoonHee/sticker-tele-to-wa)

After deploy to replit, fill all env variable to replit variable.
> WARNING!!

> When a build not found module error appears, please run the command `yarn build`

## Local deploy
> Requirements
* git
* nodejs 14+
* yarn or npm
* python 3.8+

> Step
```shell
$ git clone https://github.com/OhYoonHee/sticker-tele-to-wa.git
$ cd sticker-tele-to-wa
$ npm install
# or
$ yarn install
$ npm run build
# or
$ yarn build
# create .env and fill all value to that
$ yarn start
```

> If you use npm, you can delete yarn.lock file.

> if you found any error you can report it to [support group](https://t.me/TarianaBicara)

## How to use?
- Send sticker or photo to telegram bot
- Wait until bot convert telegram sticker to whatsapp sticker
- Its all step :v

## License
MIT License