// static/js/script.js
document.getElementById('food-form').addEventListener('submit', function (e) {
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

            if (data.foods && data.foods.length > 0) {
                const food = data.foods[0];

                const htmlContent = `
                    <h2>Nutrition Information for ${food.food_name}</h2>
                    <p><strong>Serving Size:</strong> ${food.serving_qty} ${food.serving_unit} (${food.serving_weight_grams} grams)</p>
                    <p><strong>Calories:</strong> ${food.nf_calories}</p>
                    <p><strong>Total Fat:</strong> ${food.nf_total_fat}g</p>
                    <p><strong>Saturated Fat:</strong> ${food.nf_saturated_fat}g</p>
                    <p><strong>Cholesterol:</strong> ${food.nf_cholesterol}mg</p>
                    <p><strong>Sodium:</strong> ${food.nf_sodium}mg</p>
                    <p><strong>Total Carbohydrates:</strong> ${food.nf_total_carbohydrate}g</p>
                    <p><strong>Dietary Fiber:</strong> ${food.nf_dietary_fiber}g</p>
                    <p><strong>Sugars:</strong> ${food.nf_sugars}g</p>
                    <p><strong>Protein:</strong> ${food.nf_protein}g</p>
                    <img src="${food.photo.thumb}" alt="${food.food_name}">
                `;
                resultsDiv.innerHTML = htmlContent;
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
    }
});
