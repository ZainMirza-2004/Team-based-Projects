# app.py
from flask import Flask, render_template, request, jsonify
from nutritionix import get_nutrition_data

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_nutrition', methods=['POST'])
def get_nutrition():
    if not request.json or not 'query' in request.json:
        return jsonify({"error": "Please provide a food item query"}), 400

    query = request.json['query']
    try:
        nutrition_data = get_nutrition_data(query)
        return jsonify(nutrition_data)  # Flask jsonify handles encoding
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
