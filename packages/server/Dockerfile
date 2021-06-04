FROM node:14-alpine

WORKDIR /usr/src/server/

COPY ./packages/server/ .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD [ "node", "./build/src/server.js" ]