from django.http import JsonResponse
from django.views.decorators.http import require_GET,require_POST
import random
from django.views.decorators.csrf import csrf_exempt
import json
import os 
from dotenv import load_dotenv
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
import base64

#~~~~~~~~~~~~~~~~~~TASK 1~~~~~~~~~~~~~~~~~~~~~~#
load_dotenv()
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


private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)

    # Serialize private key to PEM format string
os.environ['SERVER_PRIVATE_KEY_PEM'] = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
).decode("utf-8")

    # Serialize public key to PEM format string
os.environ['SERVER_PUBLIC_KEY'] = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
).decode("utf-8")


@csrf_exempt
@require_POST
def key_exchange_set_up(request):
    from base64 import b64decode
    try:

        data = json.loads(request.body)

        prime = int(decrypt_message(serialization.load_pem_private_key(os.getenv("SERVER_PRIVATE_KEY_PEM").encode("utf-8"),password=None,), 
                                    b64decode(data.get("prime"))))
        alpha = int(decrypt_message(serialization.load_pem_private_key(os.getenv("SERVER_PRIVATE_KEY_PEM").encode("utf-8"),password=None,), 
                                    b64decode(data.get("alpha"))))
        alice_public = int(decrypt_message(serialization.load_pem_private_key(os.getenv("SERVER_PRIVATE_KEY_PEM").encode("utf-8"),password=None,), 
                                           b64decode(data.get("publicKey"))))

        os.environ['BOB_PRIVATE'] = str(random.randint(1, prime - 1))
        public_key_bob = str(pow(alpha, int(os.environ['BOB_PRIVATE']), prime))

        os.environ["SECRET"] = str(pow(alice_public, int(os.environ['BOB_PRIVATE']), prime))[:32]

        client_public_RSA_pem = os.getenv("CLIENT_PUBLIC_RSA")
        client_public_key = serialization.load_pem_public_key(client_public_RSA_pem.encode("utf-8"))
        encrypted_bob_key = client_public_key.encrypt(
            public_key_bob.encode("utf-8"),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        )

        encrypted_bob_key_base64 = base64.b64encode(encrypted_bob_key).decode("utf-8")

        secret = os.environ["SECRET"] # just for debug
        print(f"The shared secret is: {secret} key length: {len(secret)}")

        return JsonResponse({
            "message": "The server calculated the shared secret.",
            "bobPublicKey": encrypted_bob_key_base64,  
        })
    except Exception as e:
        print(f"Error in key exchange: {e}")
        return JsonResponse({"message": "Error processing the key exchange."})
    

@require_POST
@csrf_exempt
def get_public_RSA(request): 
    data = json.loads(request.body.decode('utf-8')) 

    os.environ['client_public_RSA'] = data.get('client_public_RSA')

    return JsonResponse({
         'server_public_RSA' : os.environ['SERVER_PUBLIC_KEY'], 
         'message': 'got the client public RSA key.'
    })



#Helper Functions

