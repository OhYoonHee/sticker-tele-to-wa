FROM node:16

COPY . /usr/app
WORKDIR /usr/app

RUN yarn install
# fixed installation bug
RUN yarn add canvas@2.6.1 
RUN yarn build

CMD [ "yarn", "start" ]