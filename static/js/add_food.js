document.getElementById('food-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('food-query').value;
    if (query) {
        fetch('/get_nutrition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById('nutrition-results');
            resultsDiv.innerHTML = ''; // Clear previous results

            if ('foods' in data && data.foods.length > 0) {
                const food = data.foods[0];

                const htmlContent = `
                    <h2>Nutrition Information for ${food.food_name}</h2>
                    <form id="add-to-log-form">
                        <p><strong>Serving Size:</strong> 
                            <input type="number" id="serving-size" value="${food.serving_qty}" min="0" step="0.1" required>
                            <select id="serving-unit">
                                <option value="g">grams</option>
                                <option value="oz">ounces</option>
                                <option value="lb">pounds</option>
                                <option value="tbsp">tablespoons</option>
                                <option value="tsp">teaspoons</option>
                            </select>
                        </p>
                        <button type="submit">Add to Log</button>
                    </form>
                    <div id="nutrition-details">
                        <p><strong>Calories:</strong> <span id="calories">${food.nf_calories}</span></p>
                        <p><strong>Total Fat:</strong> <span id="total-fat">${food.nf_total_fat}g</span></p>
                        <p><strong>Saturated Fat:</strong> <span id="saturated-fat">${food.nf_saturated_fat}g</span></p>
                        <p><strong>Cholesterol:</strong> <span id="cholesterol">${food.nf_cholesterol}mg</span></p>
                        <p><strong>Sodium:</strong> <span id="sodium">${food.nf_sodium}mg</span></p>
                        <p><strong>Total Carbohydrates:</strong> <span id="total-carbs">${food.nf_total_carbohydrate}g</span></p>
                        <p><strong>Dietary Fiber:</strong> <span id="dietary-fiber">${food.nf_dietary_fiber}g</span></p>
                        <p><strong>Sugars:</strong> <span id="sugars">${food.nf_sugars}g</span></p>
                        <p><strong>Protein:</strong> <span id="protein">${food.nf_protein}g</span></p>
                        <img src="${food.photo.thumb}" alt="${food.food_name}">
                    </div>
                `;
                resultsDiv.innerHTML = htmlContent;

                // Add to Log form submission
                document.getElementById('add-to-log-form').addEventListener('submit', function(e) {
                    e.preventDefault();

                    const servingSize = parseFloat(document.getElementById('serving-size').value);
                    const servingUnit = document.getElementById('serving-unit').value;

                    // Calculate adjusted nutritional values based on serving size and unit
                    const adjustedFoodItem = {
                        food_name: food.food_name,
                        serving_qty: servingSize,
                        serving_unit: servingUnit,
                        nf_calories: (food.nf_calories / food.serving_qty) * servingSize,
                        nf_total_fat: (food.nf_total_fat / food.serving_qty) * servingSize,
                        nf_saturated_fat: (food.nf_saturated_fat / food.serving_qty) * servingSize,
                        nf_cholesterol: (food.nf_cholesterol / food.serving_qty) * servingSize,
                        nf_sodium: (food.nf_sodium / food.serving_qty) * servingSize,
                        nf_total_carbohydrate: (food.nf_total_carbohydrate / food.serving_qty) * servingSize,
                        nf_dietary_fiber: (food.nf_dietary_fiber / food.serving_qty) * servingSize,
                        nf_sugars: (food.nf_sugars / food.serving_qty) * servingSize,
                        nf_protein: (food.nf_protein / food.serving_qty) * servingSize
                    };

                    // Add food item to log
                    fetch('/add_to_log', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(adjustedFoodItem),
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Food item added to log!');
                        } else {
                            alert('Error adding food item to log.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error adding food item to log.');
                    });
                });
            } else {
                resultsDiv.innerHTML = '<p>No nutritional information found.</p>';
            }
        })
        .catch(error => {
            const resultsDiv = document.getElementById('nutrition-results');
            resultsDiv.innerHTML = ''; // Clear previous results

            const errorElement = document.createElement('p');
            errorElement.textContent = `Error: ${error.message}`;
            resultsDiv.appendChild(errorElement);
        });
    } else {
        alert('Please enter a food item.');
    }
});
