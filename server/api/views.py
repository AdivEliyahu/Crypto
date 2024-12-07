from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import random
from django.views.decorators.csrf import csrf_exempt
import json
import os 
from dotenv import load_dotenv

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




##########CREATE PUBLIC AND PRIVAT RSA KEYS############
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from base64 import b64decode

# Generate RSA private key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)

# Serialize private key to PEM format string
private_key_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
).decode('utf-8')

# Generate the corresponding public key
public_key = private_key.public_key()

# Serialize public key to PEM format string
public_key_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
).decode('utf-8')

# Print keys as strings
#print("Private Key:\n", private_key_pem)
#print("Public Key:\n", public_key_pem)

client_public_RSA = ''

######################
  
  
@require_POST
@csrf_exempt
def key_exchange_set_up(request):
    load_dotenv()
    
    try:
        data = json.loads(request.body)

        

        prime = int(decrypt_message(private_key, b64decode(data.get('prime'))))
        alpha = int(decrypt_message(private_key, b64decode(data.get('alpha'))))
        alice_public = int(decrypt_message(private_key, b64decode(data.get('publicKey'))))

        os.environ['PRIVATE_KEY'] = str(random.randint(1, prime - 1))
        public_key_bob = str(pow(alpha, int(os.environ['PRIVATE_KEY']), prime))

        os.environ['SECRET'] = str(pow(alice_public, int(os.environ['PRIVATE_KEY']), prime))

        #print(f'bob public is: {public_key_bob}')

        SECRET = os.environ['SECRET']
        print(f'The secret is: {SECRET}')

        return JsonResponse({
            'message': 'The server calculated the secret.',
            'bobPublicKey': public_key_bob,
        })
    except Exception as e:
        print(f"Error in key exchange: {e}")
        return JsonResponse({'message': 'Error processing the key exchange.'})
    

@require_POST
@csrf_exempt
def get_public_RSA(request): 
    data = json.loads(request.body.decode('utf-8')) 

    global client_public_RSA
    client_public_RSA = data.get('client_public_RSA')

    return JsonResponse({
         'server_public_RSA' : public_key_pem, 
         'message': 'got the client public RSA key.'
    })





#Helper Functions
# Encryption Function
def encrypt_message(public_key, message):
    return public_key.encrypt(
        message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

# Decryption Function
def decrypt_message(private_key, encrypted_message):
    return private_key.decrypt(
        encrypted_message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
