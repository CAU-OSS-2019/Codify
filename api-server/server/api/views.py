import json
from django.shortcuts import render, get_object_or_404
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from . import models, compile_tasks


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

        try:
            # load json from request body
            request_json = json.loads(request.body.decode("utf-8"))

            # only support c language & cpp language
            if request_json.get("lang") == "c" or request_json.get("lang") == "cpp":
                pass
            else:
                raise ValueError

            # save model instance
            source = models.Source()
            source.lang = request_json.get("lang")
            source.code = request_json.get("code")
            source.stdin = request_json.get("stdin", "")
            source.save()

            # activate background compile tasks (async)
            compile_tasks.activate_compile()

            # request's result, send to client (id : unique source code id)
            result = json.dumps({"success": True, "id": source.pk})

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

        try:
            source = get_object_or_404(models.Source, pk=kwargs["id"])
            result = json.dumps({
                "success": True,
                "compile": source.get_status_display(),
                "output": source.output,
            })

        except:
            result = json.dumps({"success": False})
            status_code = 400

        finally:
            # return response with json header
            response = HttpResponse(result, status=status_code)
            response["Content-Type"] = "application/json; charset=utf-8"
            return response


# Get Supported Language API View
class SupportedLanguage(View):
    def get(self, request, *args, **kwargs):
        try:
            result = json.dumps([i[0] for i in models.Source.LANG_CHOICES])

        except:
            return HttpResponse("404 Not Found", status=404)

        # return response with json header
        response = HttpResponse(result)
        response["Content-Type"] = "application/json; charset=utf-8"
        return response
