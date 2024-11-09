from django.urls import path 
from .views import *
urlpatterns = [ 
    path('isomorphicGraph', test),
    path('create_graphs', create_graphs)
]