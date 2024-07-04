import os
from django.conf import settings
from django.core.management import execute_from_command_line
from django.urls import path
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

#config
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
execute_from_command_line(['manage.py', 'makemigrations'])
execute_from_command_line(['manage.py', 'migrate'])
execute_from_command_line(['manage.py', 'runserver'])

#end config
# Create your views here.
