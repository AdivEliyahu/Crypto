from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import json



#test- remove later
@require_GET
def test(request):
    print(request.GET['ID'])
    return JsonResponse({"message": "ok"})
