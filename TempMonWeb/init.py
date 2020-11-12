import subprocess
import pymongo
import requests
import time

server_proc = subprocess.Popen(['pm2', 'start', '/app/files/server.js', '--watch'],
        stdout=subprocess.PIPE,
        universal_newlines=True)
print("Started NodeJS Server")
mongo_proc = subprocess.Popen(['mongod', '--dbpath', '/app/db/'],
        stdout=subprocess.PIPE,
        universal_newlines=True)
print("Started MongoDB Server")
client = pymongo.MongoClient("mongodb://localhost:27017/")

while True:
    # Add process monitoring for mongo, could switch from pm2 and manually monitor
    # Also the adding to db could be moved to server.js and this file could be discarded entirely

    try:
        temps = client["temp-mon-db"]["temperatures"]
        temps.insert_one({
            "temperature": float(requests.get("http://sensor/latest").text),
            "timestamp": int(requests.get("http://showcase.api.linx.twenty57.net/UnixTime/tounixtimestamp?datetime=now").json()["UnixTimeStamp"])
        })
    except:
        pass
    time.sleep(60)
