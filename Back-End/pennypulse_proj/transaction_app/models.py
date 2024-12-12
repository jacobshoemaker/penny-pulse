from django.db import models
from user_app.models import User

# Create your models here.
class Transaction(models.Model):
    TRANSACTION_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    trans_type = models.CharField(max_length=7, choices=TRANSACTION_CHOICES)
    
    def __str__(self):
        return f'{self.trans_type.capitalize()} of {self.amount} by {self.user}'