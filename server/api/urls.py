from django.urls import path 
from .views import *
urlpatterns = [ 
    path('get_graphs', get_graphs),
    path('get_random_nodes', get_random_nodes),
    path('check_edges', check_edges),
    path('key_exchange_set_up', key_exchange_set_up),
    path('get_public_RSA', get_public_RSA),





]