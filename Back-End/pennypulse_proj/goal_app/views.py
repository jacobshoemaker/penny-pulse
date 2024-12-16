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
        body_data['user'] = request.user.id
        
        new_budget_goal = BudgetGoalSerializer(data=body_data, partial=True)
        
        if new_budget_goal.is_valid():
            new_budget_goal.save()
            return Response(new_budget_goal.data, status=HTTP_201_CREATED)
        return Response(new_budget_goal.errors, status=HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        
        try:
            user = request.user
            single_goal = BudgetGoal.objects.get(id=pk, user=user)
            
            single_goal_data = request.data
            single_goal_serializer = BudgetGoalSerializer(single_goal, data=single_goal_data)
            
            if single_goal_serializer.is_valid():
                single_goal_serializer.save()
                return Response(single_goal_serializer.data, status=HTTP_200_OK)
            else:
                return Response(single_goal_serializer.errors, status=HTTP_400_BAD_REQUEST)
            
        except BudgetGoal.DoesNotExist:
            return Response({"error": "Budget goal not found or unauthorized"}, status=HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk=None):
        
        try:
            user = request.user
            single_goal = BudgetGoal.objects.get(id=pk, user=user)
            single_goal.delete()
            
            return Response({"message": "Budget goal deleted successfully."}, status=HTTP_204_NO_CONTENT)
        
        except BudgetGoal.DoesNotExist:
            return Response({"error": "Budget goal not found or unauthorized."}, status=HTTP_404_NOT_FOUND)
        
    
    