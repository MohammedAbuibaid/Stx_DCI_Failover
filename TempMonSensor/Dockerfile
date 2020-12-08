FROM node:latest
EXPOSE 80

WORKDIR /app/
COPY package.json /app/

RUN npm install
RUN npm install pm2 -g

COPY server.js /app/
CMD ["pm2-runtime", "/app/server.js", "--watch"]
