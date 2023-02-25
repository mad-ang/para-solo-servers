# syntax=docker/dockerfile:1
FROM node:19-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "yarn.lock", "./server/tsconfig.server.json", "./"]
RUN yarn install --production
COPY . .
RUN yarn build
EXPOSE 8080 5002
CMD ["yarn", "start"]