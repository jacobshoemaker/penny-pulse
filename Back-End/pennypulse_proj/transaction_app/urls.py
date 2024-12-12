from django.urls import path
from .views import AllTransactions

urlpatterns = [
    path('', AllTransactions.as_view(), name='all_transactions')
]