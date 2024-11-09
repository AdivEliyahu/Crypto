from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import random



#test- remove later
@require_GET
def test(request):
    print(request.GET['ID'])
    return JsonResponse({"message": "ok"})

def create_graphs(request): 
    print("message received.")
    print(request)
    return JsonResponse({"message": "ok"})