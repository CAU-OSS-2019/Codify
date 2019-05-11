import json
from django.shortcuts import render
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# Main View
class Main(View):
    def get(self, request, *args, **kwargs):
        # just send welcome message
        return HttpResponse("Welcome to API")


# Compile API View
@method_decorator(csrf_exempt, name="dispatch")
class Compile(View):

    # receive compile request and push to background queue
    def post(self, request, *args, **kwargs):
        status_code = 200

        # this is only test(sample) code
        try:
            # load json from request body
            request_json = json.loads(request.body.decode("utf-8"))

            # only support c language
            if request_json.get("lang") == "c":
                pass
            else:
                raise ValueError

            # request's result, send to client (id : unique source code id)
            result = json.dumps({"success": True, "id": 1})

        except:
            # if error, return 400 Bad Request
            result = json.dumps({"success": False})
            status_code = 400

        finally:
            # return response with json header
            response = HttpResponse(result, status=status_code)
            response["Content-Type"] = "application/json; charset=utf-8"
            return response


# Compile Result Check API View
class CompileResult(View):
    def get(self, request, *args, **kwargs):
        status_code = 200

        # this is only test(sample) code
        try:
            if kwargs["id"] == 1:
                pass
            else:
                raise ValueError

            result = json.dumps({"success": True, "compile": "OK", "output": ""})

        except:
            result = json.dumps({"success": False})
            status_code = 400

        finally:
            # return response with json header
            response = HttpResponse(result, status=status_code)
            response["Content-Type"] = "application/json; charset=utf-8"
            return response
