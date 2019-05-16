# api-server

* 컴파일 요청 및 소스를 받아서 실행 결과를 돌려주는 API 서버입니다.
* REST 기반의 API를 지원하며, json 형식으로 입출력합니다.
* python3, django, docker 등을 사용합니다.
* 서버 설치는 bash 환경을 사용할 수 있는 리눅스만 지원합니다. (Ubuntu 18.04에서 테스트)

## 서버 설치법
1. 먼저 python3, pip3(또는 pip), docker를 모두 설치하세요.
2. `api-server/server` 디렉토리로 들어와주세요. (manage.py가 있는 디렉토리입니다.)
3. `pip3 install -r requirements.txt` 로 파이썬 패키지를 설치하세요. (pip을 사용하셔도 됩니다.)
4. `python3 manage.py migrate` 로 DB 스키마를 생성하세요. 기본값으로 sqlite3을 사용합니다.
5. `sudo ./docker-build-full.sh` 로 docker image를 생성하세요.

## 서버 실행법
* 주의 : 이 방법은 개발용 서버를 위한 것이며, 배포용으로는 적합하지 않습니다.
1. `api-server/server` 디렉토리로 들어와주세요. (manage.py가 있는 디렉토리입니다.)
2. `sudo ./docker-run-full.sh` 로 docker container를 생성하세요.
3. `python3 manage.py runserver 0:8000 &` 로 웹 서버를 실행하세요. (8000번 포트 사용)
4. `python3 manage.py process_tasks &` 로 컴파일 서버를 실행하세요.
5. 로그가 쌓여서 화면이 제대로 안 보이면 `clear` 를 입력하세요.
6. 서버를 종료하고 싶으면 `killall python3` 을 입력하세요.

## API 가이드
* 모두 json 형식입니다.

### POST /api/compile
설명 : 소스 코드를 서버로 전송하고 컴파일 요청을 합니다.  
컴파일은 비동기로 진행되므로, API 요청에 대한 응답 자체는 바로 오며 컴파일 결과는 나중에 확인합니다.

#### Request
1. lang (string) : 컴파일 언어입니다. ("c"라고 쓰면 C언어, "cpp"라고 쓰면 C++를 나타냅니다.)
2. code (string) : 소스 코드입니다.

#### Request Example
```
{  
  "lang": "c",  
  "code": "#include <stdio.h> \n int main(){printf(\"Hi\"); return 0;}"  
}
```

#### Response
1. success (boolean) : API 요청 성공 여부입니다.  
이는 소스 코드의 컴파일 성공 여부가 아니라, API 요청 자체가 서버에 잘 접수되었는지 여부입니다.
2. id (int) : 소스 코드의 고유 번호입니다. 나중에 컴파일 결과를 확인할때 이 값을 사용해야 합니다.

#### Response Example
```
{
  "success": true,
  "id": 123
}
```

```
{
  "success": false
}
```

### GET /api/result/\<id\>
설명 : 서버에서 컴파일된 소스의 실행 결과를 반환합니다.  
이전에 컴파일 요청 결과에서 받은 소스 코드 고유 번호를 \<id\> 부분에 넣어서 요청합니다.

#### Response
1. success (boolean) : API 요청 성공 여부입니다.  
이는 소스 코드의 컴파일 성공 여부가 아니라, API 요청 자체가 서버에 잘 접수되었는지 여부입니다.
2. compile (string) : 소스 코드의 컴파일 및 실행 성공 여부입니다.
```
 1) "OK" : 컴파일 & 실행 성공
 2) "FAIL" : 컴파일 에러 or 런타임 에러
 3) "WAIT" : 아직 컴파일 및 실행이 완료되지 않음
```
3. output (string) : 컴파일 후 실행된 프로그램이 출력한 내용입니다.  
컴파일 에러가 발생했다면 output은 에러 메시지가 됩니다.

#### Response Example
```
{
  "success": true,
  "compile": "OK",
  "output": "hi"
}
```

```
{
  "success": true,
  "compile": "FAIL",
  "output": "test.c:1:1: error: expected identifier or ‘(’ before numeric constant"
}
```

```
{
  "success": true,
  "compile": "WAIT",
  "output": ""
}
```

```
{
  "success": false
}
```
