#!/bin/bash
SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
docker build -t codify-c ${SCRIPTPATH}
