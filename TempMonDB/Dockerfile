FROM mongo:latest
EXPOSE 27017

RUN mkdir /db/
RUN apt update && apt -y install python3 python3-pip
RUN python3 -m pip install pymongo requests

COPY ./init.py /startup/

CMD python3 /startup/init.py
