var startButton = document.querySelector(".start")
var landingPage = document.querySelector(".landingPage")
var dietSelectPage = document.querySelector(".dietSelect")
var MealPlan = document.querySelector(".fiveDayMealPlan")
var MeatButton = document.querySelector(".Meat")
var VegoButton = document.querySelector(".Vego")
var VeganButton = document.querySelector(".Vegan")
var GFButton = document.querySelector(".GF")

//hides Landing Page when start button is clicked
startButton.addEventListener("click", function(){
    landingPage.classList.add("hide")
})

//removes hide from  Diet Selection Page
startButton.addEventListener("click", function(){
    dietSelectPage.classList.remove("hide")
    dietSelectPage.classList.add("flex")
})

//hides Diet Selection Page while landing page is active
dietSelectPage.classList.add("hide")

//hides Meal Plan Page while landing page and diet select page are active
MealPlan.classList.add("hide")

//removes hide from Meal Plan Page when Carnivore button is clicked
MeatButton.addEventListener("click", function(){
    MealPlan.classList.remove("hide")
    dietSelectPage.classList.add("flex")
})

//removes hide from Meal Plan Page when Vegetarian button is clicked
VegoButton.addEventListener("click", function(){
    MealPlan.classList.remove("hide")
    dietSelectPage.classList.add("flex")
})

//removes hide from Meal Plan Page when Vegan button is clicked
VeganButton.addEventListener("click", function(){
    MealPlan.classList.remove("hide")
    dietSelectPage.classList.add("flex")
})

//removes hide from Meal Plan Page when Gluten Free button is clicked
GFButton.addEventListener("click", function(){
    MealPlan.classList.remove("hide")
    dietSelectPage.classList.add("flex")
})

//hides Diet Selection when Carnivore button is clicked
MeatButton.addEventListener("click", function(){
    dietSelectPage.classList.add("hide")
})

//hides Diet Selection when Vegetarian button is clicked
VegoButton.addEventListener("click", function(){
    dietSelectPage.classList.add("hide")
})

//hides Diet Selection when Vegan button is clicked
VeganButton.addEventListener("click", function(){
    dietSelectPage.classList.add("hide")
})

//hides Diet Selection Page when GF button is clicked
GFButton.addEventListener("click", function(){
    dietSelectPage.classList.add("hide")
})