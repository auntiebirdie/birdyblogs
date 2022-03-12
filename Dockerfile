FROM google/cloud-sdk:alpine

WORKDIR /usr/app

COPY . .

RUN apk update && apk add nodejs nodejs-npm
RUN npm ci

CMD [ "node", "index.js"]
