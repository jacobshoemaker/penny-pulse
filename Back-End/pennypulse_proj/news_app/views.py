from django.shortcuts import render
import requests
from django.http import JsonResponse
from xml.etree import ElementTree

# Creating a function to fetch RSS feed from Yahoo Finance API
def fetch_rss_feed(request):
    rss_url = "https://finance.yahoo.com/news/rss-feed/"
    
    # Using requests library to get the RSS feed from Yahoo Finance
    try:
        response = requests.get(rss_url)
        # If the response is not successful, raise an exception
        response.raise_for_status()
        
        # Parsing the XML response and get root element
        root = ElementTree.fromstring(response.content)
        # Creating an empty list to store articles
        articles = []
        
        # Looping through each item in the XML response
        for item in root.findall("./channel/item"):
            # Getting the title, link, description, and pubDate of each item
            title = item.find("title").text if item.find("title") is not None else "No title"
            link = item.find("link").text if item.find("link") is not None else "#"
            description = item.find("description").text if item.find("description") is not None else "No description"
            pubDate = item.find("pubDate").text if item.find("pubDate") is not None else "No date"
            
            # Appending the article data to the list
            articles.append({
                "title": title,
                "link": link,
                "description": description,
                "pubDate": pubDate,
            })
        
        # Returning the list of articles as a JSON response
        return JsonResponse({"articles": articles}, json_dumps_params={'ensure_ascii': False})
    # Handling exceptions and returning an error response
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)