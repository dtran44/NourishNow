document.addEventListener('DOMContentLoaded', function() {
    // Function to create and append meal details to the specified menu
    function addMealToMenu(day, mealType, meal) {
        var mealName = meal.strMeal;
        var mealThumbnail = meal.strMealThumb;
        var mealInstructions = meal.strInstructions;
        var ingredients = [];

        // Collect ingredients and measurements from the meal object
        for (var i = 1; i <= 50; i++) {
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

        
        // Append elements to the specified menu based on the day and meal type
        var menuId = `${day.toLowerCase()}-${mealType}`;
        var menu = document.getElementById(menuId);
        if (menu) {
            mealContainer.appendChild(mealImage);
            mealContainer.appendChild(mealTitle);
            menu.appendChild(mealContainer);
        }
    }
    
var category = "Vegan";
var area = "Chinese";

function getRandomMealByCategoryAndArea(category, area) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}&a=${area}`;

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
                return data.meals[randomIndex];
                const mealId = randomMeal.idMeal; // Extract meal ID

                // Return meal details along with mealId
                return { meal: randomMeal, mealId: mealId };
         } else {
             return { meal: null, mealId: null }; // Return null values if no meals found
         }
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
            return null;
        });
}

// Function to fetch a meal for a specific day and meal type
function fetchAndDisplayMeal(day, mealType) {
    getRandomMealByCategoryAndArea(category, area)
        .then(randomMeal => {
            if (randomMeal) {
                // Call addMealToMenu for the random meal fetched
                addMealToMenu(day, mealType, randomMeal);
            } else {
                console.log("No meals found with the provided criteria.");
            }
        });
}

// Iterate through days (Monday to Friday) and fetch a random meal for each meal type
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

days.forEach(day => {
    fetchAndDisplayMeal(day, 'lunch');
    fetchAndDisplayMeal(day, 'dinner');
});

var breakfastCategory = "Breakfast";

// Function to fetch a breakfast meal for a specific day
function fetchAndDisplayBreakfast(day) {
    getRandomMealByCategoryAndArea(breakfastCategory, area)
        .then(randomMeal => {
            if (randomMeal) {
                // Call addMealToMenu for the breakfast meal fetched
                addMealToMenu(day, 'breakfast', randomMeal);
            } else {
                console.log("No meals found with the provided criteria for breakfast.");
            }
        });
}

// Iterate through days (Monday to Friday) and fetch a breakfast meal for each day
days.forEach(day => {
    fetchAndDisplayBreakfast(day);


}); 




});


