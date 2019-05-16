FROM gcc:9.1
RUN ["mkdir", "code"]
RUN ["chmod", "777", "code"]
RUN ["useradd", "tester"]
WORKDIR /code
USER tester
CMD ["/bin/bash", "-c", "printf '' > stdout.out && printf '' > stderr.out && /usr/local/bin/gcc -w -O2 -std=c11 main.c 2> stderr.out && set -o pipefail && ./a.out | head -c 1M > stdout.out"]
