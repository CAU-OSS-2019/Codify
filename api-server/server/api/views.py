from django.shortcuts import render
from django.http.response import HttpResponse
from django.views.generic.base import View


class Main(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("Welcome to API")
