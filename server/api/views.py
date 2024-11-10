from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import random





@require_GET
def generateB(): 
    import random
    b = random. randint(1, 2)
    return JsonResponse({"b":b})

@require_GET
def get_graphs(request):
    nodes1 = [1,2,3,4,5]
    edges1 = [ [1, 2], [1, 3], [5, 4], [4, 1], [5, 2], [3, 2] ]

    nodes2 = ['A','B','C','D','E']
    edges2 = [['A', 'B'], ['A', 'C'], ['E', 'D'], ['D', 'A'], ['E', 'B'], ['C', 'B']]

    return JsonResponse({'nodes1':nodes1,'edges1':edges1,
                         'nodes2':nodes2,'edges2':edges2})