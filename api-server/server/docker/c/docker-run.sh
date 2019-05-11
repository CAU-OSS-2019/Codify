#!/bin/bash
SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
docker stop codify-c-container 2> /dev/null
docker rm codify-c-container 2> /dev/null
docker create --log-driver=none --cpus=".5" --memory="128m" --name codify-c-container codify-c
