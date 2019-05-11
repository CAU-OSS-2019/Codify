FROM gcc
RUN ["mkdir", "code"]
RUN ["chmod", "777", "code"]
RUN ["useradd", "tester"]
WORKDIR /code
USER tester
CMD ["/bin/bash", "-c", "printf '' > stdout.out && printf '' > stderr.out && /usr/local/bin/gcc -w main.c 2> stderr.out && ./a.out | head -c 1M > stdout.out"]
