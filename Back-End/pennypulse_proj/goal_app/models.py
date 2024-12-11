from django.db import models
from user_app.models import User

# Create your models here.
class BudgetGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    spending_limit = models.DecimalField(max_digits=10, decimal_places=2)
    saving_limit = models.DecimalField(max_digits=10, decimal_places=2)
