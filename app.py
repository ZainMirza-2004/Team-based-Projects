from flask import Flask, render_template, request, jsonify
from nutritionix import get_nutrition_data, get_exercise_data

app = Flask(__name__)

# In-memory log for demonstration
daily_log = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_nutrition', methods=['POST'])
def get_nutrition():
    if not request.json or 'query' not in request.json:
        return jsonify({"error": "Please provide a query"}), 400

    query = request.json['query']
    try:
        nutrition_data = get_nutrition_data(query)
        return jsonify(nutrition_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add_food', methods=['GET', 'POST'])
def add_food():
    if request.method == 'POST':
        food_item = request.form['food_item']
        if food_item:
            try:
                nutrition_data = get_nutrition_data(food_item)
                return render_template('nutrition_results.html', data=nutrition_data)
            except Exception as e:
                error_message = f"Error fetching nutrition data: {str(e)}"
                return render_template('error.html', error=error_message)
        else:
            return render_template('error.html', error="Please enter a food item.")
    else:
        return render_template('add_food.html')

@app.route('/add_exercise', methods=['GET', 'POST'])
def add_exercise():
    if request.method == 'POST':
        exercise_name = request.form.get('exercise_name')
        if exercise_name:
            try:
                exercise_data = get_exercise_data(exercise_name)
                return render_template('exercise_results.html', data=exercise_data)
            except Exception as e:
                error_message = f"Error fetching exercise data: {str(e)}"
                return render_template('error.html', error=error_message)
        else:
            return render_template('error.html', error="Please enter an exercise.")
    else:
        return render_template('add_exercise.html')
    


@app.route('/add_to_log', methods=['POST'])
def add_to_log():
    item = request.json
    print("Item received to log:", item)  # Debug statement
    daily_log.append(item)
    return jsonify({"success": True})


@app.route('/daily_log')
def daily_log_page():
    return render_template('daily_log.html', log=daily_log)

if __name__ == '__main__':
    app.run(debug=True)
