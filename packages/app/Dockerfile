FROM node:14-alpine

WORKDIR /usr/src/app/

COPY ./packages/app/ .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
