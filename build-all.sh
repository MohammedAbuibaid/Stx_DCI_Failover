#!/bin/bash
echo $(pwd)

docker build ./TempMonWeb/. -t sifotes/4901capstone-tempmonweb:demo --no-cache

sleep 2
docker build ./TempMonSensor/. -t sifotes/4901capstone-tempmonsensor:demo --no-cache

sleep 2
docker build ./TempMonDB/. -t sifotes/4901capstone-tempmondb:demo --no-cache


echo Done building.

docker images
docker login && docker push sifotes/4901capstone-tempmonweb:demo
docker login && docker push sifotes/4901capstone-tempmonsensor:demo
docker login && docker push sifotes/4901capstone-tempmondb:demo
