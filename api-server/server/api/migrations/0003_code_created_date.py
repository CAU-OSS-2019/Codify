# Generated by Django 2.1.8 on 2019-05-11 06:41

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20190511_1539'),
    ]

    operations = [
        migrations.AddField(
            model_name='code',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]