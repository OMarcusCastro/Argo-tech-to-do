from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets

from django.conf import settings

from drf_yasg.utils import swagger_auto_schema

import jwt

from todo.models import TodoItem
from todo.serializer import TodoItemSerializer, TodoItemPostSerializer, TodoListTarefasSerializer
from todo.serializer import TodoItemDeleteSerializer, TodoItemUpdateSerializer

# Create your views here.


def check_auth(request):

    user_token = request.headers.get('Authorization')

    # if not user_token:
    #     raise AuthenticationFailed('Unauthenticated')
    user_token = user_token.split(
        ' ')[1] if user_token.startswith('Bearer ') else ""
    # user_token = request.COOKIES.get('access_token')
    print("access", user_token)
    if not user_token:
        return False
    payload = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])
    user_request = payload["user_id"]
    return user_request


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer


@swagger_auto_schema(method='post', request_body=TodoItemPostSerializer)
@api_view(['POST'])
def create(request):
    user_request = check_auth(request)
    if not user_request:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    print("user_request", user_request)
    user_id = request.data.get('user')

    if user_request != user_id:
        return Response({'error': 'User not allowed'}, status=status.HTTP_403_FORBIDDEN)

    if not request.data.get('user'):
        return Response({'error': 'user is required'}, status=status.HTTP_400_BAD_REQUEST)

    serializers = TodoItemPostSerializer(data=request.data)

    if serializers.is_valid():
        # Verifica se a tarefa pai pertence ao mesmo usuário, se houver
        parent_task_id = request.data.get('parent_task')
        print("parent_task_id", parent_task_id)
        if parent_task_id:
            parent_task = TodoItem.objects.get(
                id=parent_task_id).user.user_id
            print("parent", parent_task)
            print("user", request.data.get('user'))

            if parent_task and parent_task != request.data.get('user'):
                return Response({'error': 'Parent task must belong to the same user as the subtask.'},
                                status=status.HTTP_400_BAD_REQUEST)

        serializers.save()
        return Response(serializers.data, status=status.HTTP_201_CREATED)

    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='get')
@api_view(['GET'])
def list_all(request):

    user_request = check_auth(request)
    print("entrei", user_request)
    if not user_request:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    # Recupere todas as tarefas principais do usuário autenticado
    tarefas_principais = TodoItem.objects.filter(
        parent_task=None, user=user_request)
    # Serialize as tarefas principais com suas sub tarefas
    serializer = TodoListTarefasSerializer(tarefas_principais, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(method='post', request_body=TodoItemDeleteSerializer)
@api_view(['POST'])
def delete(request):
    user_request = check_auth(request)
    if not user_request:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    serializers = TodoItemDeleteSerializer(data=request.data)

    if serializers.is_valid():
        task_id = request.data.get('id')
        task = TodoItem.objects.get(id=task_id)
        if task.user.user_id != user_request:
            return Response({'error': 'User not allowed'}, status=status.HTTP_403_FORBIDDEN)

        task.delete()
        return Response({'success': 'Task deleted'}, status=status.HTTP_200_OK)

    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='put', request_body=TodoItemUpdateSerializer)
@api_view(['PUT'])
def update(request):
    user_request = check_auth(request)
    if not user_request:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        task_id = request.data.get('id')
        task = TodoItem.objects.get(id=task_id)
    except:
        return Response({'error': 'TodoItem not found'}, status=status.HTTP_404_NOT_FOUND)

    if task.user.user_id != user_request:
        return Response({'error': 'User not allowed'}, status=status.HTTP_403_FORBIDDEN)

    serializer = TodoListTarefasSerializer(
        task, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
