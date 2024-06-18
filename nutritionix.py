# nutritionix.py
import requests
from config import NUTRITIONIX_APP_ID, NUTRITIONIX_API_KEY
import json

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
    response.encoding = 'utf-8'  # Ensure the response is treated as UTF-8

    print("Response text:", response.text)  # Log the response text for debugging

    try:
        return response.json()
    except json.JSONDecodeError:
        # If JSON decoding fails, return the text response with a UTF-8 fallback
        return json.loads(response.text.encode('utf-8').decode('utf-8'))
