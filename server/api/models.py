from django.db import models

# Create your models here.

class voters(models.Model):
    id = models.IntegerField(primary_key=True)
    center_id = models.IntegerField()
    has_vote = models.BooleanField()

class center(models.Model):  
    center_id = models.IntegerField()
    choice = models.CharField(max_length=20)
