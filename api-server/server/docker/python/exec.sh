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
stderr_file=$4

echo "" > ${stdout_file}
echo "" > ${stderr_file}

if [ "$(docker ps -a -f name=${con} --format {{.Names}})" != "${con}" ]; then
  bash "${SCRIPTPATH}/docker-run.sh"
fi

docker cp "${source_file}" ${con}:/code/main.py
docker cp "${stdin_file}" ${con}:/code/stdin.in
docker start ${con}
docker stop -t ${time_limit} ${con}
docker cp ${con}:/code/stdout.out "${stdout_file}"
docker cp ${con}:/code/stderr.out "${stderr_file}"

while read line; do
  echo $line
done < ${stderr_file}

#if [ "$(diff --ignore-trailing-space --ignore-space-change --ignore-blank-lines --text -q ${SCRIPTPATH}/stdout.out ${stdout_file} 2>&1)" = "" ]; then
if [ -s ${stderr_file} ]; then
  echo "FAIL"
  ret=1
else
  echo "OK"
  ret=0
fi

exit $ret
