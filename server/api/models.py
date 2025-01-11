from django.db import models

# Create your models here.

class citizen(models.Model):
    id = models.IntegerField(primary_key=True)
    center_id = models.IntegerField()
    has_vote= models.BooleanField()

class center(models.Model):
    center_id = models.IntegerField
    vote=models.CharField(max_length=2)


