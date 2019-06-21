from django.db import models

class Source(models.Model):
    LANG_CHOICES = (
        ("c", "C11"),
        ("cpp", "C++17"),
        ("python","python3.7")
    )
    STATUS_CHOICES = (
        (1, "OK"),
        (2, "FAIL"),
        (3, "WAIT"),
    )

    lang = models.CharField(max_length=10, choices=LANG_CHOICES)
    code = models.TextField(blank=True)
    stdin = models.TextField(blank=True)
    output = models.TextField(blank=True)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=3)
    created_date = models.DateTimeField(auto_now_add=True)
    ip = models.GenericIPAddressField()
