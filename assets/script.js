var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var breakfastCategory = 'Breakfast';
var userCategory = 'Vegan';


document.addEventListener('DOMContentLoaded', function() {
        
    function addMealToMenu(day, mealType, meal) {
        var mealName = meal.strMeal;
        var mealThumbnail = meal.strMealThumb;
        var mealInstructions = meal.strInstructions;
        var ingredients = [];

        // Collect ingredients and measurements from the meal object
        for (var i = 1; i <= 20; i++) {
            var ingredient = meal['strIngredient' + i];
            var measurement = meal['strMeasure' + i];
            if (ingredient && ingredient.trim() !== '') {
                ingredients.push(`${ingredient} - ${measurement}`);
            } else {
                break;
            }
        }

        // Create HTML elements to display meal details
        var mealContainer = document.createElement('div');
        mealContainer.classList.add('meal');

        var mealImage = document.createElement('img');
        mealImage.src = mealThumbnail;
        mealImage.alt = mealName;
        mealImage.classList.add('meal-image');

        var mealTitle = document.createElement('h6');
        mealTitle.textContent = mealName;

        var mealIngredientsEl = document.createElement('ul');
        ingredients.forEach(ingredient => {
            var li = document.createElement('li');
            li.textContent = ingredient;
            mealIngredientsEl.appendChild(li);

        var mealInstructionsEl = document.createElement('p');
        mealInstructionsEl.textContent = mealInstructions;
      
        });

        // Append elements to the specified menu based on the day and meal type
        var menuId = `${day.toLowerCase()}-${mealType.toLowerCase()}`;
        var menu = document.getElementById(menuId);
        if (menu) {
            mealContainer.appendChild(mealImage);
            mealContainer.appendChild(mealTitle);
            mealContainer.appendChild(mealIngredientsEl);
            mealContainer.appendChild(mealInstructionsEl);
            menu.appendChild(mealContainer);
        }
    }

    // Function to fetch meal details by category
function getMealDetailsByCategory(category) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                // Select a random meal from the fetched list
                const randomIndex = Math.floor(Math.random() * data.meals.length);
                const randomMeal = data.meals[randomIndex]; // Get a random meal

                // Extract the meal ID of the random meal
                const mealId = randomMeal.idMeal;
                return mealId;
            } else {
                return null; // Return null if no meals found
            }
        })
        .then(mealId => {
            if (mealId) {
                // Fetch meal details by ID
                let mealDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
                return fetch(mealDetailsUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.meals && data.meals.length > 0) {
                            // Return the details of the meal
                            const mealDetails = data.meals[0];
                            return mealDetails;
                        } else {
                            return null; // Return null if no meal details found
                        }
                    });
            } else {
                return null; // Return null if no meal ID available
            }
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
            return null;
        });
}
    // Function to fetch a meal for a specific day and meal type
    function fetchAndDisplayMeal(day, mealType, category) {
        getMealDetailsByCategory(category)
            .then(randomMeal => {
                if (randomMeal) {
                    addMealToMenu(day, mealType, randomMeal);
                } else {
                    console.log(`No ${mealType.toLowerCase()} found for ${day}`);
                }
            })
            .catch(error => {
                console.error('Error fetching meal:', error);
            });
    
        }

    day.forEach(day => {
        fetchAndDisplayMeal(day, 'Lunch', userCategory);
        fetchAndDisplayMeal(day, 'Dinner', userCategory);
        fetchAndDisplayMeal(day, 'Breakfast', breakfastCategory);
    });
});