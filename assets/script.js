var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var breakfastCategory = 'Breakfast';
var userCategory = 'Chicken';
var menuPlan = [];

document.addEventListener('DOMContentLoaded', function() {
    function generateMealPlan(day, mealType, meal) {
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

        // Create a meal object containing details
        var mealObject = {
            day: day,
            mealtype: mealType,
            name: mealName,
            ingredients: ingredients,
            instructions: mealInstructions
        };

        // Add the meal object to the menuPlan array
        menuPlan.push(mealObject);

        // Create HTML elements to display meal details
        var mealContainer = document.createElement('div');
        mealContainer.classList.add('meal');

        var mealImage = document.createElement('img');
        mealImage.src = mealThumbnail;
        mealImage.alt = mealName;
        mealImage.classList.add('meal-image');

        var mealTitle = document.createElement('h6');
        mealTitle.textContent = mealName;

        var mealInstructionsEl = document.createElement('p');
        mealInstructionsEl.textContent = mealInstructions;
        mealInstructionsEl.style.display = 'none';

        var mealIngredientsEl = document.createElement('ul');
        ingredients.forEach(ingredient => {
            var li = document.createElement('li');
            li.textContent = ingredient;
            mealIngredientsEl.appendChild(li);
        });
        mealIngredientsEl.style.display = 'none';

        // Function to toggle display on click
        var mealInstructionsDiv = document.getElementById('mealInstructions');
        var mealIngredientsDiv = document.getElementById('mealIngredients');

        function toggleDisplay(element) {
            if (element.style.display === 'none') {
                mealInstructionsDiv.textContent = mealInstructions;
                mealIngredientsDiv.textContent = ingredients;
            } else {
                element.style.display = 'none';
            }
        }

        // Add click event listener to the meal image for toggling display
        mealImage.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling

            toggleDisplay(mealIngredientsEl);
            toggleDisplay(mealInstructionsEl);
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
                    generateMealPlan(day, mealType, randomMeal);
                } else {
                    console.log(`No ${mealType.toLowerCase()} found for ${day}`);
                }
            })
            .catch(error => {
                console.error('Error fetching meal:', error);
            });
    }

    function clearMealPlan() {
        day.forEach(day => {
            ['Breakfast', 'Lunch', 'Dinner'].forEach(mealType => {
                const menuId = `${day.toLowerCase()}-${mealType.toLowerCase()}`;
                const menu = document.getElementById(menuId);
                if (menu) {
                    menu.innerHTML = ''; // Clear the content of the menu container
                }
            });
        });
    }

    function fetchNewMealPlan() {
        menuPlan = [];
        clearMealPlan();
        day.forEach(day => {
            fetchAndDisplayMeal(day, 'Lunch', userCategory);
            fetchAndDisplayMeal(day, 'Dinner', userCategory);
            fetchAndDisplayMeal(day, 'Breakfast', breakfastCategory);
        });
    }

    fetchNewMealPlan();


      // Add click event listener to generate a new meal plan
      document.getElementById('regenBtn').addEventListener('click', function() {
        fetchNewMealPlan();
    })

    // Add click event listener to save menuplan into local storage
    document.getElementById('saveBtn').addEventListener('click', function() {
        // Save the entire menu plan to local storage
        localStorage.setItem('mealPlanSaved', JSON.stringify(menuPlan));
    
        // Extract ingredients from the menuPlan
        var ingredientsList = [];
        menuPlan.forEach(meal => {
            ingredientsList.push(...meal.ingredients);
        });
    
        // Save ingredients to localStorage separately
        localStorage.setItem('ingredients', JSON.stringify(ingredientsList));
    
           // Display ingredients in the shopping list
           displayIngredients();
    });

 // Function to display the list of ingredients from local storage
 function displayIngredients() {
    var ingredientsList = JSON.parse(localStorage.getItem('ingredients'));

    // Get the div where you want to display the list
    var ingredientsDiv = document.getElementById('list');

    if (ingredientsList && ingredientsList.length > 0) {
        // Create an unordered list element
        var ul = document.createElement('ul');

        // Loop through the ingredients and create list items
        ingredientsList.forEach(ingredient => {
            var li = document.createElement('li');
            li.textContent = ingredient;
            ul.appendChild(li); // Append each list item to the unordered list
        });

        // Append the unordered list to the div
        ingredientsDiv.appendChild(ul);
    } else {
        // If no ingredients are found, display a message
        ingredientsDiv.textContent = 'No ingredients found.';
    }
}
      
})



  
    

     