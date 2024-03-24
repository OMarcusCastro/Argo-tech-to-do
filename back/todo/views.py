from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets

from todo.models import TodoItem
from todo.serializer import TodoItemSerializer, TodoItemPostSerializer

# Create your views here.


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer


@api_view(['POST'])
def create(request):

    serializers = TodoItemPostSerializer(data=request.data)

    if serializers.is_valid():
        serializers.save()
        return Response(serializers.data, status=status.HTTP_201_CREATED)

    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
