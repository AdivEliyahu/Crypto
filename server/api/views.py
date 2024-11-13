from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import random

# Real Graph
nodes1 = [1,2,3,4,5]
edges1 = [[1, 2], [1, 3], [5, 4], [4, 1], [5, 2], [3, 2]]

# Isomorphic Graph
nodes2 = ['A','B','C','D','E']
edges2 = [['A', 'B'], ['A', 'C'], ['E', 'D'], ['D', 'A'], ['E', 'B'], ['C', 'B']]

# Mapping - π* Function     
f = {'A':1, 'B':2, 'C':3, 'D':4,'E':5}

@require_GET
def get_graphs(request):
    return JsonResponse({'nodes1':nodes1,'edges1':edges1,
                        'nodes2':nodes2,'edges2':edges2,  
                        'f':f})

@require_GET
def get_random_nodes(request): 
    nodes2 = ['A', 'B', 'C', 'D', 'E']
    num_nodes_to_select = int(len(nodes2) * 0.9)  
    selected_nodes = random.sample(nodes2, num_nodes_to_select)
    
    return JsonResponse({'randNodes': selected_nodes}); 

