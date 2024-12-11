from django.db import models
from user_app.models import User

# Create your models here.
class Transaction(models.Model):
    INCOME = 'income'
    EXPENSE = 'expense'
    TRANSACTION_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    trans_type = models.CharField(max_length=7, choices=TRANSACTION_CHOICES)