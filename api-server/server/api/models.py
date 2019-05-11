from django.db import models

class Code(models.Model):
    LANG_CHOICES = (
        ("c", "C Language"),
    )

    lang = models.CharField(max_length=10, choices=LANG_CHOICES)
    code = models.TextField(blank=True)
