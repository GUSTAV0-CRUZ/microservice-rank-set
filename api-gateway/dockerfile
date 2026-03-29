FROM node:21-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production


FROM node:21-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]