from django.db import models

# Create your models here.


class Todo(models.Model):

  task = models.CharField(max_length=50)
  state = models.CharField(max_length=40)
