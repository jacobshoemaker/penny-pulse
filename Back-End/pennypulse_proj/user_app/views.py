from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import User

class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

# Create your views here.
class SignUp(APIView):
    
    def post(self, request):
        body_data = request.data.copy()
        body_data['username'] = body_data['email']
        new_user = User.objects.create_user(**body_data)
        if new_user:
            token = Token.objects.create(user=new_user)
            return Response({'user' : new_user.email, 'token' : token.key})
        return Response("Invalid user credentials", status=HTTP_400_BAD_REQUEST)
    
class LogIn(APIView):
    
    def post(self, request):
        body_data = request.data.copy()
        email = body_data.get('email')
        password = body_data.get('password')
        user = authenticate(username=email, password=password)
        if user:
           token, created = Token.objects.get_or_create(user=user)
           return Response({'token' : token.key, 'user' : user.email})
        else:
            return Response("No user matching credentials", status=HTTP_404_NOT_FOUND)

class LogOut(TokenReq):
    
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=HTTP_204_NO_CONTENT)
