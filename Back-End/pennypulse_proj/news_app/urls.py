
from django.urls import path
from .views import fetch_rss_feed

urlpatterns = [
    path('rss-feed/', fetch_rss_feed, name='rss_feed'),
]