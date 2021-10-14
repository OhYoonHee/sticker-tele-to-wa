FROM node:16

COPY . /usr/app
WORKDIR /usr/app

RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]