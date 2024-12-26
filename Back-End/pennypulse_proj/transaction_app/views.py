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
        
        # Getting the current user and all transactions for that user
        try:
            user = request.user
            # Serializing all transactions for the user
            all_transactions = TransactionSerializer(user.transactions.all(), many=True)
            # Returning the serialized data with status 200
            return Response(all_transactions.data, status=HTTP_200_OK)
        # Handling exceptions and returning an error response
        except Exception as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)
    
    # Creating a single new transaction for a specific user
    def post(self, request):
        # Copying the request data and adding the current user's ID to it
        body_data = request.data.copy()
        # Adding the current user's ID to the copied data
        body_data['user'] = request.user.id
        
        try:
            # Initializing new transaction serializer with copied data
            new_transaction = TransactionSerializer(data=body_data, partial=True)
            # If data is valid, save it and return the data with status 201
            if new_transaction.is_valid():
                new_transaction.save()
                return Response(new_transaction.data, status=HTTP_201_CREATED)
        # Handling exceptions and returning an error response
        except Exception:
            return Response(new_transaction.errors, status=HTTP_400_BAD_REQUEST)
    
    # Updating a single transaction for a specific user
    def put(self, request, pk=None):
        
        try:
            # Getting the current user and the transaction
            user = request.user
            single_transaction = Transaction.objects.get(id=pk, user=user)
            
            # Getting the data from the request and initializing the serializer
            single_transaction_data = request.data
            single_transaction_serializer = TransactionSerializer(single_transaction, data=single_transaction_data)
            
            # If the data is valid, save it and return the data with status 200
            if single_transaction_serializer.is_valid():
                single_transaction_serializer.save()
                return Response(single_transaction_serializer.data, status=HTTP_200_OK)
            # If the data is invalid, return the errors with status 400
            else:
                return Response(single_transaction_serializer.errors, status=HTTP_400_BAD_REQUEST)
        
        # Handling exceptions and returning an error response
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found or unauthorized"}, status=HTTP_404_NOT_FOUND)
    
    # Deleting a single transaction for a specific user
    def delete(self, request, pk=None):
        
        try:
            # Getting the current user and the transaction
            user = request.user
            single_transaction = Transaction.objects.get(id=pk, user=user)
            # Deleting the transaction and returning a message with status 204
            single_transaction.delete()
            
            return Response({"message": "Transaction deleted successfully."}, status=HTTP_204_NO_CONTENT)
       
       # Handling exceptions and returning an error response
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found or unauthorized."}, status=HTTP_404_NOT_FOUND) 
        
        
