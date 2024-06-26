# nutritionix.py
import requests
import json  # Ensure json module is imported
from config import NUTRITIONIX_APP_ID, NUTRITIONIX_API_KEY

def get_nutrition_data(query):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "query": query
    }
    response = requests.post(url, headers=headers, json=data)
    response.encoding = 'utf-8'

    try:
        return response.json()
    except json.JSONDecodeError as e:
        return {"error": str(e)}  # Return an error dictionary if JSON decoding fails

def get_exercise_data(query):
    url = "https://trackapi.nutritionix.com/v2/natural/exercise"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "query": query
    }
    response = requests.post(url, headers=headers, json=data)
    response.encoding = 'utf-8'

    try:
        return response.json()
    except json.JSONDecodeError as e:
        return {"error": str(e)}  # Return an error dictionary if JSON decoding fails
