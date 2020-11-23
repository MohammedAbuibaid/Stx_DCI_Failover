#!/bin/bash
echo $(pwd)

docker build ./TempMonWeb/. -t sifotes/4901capstone-tempmonweb

sleep 2
docker build ./TempMonSensor/. -t sifotes/4901capstone-tempmonsensor

echo Done building.

docker images
docker login && docker push sifotes/4901capstone-tempmonweb
docker login && docker push sifotes/4901capstone-tempmonsensor