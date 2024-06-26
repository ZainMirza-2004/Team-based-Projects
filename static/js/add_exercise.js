document.getElementById('exercise-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('exercise-query').value;
    if (query) {
        fetch('/get_exercise', {
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
            const resultsDiv = document.getElementById('exercise-results');
            resultsDiv.innerHTML = ''; // Clear previous results

            if ('exercises' in data && data.exercises.length > 0) {
                const exercise = data.exercises[0];

                const htmlContent = `
                    <h2>Exercise Information for ${exercise.name}</h2>
                    <p><strong>Duration:</strong> ${exercise.duration_min} minutes</p>
                    <p><strong>Calories Burned:</strong> ${exercise.nf_calories}</p>
                `;
                resultsDiv.innerHTML = htmlContent;
            } else {
                resultsDiv.innerHTML = '<p>No exercise information found.</p>';
            }
        })
        .catch(error => {
            const resultsDiv = document.getElementById('exercise-results');
            resultsDiv.innerHTML = ''; // Clear previous results

            const errorElement = document.createElement('p');
            errorElement.textContent = `Error: ${error.message}`;
            resultsDiv.appendChild(errorElement);
        });
    } else {
        alert('Please enter an exercise.');
    }
});
