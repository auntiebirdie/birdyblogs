FROM google/cloud-sdk:alpine

WORKDIR /usr/app

COPY . .

RUN apk update && apk add nodejs nodejs-npm
RUN npm ci
RUN gsutil cp gs://squawkstorage/secrets.json secrets.json

CMD [ "node", "index.js"]
