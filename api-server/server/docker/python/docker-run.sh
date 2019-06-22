#!/bin/bash
SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
docker stop codify-python-container 2> /dev/null
docker rm codify-python-container 2> /dev/null
docker create --log-driver=none --cpus=".5" --memory="128m" --name codify-python-container codify-python