#!/bin/bash
echo $(pwd)
docker build ./TempMonWeb/. -t 4901-capstone2020/tempmonweb

sleep 2
docker build ./TempMonSensor/. -t 4901-capstone2020/tempmonsensor

echo Done building.
docker images
