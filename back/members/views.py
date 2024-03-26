from django.shortcuts import render
from members.serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth import get_user_model
from .utils import generate_access_token

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import jwt
# Create your views here.


class UserRegistrationAPIView(APIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @swagger_auto_schema(request_body=UserRegistrationSerializer)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user:
                acess_token = generate_access_token(new_user)
                data = {
                    "access_token": acess_token,
                }
                response = Response(data, status=status.HTTP_201_CREATED)
                response.set_cookie(key='access_token',
                                    value=acess_token, httponly=True)
                return response

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPIView(APIView):
    serializer_class = UserLoginSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @swagger_auto_schema(request_body=UserLoginSerializer)
    def post(self, request):
        email = request.data.get('email', None)
        user_password = request.data.get('password', None)

        if not user_password:
            raise AuthenticationFailed('Password is required')

        if not email:
            raise AuthenticationFailed('Email is required')

        user_instance = authenticate(email=email, password=user_password)

        if not user_instance:
            raise AuthenticationFailed('Invalid credentials')

        if user_instance.is_active:
            user_access_token = generate_access_token(user_instance)
            response = Response({'access_token': user_access_token})
            response.set_cookie(
                key='access_token',
                value=user_access_token,
                httponly=True
            )
            print("logado")
            # print({'access_token': user_access_token})
            return response

        return Response({
            "mesage": "Something went wrong"
        })


class UserViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @swagger_auto_schema(responses={200: UserRegistrationSerializer})
    def get(self, request):
        # user_token = request.COOKIES.get('access_token')
        user_token = request.headers.get('Authorization')
        print("access", user_token)

        if not user_token:
            raise AuthenticationFailed('Unauthenticated')
        user_token = user_token.split(
            ' ')[1] if user_token.startswith('Bearer ') else user_token

        payload = jwt.decode(
            user_token, settings.SECRET_KEY, algorithms=['HS256'])
        print("payload: ", payload["user_id"])
        user_model = get_user_model()
        user = user_model.objects.filter(user_id=payload['user_id']).first()
        user_serializer = UserRegistrationSerializer(user)
        return Response(user_serializer.data)


class UserLogoutViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @swagger_auto_schema(responses={200: openapi.Response("Successfully logged out")})
    def get(self, request):
        user_token = request.COOKIES.get('access_token')
        response = Response()
        if user_token:
            response.delete_cookie('access_token')
            response.data = {
                "message": "Successfully logged out"
            }
            return response
        response.data = {
            "message": "Something went wrong"
        }
        return response
