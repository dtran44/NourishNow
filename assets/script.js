var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
var breakfastCategory = 'Breakfast';
var userCategory = 'Chicken';
var menuPlan = [];


document.addEventListener('DOMContentLoaded', function() {
    function generateMealPlan(day, mealType, meal) {
        var mealName = meal.strMeal;
        var mealThumbnail = meal.strMealThumb;
        var mealInstructions = meal.strInstructions;
        var ingredientsList = [];

        // Collect ingredients and measurements from the meal object
        for (var i = 1; i <= 50; i++) {
            var ingredient = meal['strIngredient' + i];
            var measurement = meal['strMeasure' + i];
            if (ingredient && ingredient.trim() !== '') {
                // Store each ingredient with its measurement in an object
                var ingredientObject = {
                    name: ingredient,
                    measurement: measurement
                };
                ingredientsList.push(ingredientObject);
            } else {
                break;
            }
        }

        // Create a meal object containing details
        var mealObject = {
            day: day,
            mealtype: mealType,
            name: mealName,
            ingredients: ingredientsList,
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
        ingredientsList.forEach(ingredient => {
        var li = document.createElement('li');
        li.textContent = ingredient.name;
         mealIngredientsEl.appendChild(li);
        });
        mealIngredientsEl.style.display = 'none';

        // Function to toggle display on click
        var mealInstructionsDiv = document.getElementById('mealInstructions');
        var mealIngredientsDiv = document.getElementById('mealIngredients');

        function toggleDisplay(element, ingredientObjects) {
            if (element.style.display === 'none') {
                // Construct a string to display ingredient objects
                var ingredientsText = ingredientObjects.map(ingredient => {
                    return `${ingredient.name} - ${ingredient.measurement}`;
                }).join('\n'); // Use '\n' to separate each ingredient
        
                mealInstructionsDiv.textContent = mealInstructions;
                mealIngredientsDiv.textContent = ingredientsText;

                  // Show the recipe div and hide the meal plan div
                  document.getElementById('recipe').style.display = 'block';
                  document.querySelectorAll('.weekday').forEach(weekday => {
                      weekday.style.display = 'none';
                  });

            } else {
                element.style.display = 'none';
            }
        }
        
        // Add click event listener to the meal image for toggling display
        mealImage.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event bubbling
        
            toggleDisplay(mealIngredientsEl, ingredientsList);
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

    // Add click event listener to back button on the Recipe page
        document.getElementById('backRecipeBtn').addEventListener('click', function() {
        document.getElementById('recipe').style.display = 'none'; // Hide the recipe div
        document.querySelectorAll('.weekday').forEach(weekday => {
            weekday.style.display = 'flex'; // Show the meal plan div
        
        })
        })

    // Function to fetch meal details by category from API
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

// Function to update the breakfast section for each day with the word "Breakfast"
function updateBreakfastSection() {
    // Iterate through each day of the week
    day.forEach(day => {
        var breakfastElement = document.getElementById(`${day.toLowerCase()}-breakfast`);
        if (breakfastElement) {
            // Update the content of the breakfast section
            breakfastElement.textContent = 'Breakfast';
        }
    });
}

// Function to update the lunch section for each day with the word "Lunch"
function updateLunchSection() {
    // Iterate through each day of the week
    day.forEach(day => {
        var lunchElement = document.getElementById(`${day.toLowerCase()}-lunch`);
        if (lunchElement) {
            // Update the content of the Lunch section
            lunchElement.textContent = 'Lunch';
        }
    });
}
// Function to update the dinner section for each day with the word "Dinner"
function updateDinnerSection() {
    // Iterate through each day of the week
    day.forEach(day => {
        var dinnerElement = document.getElementById(`${day.toLowerCase()}-dinner`);
        if (dinnerElement) {
            // Update the content of the Dinner section
            dinnerElement.textContent = 'Dinner';
        }
    });
}
// Call the function to update the meal headings
updateBreakfastSection();
updateLunchSection();
updateDinnerSection();


      // Add click event listener to generate a new meal plan
      document.getElementById('regenBtn').addEventListener('click', function() {
        fetchNewMealPlan();
    })

    // Add click event listener to save menuplan into local storage
    document.getElementById('createBtn').addEventListener('click', function() {
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

       // Show the list div
       document.getElementById('list').style.display = 'block';
       document.querySelectorAll('.weekday').forEach(weekday => {weekday.style.display = 'none'});
    });

    // Define the variable to store unique lowercase ingredients globally
var uniqueLowercaseIngredients = [];


})

document.getElementById('backListBtn').addEventListener('click', function() {
    document.getElementById('list').style.display = 'none'; // Hide the shopping list div
    document.querySelectorAll('.weekday').forEach(weekday => {
        weekday.style.display = 'flex'; // Show the meal plan div
    })
    })

// Function to display the list of ingredients with checkboxes from local storage
function displayIngredients() {
    var ingredientsList = JSON.parse(localStorage.getItem('ingredients'));
    var ingredientsDiv = document.getElementById('shoppingList');

    if (ingredientsList && ingredientsList.length > 0) {
        var ul = document.createElement('ul');

        ingredientsList.forEach(ingredient => {
            var li = document.createElement('li');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = ingredient.name;
            checkbox.id = ingredient.name.toLowerCase().replace(/\s/g, '-'); // Create unique ID for each checkbox
            var label = document.createElement('label');
            label.textContent = ingredient.name;
            label.htmlFor = checkbox.id;

            // Add event listener for strike-through effect
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    label.style.textDecoration = 'line-through';
                } else {
                    label.style.textDecoration = 'none';
                }
            });

            li.appendChild(checkbox);
            li.appendChild(label);
            ul.appendChild(li);
        });

        // Clear the existing content before appending the new list
        ingredientsDiv.innerHTML = '';
        ingredientsDiv.appendChild(ul);
    } else {
        // Clear the existing content if no ingredients found
        ingredientsDiv.textContent = 'No ingredients found.';
    }
}

document.getElementById('saveListBtn').addEventListener('click', function() {
    // Save the unchecked shopping list items to local storage
    var uncheckedIngredients = [];
    var checkboxes = document.querySelectorAll('.shoppingList input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            uncheckedIngredients.push(checkbox.value);
        }
    });
    localStorage.setItem('shoppingList', JSON.stringify(uncheckedIngredients));
});

