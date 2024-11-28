from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import random
from django.views.decorators.csrf import csrf_exempt
import json

#~~~~~~~~~~~~~~~~~~TASK 1~~~~~~~~~~~~~~~~~~~~~~#

# Real Graph
nodes1 = [1,2,3,4,5,6]
edges1 = [[1, 2], [1, 3], [5, 4], [4, 1], [5, 2], [3, 2], [2, 6]]

# Isomorphic Graph
nodes2 = ['A','B','C','D','E','F']
edges2 = [['A', 'B'], ['A', 'C'], ['E', 'D'], ['D', 'A'], ['E', 'B'], ['C', 'B'],['B','F']]

# Mapping - π* Function     
f = {'A':1, 'B':2, 'C':3, 'D':4,'E':5, 'F':6}

@require_GET
def get_graphs(request):
    return JsonResponse({'nodes1':nodes1,
                        'nodes2':nodes2,'edges2':edges2,  
                        'f':f})

@require_GET
def get_random_nodes(request): 
    num_nodes_to_select = int(len(nodes2) * 0.9)  
    selected_nodes = random.sample(nodes2, num_nodes_to_select)
    print(f'[Status] number of nodes sent to user: {len(selected_nodes)}.')

    return JsonResponse({'randNodes': selected_nodes})

@require_POST
@csrf_exempt
def check_edges(request): 
    data = json.loads(request.body)
    
    node = data.get('node')
    normalized_input_edges = data.get('normalizedInputEdges') 

    if normalized_input_edges[0] == '0 undefined': 
         normalized_input_edges = []

    node_edges = [edge for edge in edges1 if edge[0] == node]

    normalized_node_edges = [f'{edge[0]} {edge[1]}' for edge in node_edges]


    if len(normalized_node_edges) != len(normalized_input_edges):
            print(f'[Status] user was wrong (node: {node}).')
            return JsonResponse({'message': False})

    
    for edge in normalized_node_edges:
        if edge not in normalized_input_edges:
                print(f'[Status] user was wrong (node: {node}).')
                return JsonResponse({'message': False})

    print(f'[Status] user was right (node: {node}).')
    
    return JsonResponse({'message': True})


#~~~~~~~~~~~~~~~~~~TASK 2~~~~~~~~~~~~~~~~~~~~~~#

# move prime and alpha to .env file && gitignore it 
@require_GET
def key_exchange_set_up(request): 
    prime = request.GET.get('prime')
    alpha = request.GET.get('alpha')

    print(f'prime number is {prime} alpha is {alpha}')
    return JsonResponse({'message': 'server got the prime and alpha.'})