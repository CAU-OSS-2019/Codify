FROM python:3.7
RUN ["mkdir", "code"]
RUN ["chmod", "777", "code"]
RUN ["useradd", "tester"]
WORKDIR /code
USER tester
CMD ["/bin/bash", "-c", "/usr/local/bin/python3 main.py < stdin.in tail -c 11M > stdout.out 2 > stderr.out"]