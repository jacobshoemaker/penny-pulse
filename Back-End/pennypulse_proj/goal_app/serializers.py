from rest_framework.serializers import ModelSerializer
from .models import BudgetGoal

class BudgetGoalSerializer(ModelSerializer):
    
    class Meta:
        model = BudgetGoal
        fields = '__all__'