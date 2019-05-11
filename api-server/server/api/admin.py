from django.contrib import admin
from . import models

@admin.register(models.Source)
class CodeAdmin(admin.ModelAdmin):
    list_display = ["id", "lang", "status", "created_date"]
    list_display_links = ["id"]
