from django.urls import path
from .views import AllTransactions

urlpatterns = [
    path('', AllTransactions.as_view(), name='all_transactions'),
    path('<int:pk>/', AllTransactions.as_view(), name='transaction_detail'),
    path('<int:pk>/delete/', AllTransactions.as_view(), name='transaction_delete')
]