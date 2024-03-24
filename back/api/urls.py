"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from members.views import UserRegistrationAPIView, UserLoginAPIView, UserViewAPI, UserLogoutViewAPI

from todo.views import create, list_all, delete, TodoItemViewSet, TodoItemUpdateSerializer, update

router = routers.DefaultRouter()

router.register(r'todo', TodoItemViewSet, basename='todo')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('create/', create, name='create'),
    path("list/", list_all, name='list'),
    path("delete/", delete, name="delete"),
    path("update/", update, name="update"),

    # members
    path('user/register/', UserRegistrationAPIView.as_view()),
    path('user/login/', UserLoginAPIView.as_view()),
    path('user/', UserViewAPI.as_view()),
    path('user/logout/', UserLogoutViewAPI.as_view()),


    path('', include(router.urls))
]
