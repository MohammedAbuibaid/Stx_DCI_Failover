
import subprocess
import pymongo
import requests
import time
import os

mongo_proc = subprocess.Popen(['mongod', '--dbpath', '/db/', '--bind_ip_all'],
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
            "temperature": float(requests.get(os.environ['SENSOR_URL'] + "/latest").text),
            "timestamp": time.time()
        })
    except:
        pass
    time.sleep(1)