def encrypt_message(public_key, message):
    return public_key.encrypt(
        message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

def decrypt_message(private_key, encrypted_message):
    return private_key.decrypt(
        encrypted_message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

#~~~~~~~~~~~~~~~~~~ Final Task ~~~~~~~~~~~~~~~~~~~~~~#
@require_GET
def get_voters(request):
    '''get_voters return the number of voters who voted for each party and the number of voters who have not voted yet'''
    from .models import center;
    republican_voters = center.objects.filter(choice='Republican').values()
    democrat_voters = center.objects.filter(choice='Democrat').values()           

    return JsonResponse({'republicansVoters': len(republican_voters),
                         'democratsVoters': len(democrat_voters),
                         'yetVoted': 45 - len(republican_voters) - len(democrat_voters)})


@require_POST
@csrf_exempt
def valid_user(request):
    '''valid_user checks if the voter is registered and has not voted yet'''
    from .models import voters
    try:
        data = json.loads(request.body)
        voter_id = data.get('voter_id')

        voter = voters.objects.filter(id=voter_id).values().first()
        if not voter:
            return JsonResponse({'message': 'Voter not found.', 'status': 404})
        
        if voter['has_vote']:
            return JsonResponse({'message': 'This voter has already voted.', 'status': 201})

        return JsonResponse({'message': 'This voter is registered.', 'status': 200})

    except Exception as e:
        return JsonResponse({'message': 'Error checking the voter.', 'error': str(e), 'status': 500})


@require_POST
@csrf_exempt
def vote(request):
    '''vote registers the vote of the voter'''
    from .models import voters, center
    try:
        
        data = json.loads(request.body)
 
        voter_id_encrypted = data.get('voter_id')
        choice_encrypted = data.get('choice')

        voter_id = decrypt(voter_id_encrypted)
        choice = decrypt(choice_encrypted)
        
        print(voter_id)
        print(choice)

        voter = voters.objects.filter(id=voter_id).values().first()
        if not voter:
            return JsonResponse({'message': 'Voter not found.', 'status': 404})

        center_id = voter['center_id']

        if voter['has_vote']:
            return JsonResponse({'message': 'This voter has already voted.', 'status': 401})

        center_instance = center.objects.filter(center_id=center_id, choice='None').first()
        if center_instance:
            center_instance.choice = choice
            center_instance.save()
            voters.objects.filter(id=voter_id).update(has_vote=True)

        return JsonResponse({'message': 'The vote was successfully registered.', 'status': 200})

    except Exception as e:
        return JsonResponse({'message': 'Error registering the vote.', 'error': str(e), 'status': 500})
    
        




# Function to decrypt AES data
import os
from dotenv import load_dotenv
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64




def decrypt(encrypted_text):
    """
    Decrypts the AES-encrypted userID.
    
    :param encrypted_user_id: Base64-encoded encrypted userID
    :return: Decrypted userID as a string
    """
    AES_KEY = os.getenv('SECRET')  # 32-byte key
    AES_IV = AES_KEY[:16]  # First 16 bytes as IV
    try:
        # Decode the Base64-encoded encrypted string
        encrypted_data = base64.b64decode(encrypted_text)
        
        # Initialize AES cipher for decryption
        cipher = AES.new(AES_KEY.encode('utf-8'), AES.MODE_CBC, AES_IV.encode('utf-8'))
        
        # Decrypt and unpad the plaintext
        decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
        
        # Convert bytes to string
        return decrypted_data.decode('utf-8')
    
    except Exception as e:
        print(f"Decryption failed: {e}")
        return None







@require_POST
@csrf_exempt
def rest_db(request):
    '''restart_db restarts the database'''
    from .models import center, voters
    try:
        
        print("Clearing existing data...")
        voters.objects.all().delete()
        center.objects.all().delete()
        print("Data cleared.")

        centers_data = [
            {"center_id": "101", "choices": [
                "Republican", "Democrat", "Democrat", "Republican", "None",
                "Republican", "Democrat", "Democrat", "Republican", "None",
                "Republican", "Democrat", "Republican", "Republican", "Republican"
            ]},
            {"center_id": "102", "choices": [
                "Republican", "Democrat", "Democrat", "Republican", "None",
                "Republican", "Democrat", "Democrat", "Republican", "None",
                "Republican", "Democrat", "Democrat", "Democrat", "Democrat"
            ]},
            {"center_id": "103", "choices": [
                "Republican", "Democrat", "Democrat", "Republican", "None",
                "Republican", "Democrat", "Democrat", "Republican", "Republican",
                "Republican", "Democrat", "Democrat", "Democrat", "Republican"
            ]},
        ]

        for center_data in centers_data:
            center_id = center_data["center_id"]
            for choice in center_data["choices"]:
                center.objects.create(center_id=center_id, choice=choice)

        voters_data = [
            {"center_id": "101", "voters": [
                (0, True), (1, True), (2, True), (3, True), (4, False),
                (5, True), (6, True), (7, True), (8, True), (9, False),
                (10, True), (11, True), (12, True), (13, True), (14, True)
            ]},
            {"center_id": "102", "voters": [
                (15, True), (16, True), (17, True), (18, True), (19, False),
                (20, True), (21, True), (22, True), (23, True), (24, False),
                (25, True), (26, True), (27, True), (28, True), (29, True)
            ]},
            {"center_id": "103", "voters": [
                (30, True), (31, True), (32, True), (33, True), (34, False),
                (35, True), (36, True), (37, True), (38, True), (39, True),
                (40, True), (41, True), (42, True), (43, True), (44, True)
            ]},
        ]

        for voter_group in voters_data:
            center_id = voter_group["center_id"]
            for voter_id, has_vote in voter_group["voters"]:
                voters.objects.create(id=voter_id, center_id=center_id, has_vote=has_vote)

        print("Data insertion complete.")

        return JsonResponse({'message': 'The database was restarted.', 'status': 200})
    except Exception as e:
        print(e)
        return JsonResponse({'message': 'Error restarting the database.', 'error': str(e), 'status': 500})

