document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('add-to-log-button')) {
        console.log('Add to Log button clicked');

        const foodName = event.target.getAttribute('data-food-name');
        const servingQty = parseFloat(document.getElementById('serving-qty').value);
        const servingUnit = document.getElementById('serving-unit').value;
        const baseCalories = parseFloat(event.target.getAttribute('data-calories'));
        const baseProtein = parseFloat(event.target.getAttribute('data-protein'));
        const baseFat = parseFloat(event.target.getAttribute('data-fat'));
        const baseCarbs = parseFloat(event.target.getAttribute('data-carbs'));
        const servingWeightGrams = parseFloat(event.target.getAttribute('data-serving-weight-grams'));

        console.log('Base values:', {
            baseCalories, baseProtein, baseFat, baseCarbs, servingWeightGrams
        });

        const multiplier = calculateMultiplier(servingQty, servingUnit, servingWeightGrams);

        let calories = calculateNutrient(baseCalories, multiplier);
        let protein = calculateNutrient(baseProtein, multiplier);
        let fat = calculateNutrient(baseFat, multiplier);
        let carbs = calculateNutrient(baseCarbs, multiplier);

        const foodItem = {
            food_name: foodName,
            serving_size: servingQty,
            serving_unit: servingUnit,
            calories: calories,
            protein: protein,
            fat: fat,
            carbs: carbs
        };

        console.log('Food item to log:', foodItem);

        fetch('/add_to_log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodItem),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Food item added to log!');
            } else {
                alert('Error adding food item to log.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding food item to log.');
        });
    }
});

function calculateMultiplier(servingQty, servingUnit, servingWeightGrams) {
    let multiplier = 1;

    switch (servingUnit) {
        case 'grams':
            multiplier = servingQty / servingWeightGrams;
            break;
        case 'ounces':
            multiplier = (servingQty * 28.3495) / servingWeightGrams; // 1 ounce = 28.3495 grams
            break;
        case 'pounds':
            multiplier = (servingQty * 453.592) / servingWeightGrams; // 1 pound = 453.592 grams
            break;
        case 'tablespoons':
            multiplier = (servingQty * 14.3) / servingWeightGrams; // Approximation for tablespoons to grams
            break;
        case 'teaspoons':
            multiplier = (servingQty * 4.2) / servingWeightGrams; // Approximation for teaspoons to grams
            break;
        default:
            break;
    }

    console.log('Multiplier:', multiplier);
    return multiplier;
}

function calculateNutrient(baseValue, multiplier) {
    if (isNaN(baseValue) || isNaN(multiplier)) {
        return 0;
    }
    return (baseValue * multiplier).toFixed(2);
}
