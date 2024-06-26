document.getElementById('food-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const query = document.getElementById('food_item').value;
    if (query) {
        fetch('/add_food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ food_item: query }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(data => {
            // You can handle the response data here if needed
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
    }
});
