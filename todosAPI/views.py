from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from .models import Todo
import json

# Create your views here.

def getAll(request):
  all_data = serializers.serialize("json", Todo.objects.all())
  data = {"data": all_data}
  response = JsonResponse(data)
  return response

  