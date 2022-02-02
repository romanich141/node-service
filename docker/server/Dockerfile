FROM node:17-alpine

WORKDIR '/var/www/html'
COPY ./ /var/www/html

RUN npm i nodemon -g

CMD [ "nodemon", "/var/www/html/index.js" ]
