#!/bin/bash

SCRIPTPATH=$( cd "$(dirname "$0")" ; pwd )
ret=0 # exit code

# docker variables
con="codify-cpp-container" # docker container name
time_limit=10 # seconds

# submission variables
source_file=$1
stdout_file=$2
stderr_file=$3

echo "" > ${stdout_file}
echo "" > ${stderr_file}

if [ "$(docker ps -a -f name=${con} --format {{.Names}})" != "${con}" ]; then
  bash "${SCRIPTPATH}/docker-run.sh"
fi

docker cp "${source_file}" ${con}:/code/main.cpp
docker start ${con}
docker stop -t ${time_limit} ${con}
docker cp ${con}:/code/stdout.out "${stdout_file}"
docker cp ${con}:/code/stderr.out "${stderr_file}"

if [ "$(docker inspect ${con} --format='{{.State.ExitCode}}')" == "0" ]; then
  echo "OK"
  ret=0
else
  echo "FAIL"
  ret=1
fi

exit $ret
