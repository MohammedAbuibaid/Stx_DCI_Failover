FROM node:latest
WORKDIR /app/
COPY package*.json /app/

RUN npm install
RUN npm install pm2 -g

RUN apt update && apt -y install python3 python3-pip mongodb
RUN python3 -m pip install pymongo requests

COPY init.py /app/
ADD files /app/files/
CMD ["python3", "/app/init.py"]
