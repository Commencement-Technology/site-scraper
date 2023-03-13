FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock .npmrc tsconfig.json /app/

RUN yarn install \
  --prefer-offline \
  --ignore-scripts \
  --frozen-lockfile \
  --non-interactive \
  --production \
  && rm -f .npmrc

COPY src /app/src
COPY prometheus /app/prometheus

RUN yarn add tsc && yarn build

EXPOSE 8080

CMD yarn start