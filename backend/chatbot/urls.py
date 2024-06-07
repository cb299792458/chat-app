from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test, name='test'),
    path('chat/', views.chat, name='chat'),
]
