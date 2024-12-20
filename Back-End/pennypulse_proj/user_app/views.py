from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR

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
        
        try:
            new_user = User.objects.create_user(**body_data)
            token = Token.objects.create(user=new_user)            
            return Response({'user' : new_user.email, 'token' : token.key})
        except Exception:
            return Response("Invalid user credentials", status=HTTP_400_BAD_REQUEST)
    
       
    
class LogIn(APIView):
    
    def post(self, request):
        body_data = request.data.copy()
        email = body_data.get('email')
        password = body_data.get('password')
        try:
            user = authenticate(username=email, password=password)
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token' : token.key, 'user' : user.email})
        except Exception:
            return Response("No user matching credentials", status=HTTP_404_NOT_FOUND)

class LogOut(TokenReq):
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response(status=HTTP_204_NO_CONTENT)
        except Token.DoesNotExist:
            return Response({'error': 'Token not found'}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
