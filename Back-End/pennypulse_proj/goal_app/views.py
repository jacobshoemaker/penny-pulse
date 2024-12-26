from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import BudgetGoal
from .serializers import BudgetGoalSerializer
from user_app.views import TokenReq

# Create your views here.

class AllBudgetGoals(TokenReq):
    
    # Getting all budget goals (saving limit, spending limit) for single user
    # using a GET request
    def get(self, request):
        
        try:
            user = request.user
            all_budget_goals = BudgetGoalSerializer(user.goals.all(), many=True)
            return Response(all_budget_goals.data, status=HTTP_200_OK)
        except Exception as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)
    
    # Creating a single new budget goal for a specific user    
    def post(self, request):
        body_data = request.data.copy()
        # Adding current user's ID to copied data (body_data)
        body_data['user'] = request.user.id
        
        
        # Initializing new budget goal serializer with copied data.
        # If data is valid, save it and return the data with status 201
        # If data is invalid, return the errors with status 400
        try:
            new_budget_goal = BudgetGoalSerializer(data=body_data, partial=True) 
            if new_budget_goal.is_valid():
                new_budget_goal.save()
                return Response(new_budget_goal.data, status=HTTP_201_CREATED)
        except Exception:
            return Response(new_budget_goal.errors, status=HTTP_400_BAD_REQUEST)
    
    # Using put request to update a single budget goal for a specific user
    # using the budget goal's ID
    def put(self, request, pk=None):
        
        
        try:
            # Getting user and budget goal
            user = request.user
            single_goal = BudgetGoal.objects.get(id=pk, user=user)
            
            # Getting the data from the request and initializing the serializer
            single_goal_data = request.data
            single_goal_serializer = BudgetGoalSerializer(single_goal, data=single_goal_data)
            
            # If the data is valid, save it and return the data with status 200
            if single_goal_serializer.is_valid():
                single_goal_serializer.save()
                return Response(single_goal_serializer.data, status=HTTP_200_OK)
            # If the data is invalid, return the errors with status 400
            else:
                return Response(single_goal_serializer.errors, status=HTTP_400_BAD_REQUEST)
           
        # If the budget goal is not found or unauthorized, return an error with status 404 
        except BudgetGoal.DoesNotExist:
            return Response({"error": "Budget goal not found or unauthorized"}, status=HTTP_404_NOT_FOUND)
    
    # Using delete request to delete a single budget goal for a specific user
    def delete(self, request, pk=None):
        
        # Getting the user and the budget goal
        try:
            user = request.user
            single_goal = BudgetGoal.objects.get(id=pk, user=user)
            # Deleting the budget goal and returning a message with status 204
            single_goal.delete()
            
            return Response({"message": "Budget goal deleted successfully."}, status=HTTP_204_NO_CONTENT)
        
        # If the budget goal is not found or unauthorized, return an error with status 404
        except BudgetGoal.DoesNotExist:
            return Response({"error": "Budget goal not found or unauthorized."}, status=HTTP_404_NOT_FOUND)
        
    
    