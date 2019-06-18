#!/bin/bash

SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
ret=0 # exit code

# docker variables
con="codify-python-container" # docker container name
time_limit=10 # seconds

# submission variables
source_file=$1
stdin_file=$2
stdout_file=$3

echo "" > ${SCRIPTPATH}/stdout.out

if [ "$(docker ps -a -f name=${con} --format {{.Names}})" != "${con}" ]; then
  bash "${SCRIPTPATH}/docker-run.sh"
fi

docker cp "${source_file}" ${con}:/code/main.py > /dev/null
docker cp "${stdin_file}" ${con}:/code/stdin.in > /dev/null

docker start ${con} > /dev/null
docker stop -t ${time_limit} ${con} > /dev/null

#if [ "$(docker inspect ${con} --format='{{.State.ExitCode}}')" == "0" ]; then
if [ "$(diff --ignore-trailing-space --ignore-space-change --ignore-blank-lines --text -q ${SCRIPTPATH}/stdout.out ${stdout_file} 2>&1)" = "" ]; then
  echo "OK"
  ret=0
else
  echo "FAIL"
  ret=1
fi

rm ${SCRIPTPATH}/stdout.out

exit $ret
