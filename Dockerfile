# syntax=docker/dockerfile:1
FROM node:19-alpine

ENV NODE_ENV=production
WORKDIR .
COPY ["package.json", "package-lock.json*", "yarn.lock", "./server/tsconfig.server.json", "./"]
RUN yarn install --production
RUN yarn heroku-postbuild
EXPOSE 80 
CMD ["yarn", "start"]