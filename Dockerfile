FROM nikolaik/python-nodejs:python3.8-nodejs14

COPY . /usr/app
WORKDIR /usr/app

RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]