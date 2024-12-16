from django.urls import path
from .views import AllBudgetGoals

urlpatterns = [
    path('', AllBudgetGoals.as_view(), name='all_budget_goals'),
    path('<int:pk>/', AllBudgetGoals.as_view(), name='budget_goal_detail')
]