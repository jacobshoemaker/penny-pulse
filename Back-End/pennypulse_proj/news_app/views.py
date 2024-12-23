from django.shortcuts import render
import requests
from django.http import JsonResponse
from xml.etree import ElementTree

def fetch_rss_feed(request):
    rss_url = "https://finance.yahoo.com/news/rss-feed/"
    
    try:
        response = requests.get(rss_url)
        response.raise_for_status()
        
        root = ElementTree.fromstring(response.content)
        articles = []
        
        for item in root.findall("./channel/item"):
            title = item.find("title").text if item.find("title") is not None else "No title"
            link = item.find("link").text if item.find("link") is not None else "#"
            description = item.find("description").text if item.find("description") is not None else "No description"
            pubDate = item.find("pubDate").text if item.find("pubDate") is not None else "No date"
            
            articles.append({
                "title": title,
                "link": link,
                "description": description,
                "pubDate": pubDate,
            })
            
        return JsonResponse({"articles": articles}, json_dumps_params={'ensure_ascii': False})
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)