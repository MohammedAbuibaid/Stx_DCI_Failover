FROM node:latest
EXPOSE 80
WORKDIR /app/

COPY package.json /app/
RUN mkdir /app/db/

RUN npm install
RUN npm install pm2 -g

ADD files /app/files/

CMD ["pm2-runtime", "start", "/app/files/server.js", "--watch"]
