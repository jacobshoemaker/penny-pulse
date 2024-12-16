from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Transaction
from .serializers import TransactionSerializer
from user_app.views import TokenReq

# Create your views here.

class AllTransactions(TokenReq):
    
    # Getting all transactions for a specific user and displaying the list of all transactions
    def get(self, request):
        
        try:
            user = request.user
            all_transactions = TransactionSerializer(user.transactions.all(), many=True)
            return Response(all_transactions.data, status=HTTP_200_OK)
        except Exception as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)
    
    # Creating a single new transaction for a specific user
    def post(self, request):
        body_data = request.data.copy()
        body_data['user'] = request.user.id
        
        new_transaction = TransactionSerializer(data=body_data, partial=True)
        
        if new_transaction.is_valid():
            new_transaction.save()
            return Response(new_transaction.data, status=HTTP_201_CREATED)
        return Response(new_transaction.errors, status=HTTP_400_BAD_REQUEST)
    
    # Updating a single transaction for a specific user
    def put(self, request, pk=None):
        
        try:
            user = request.user
            single_transaction = Transaction.objects.get(id=pk, user=user)
            
            single_transaction_data = request.data
            single_transaction_serializer = TransactionSerializer(single_transaction, data=single_transaction_data)
            
            if single_transaction_serializer.is_valid():
                single_transaction_serializer.save()
                return Response(single_transaction_serializer.data, status=HTTP_200_OK)
            else:
                return Response(single_transaction_serializer.errors, status=HTTP_400_BAD_REQUEST)
        
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found or unauthorized"}, status=HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk=None):
        
        try:
            user = request.user
            single_transaction = Transaction.objects.get(id=pk, user=user)
            single_transaction.delete()
            
            return Response({"message": "Transaction deleted successfully"}, status=HTTP_204_NO_CONTENT)
       
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found or unauthorized"}, status=HTTP_404_NOT_FOUND) 
        
        
