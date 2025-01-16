from django.db import models

# Create your models here.

class voters(models.Model):
    id = models.CharField(max_length=200, primary_key=True)
    center_id = models.CharField(max_length=200)
    has_vote = models.BooleanField()

class center(models.Model):  
    center_id = models.CharField(max_length=200)
    choice = models.CharField(max_length=200)
