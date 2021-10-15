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

## Deploy to heroku
Get the [ENV Variables](#env-variables) and then click the button below!  

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2FOhYoonHee%2Fsticker-tele-to-wa&template=https%3A%2F%2Fgithub.com%2FOhYoonHee%2Fsticker-tele-to-wa)

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
$ npm install && npm install canvas@2.6.1
# or
$ yarn install && yarn add canvas@2.6.1
$ npm run build
# or
$ yarn build
# create .env and fill all value to that
$ yarn start
```

## How to use?
- Send sticker or photo to telegram bot
- Wait until bot convert telegram sticker to whatsapp sticker
- Its all step :v


## License
MIT License