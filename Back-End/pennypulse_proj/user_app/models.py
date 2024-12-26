from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
# Creating a custom user model that extends the AbstractUser model
class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False)
    
    # Setting the email as the username field
    USERNAME_FIELD = 'email'
    # Setting the email as the required field
    REQUIRED_FIELDS = []
    