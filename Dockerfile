FROM nikolaik/python-nodejs:python3.8-nodejs14

COPY . /usr/app
WORKDIR /usr/app

RUN yarn install
# fixed installation bug
RUN yarn add canvas@2.6.1 
RUN yarn build

CMD [ "yarn", "start" ]