FROM node:19-alpine
WORKDIR /srv/www/app
COPY package*.json ./
COPY . .
ADD src /srv/www/app
RUN npm install
RUN npm run build
EXPOSE 3003
CMD [ "node", "./build/index.js" ]

