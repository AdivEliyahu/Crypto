from django.db import models

# Create your models here.

class citizen(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    center_id = models.IntegerField()

class center(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    location = models.CharField(max_length=30)


