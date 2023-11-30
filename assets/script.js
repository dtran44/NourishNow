var day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var breakfastCategory = "Breakfast";
var userCategory = [];
var menuPlan = [];
var startButton = document.querySelector(".start");
var landingPage = document.querySelector(".landingPage");
var dietSelectPage = document.querySelector(".dietSelect");
var MealPlan = document.querySelector(".fiveDayMealPlan");
var MeatButton = document.querySelector(".Meat");
var VegoButton = document.querySelector(".Vego");
var VeganButton = document.querySelector(".Vegan");

//hides Landing Page when start button is clicked
startButton.addEventListener("click", function () {
  landingPage.classList.add("hide");
});

//removes hide from  Diet Selection Page
startButton.addEventListener("click", function () {
  dietSelectPage.classList.remove("hide");
  dietSelectPage.classList.add("flex");
});

//hides Diet Selection Page while landing page is active
dietSelectPage.classList.add("hide");

// Function to fetch a meal for a specific day and meal type
function fetchAndDisplayMeal(day, mealType, category) {
  // Fetch lunch and dinner meals based on userCategory
  var specificCategory = category;

  // Check if the meal type is Lunch or Dinner and modify the category 
  if (mealType === "Lunch") {
    if (userCategory === "Vegan") {
      specificCategory = "Vegan";
    } else if (userCategory === "Vegetarian") {
      specificCategory = "Vegetarian";
    } else {
      specificCategory = "Chicken";
    }
  } else if (mealType === "Dinner") {
    if (userCategory === "Vegan") {
      specificCategory = "Vegan";
    } else if (userCategory === "Vegetarian") {
      specificCategory = "Vegetarian";
    } else {
      specificCategory = "Beef";
    }
  }

  function generateMealPlan(day, mealType, meal) {
    var mealName = meal.strMeal;
    var mealThumbnail = meal.strMealThumb;
    var mealInstructions = meal.strInstructions;
    var ingredientsList = [];

    // Collect ingredients and measurements from the meal object
    for (var i = 1; i <= 50; i++) {
      var ingredient = meal["strIngredient" + i];
      var measurement = meal["strMeasure" + i];
      if (ingredient && ingredient.trim() !== "") {
        // Store each ingredient with its measurement in an object
        var ingredientObject = {
          name: ingredient,
          measurement: measurement,
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
      instructions: mealInstructions,
    };

    // Add the meal object to the menuPlan array
    menuPlan.push(mealObject);

    // Create HTML elements to display meal details
    var mealContainer = document.createElement("div");
    mealContainer.classList.add("meal");

    var mealImage = document.createElement("img");
    mealImage.src = mealThumbnail;
    mealImage.alt = mealName;
    mealImage.classList.add("meal-image");

    var mealTitle = document.createElement("h6");
    mealTitle.textContent = mealName;

    var mealInstructionsEl = document.createElement("p");
    mealInstructionsEl.textContent = mealInstructions;
    mealInstructionsEl.style.display = "none";

    var mealIngredientsEl = document.createElement("ul");
    ingredientsList.forEach((ingredient) => {
      var li = document.createElement("li");
      li.textContent = ingredient.name;
      mealIngredientsEl.appendChild(li);
    });
    mealIngredientsEl.style.display = "none";

    // Function to toggle display on click
    var mealInstructionsDiv = document.getElementById("mealInstructions");
    var mealIngredientsDiv = document.getElementById("mealIngredients");

    function toggleDisplay(element, ingredientObjects) {
      if (element.style.display === "none") {
        // Construct a string to display ingredient objects
        var ingredientsText = ingredientObjects
          .map((ingredient) => {
            return `${ingredient.name} - ${ingredient.measurement}`;
          })
          .join("\n"); 

        mealInstructionsDiv.textContent = mealInstructions;
        mealIngredientsDiv.textContent = ingredientsText;

        // Show the recipe div and hide the meal plan div
        document.getElementById("recipe").style.display = "block";
        document.querySelectorAll(".weekday").forEach((weekday) => {
          weekday.style.display = "none";
        });
      } else {
        element.style.display = "none";
      }
    }

    // Add click event listener to the meal image for toggling display
    mealImage.addEventListener("click", function (event) {
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

  // Function to fetch meal details by category from API
  function getMealDetailsByCategory(category) {
    let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.meals && data.meals.length > 0) {
          // Select a random meal from the fetched list
          var randomIndex = Math.floor(Math.random() * data.meals.length);
          var randomMeal = data.meals[randomIndex]; // Get a random meal

          // Extract the meal ID of the random meal
          var mealId = randomMeal.idMeal;
          return mealId;
        } else {
          return null; // Return null if no meals found
        }
      })
      .then((mealId) => {
        if (mealId) {
          // Fetch meal details by ID
          let mealDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
          return fetch(mealDetailsUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Network response was not ok: ${response.status}`
                );
              }
              return response.json();
            })
            .then((data) => {
              if (data.meals && data.meals.length > 0) {
                // Return the details of the meal
                var mealDetails = data.meals[0];
                return mealDetails;
              } else {
                return null; // Return null if no meal details found
              }
            });
        } else {
          return null; // Return null if no meal ID available
        }
      })
      .catch((error) => {
        console.error("Error fetching meal details:", error);
        return null;
      });
  }
// Creates a random meal based on a specific category
  getMealDetailsByCategory(specificCategory)
    .then((randomMeal) => {
      if (randomMeal) {
        generateMealPlan(day, mealType, randomMeal);
      } else {
        console.log(`No ${mealType.toLowerCase()} found for ${day}`);
      }
    })
    .catch((error) => {
      console.error("Error fetching meal:", error);
    });
}

// Clears the meal plan
function clearMealPlan() {
  day.forEach((day) => {
    ["Breakfast", "Lunch", "Dinner"].forEach((mealType) => {
      var menuId = `${day.toLowerCase()}-${mealType.toLowerCase()}`;
      var menu = document.getElementById(menuId);
      if (menu) {
        menu.innerHTML = ""; // Clear the content of the menu container
      }
    });
  });
}

// Populates the day with the meal plan based on preferences
function fetchNewMealPlan() {
  menuPlan = [];
  clearMealPlan();
  day.forEach((day) => {
    fetchAndDisplayMeal(day, "Lunch", userCategory);
    fetchAndDisplayMeal(day, "Dinner", userCategory);
    fetchAndDisplayMeal(day, "Breakfast", breakfastCategory);
  });
}


//removes hide from Meal Plan Page when Carnivore button is clicked
MeatButton.addEventListener("click", function () {
  userCategory = "Chicken";
  fetchNewMealPlan();
  showMealPlan();
  dietSelectPage.classList.add("hide");
});

//removes hide from Meal Plan Page when Vegetarian button is clicked
VegoButton.addEventListener("click", function () {
  userCategory = "Vegetarian";
  fetchNewMealPlan();
  showMealPlan();
  dietSelectPage.classList.add("hide");
});

//removes hide from Meal Plan Page when Vegan button is clicked
VeganButton.addEventListener("click", function () {
  userCategory = "Vegan";
  fetchNewMealPlan();
  showMealPlan();
  dietSelectPage.classList.add("hide");
});

  
// Function to show the Meal Plan
function showMealPlan() {
  document.querySelectorAll(".weekday").forEach((weekday) => {
    weekday.style.display = "flex";

  });

  document.querySelector('body').style.background = 'none'
}


// Add click event listener to back button on the Recipe page
document.getElementById("backRecipeBtn").addEventListener("click", function () {
  document.getElementById("recipe").style.display = "none"; // Hide the recipe div
  document.querySelectorAll(".weekday").forEach((weekday) => {
    weekday.style.display = "flex"; // Show the meal plan div
  });
});

// Add click event listener to generate a new meal plan
document.getElementById("regenBtn").addEventListener("click", function () {
  fetchNewMealPlan();
});

// Add click event listener to save menuplan into local storage
document.getElementById("createBtn").addEventListener("click", function () {
  // Save the entire menu plan to local storage
  localStorage.setItem("mealPlanSaved", JSON.stringify(menuPlan));

  // Extract ingredients from the menuPlan
  var ingredientsList = [];
  menuPlan.forEach((meal) => {
    ingredientsList.push(...meal.ingredients);
  });

  // Save ingredients to localStorage separately
  localStorage.setItem("ingredients", JSON.stringify(ingredientsList));

  // Display ingredients in the shopping list
  displayIngredients();

  // Show the list div
  document.getElementById("list").style.display = "block";
  document.querySelectorAll(".weekday").forEach((weekday) => {
    weekday.style.display = "none";
  });
});


// Function to display the list of ingredients with checkboxes from local storage
function displayIngredients() {
  var ingredientsList = JSON.parse(localStorage.getItem("ingredients"));
  var ingredientsDiv = document.getElementById("shoppingList");

  if (ingredientsList && ingredientsList.length > 0) {
    var uniqueIngredients = new Set(); // Use a Set to store unique ingredients

    ingredientsList.forEach((ingredient) => {
      uniqueIngredients.add(ingredient.name.toLowerCase()); // Store ingredient names in lowercase to ensure case-insensitive comparison
    });

    var ul = document.createElement("ul");

    uniqueIngredients.forEach((ingredientName) => {
      var li = document.createElement("li");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = ingredientName;
      checkbox.id = ingredientName.replace(/\s/g, "-"); // Create unique ID for each checkbox
      var label = document.createElement("label");
      label.textContent = ingredientName;
      label.htmlFor = checkbox.id;

      // Add event listener for strike-through effect
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          label.style.textDecoration = "line-through";
        } else {
          label.style.textDecoration = "none";
        }
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      ul.appendChild(li);
    });

    // Clear the existing content before appending the new list
    ingredientsDiv.innerHTML = "";
    ingredientsDiv.appendChild(ul);
  } else {
    // Clear the existing content if no ingredients found
    ingredientsDiv.textContent = "No ingredients found.";
  }
}

// Save the unchecked shopping list items to local storage
document.getElementById("saveListBtn").addEventListener("click", function () {
  var uncheckedIngredients = [];
  var checkboxes = document.querySelectorAll(
    '.shoppingList input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    if (!checkbox.checked) {
      uncheckedIngredients.push(checkbox.value);
    }
  });
  localStorage.setItem("shoppingList", JSON.stringify(uncheckedIngredients));
  document.getElementById("list").style.display = "none"; // Hide the shopping list div
  document.querySelectorAll(".weekday").forEach((weekday) => {
    weekday.style.display = "flex"; // Show the meal plan div
  
  });

});



