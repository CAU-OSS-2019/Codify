#!/bin/bash
SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
docker stop codify-cpp-container 2> /dev/null
docker rm codify-cpp-container 2> /dev/null
docker create --log-driver=none --cpus=".5" --memory="128m" --name codify-cpp-container codify-cpp
