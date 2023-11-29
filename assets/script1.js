// Retrieve shopping list from localStorage
var items = JSON.parse(localStorage.getItem("shoppingList")) || [];

// Display shopping list in List button
var itemListElement = document.getElementById('savedList');

// Function to display items in the list
function displayItems(items) {
  if (items && items.length > 0) {
    var ul = document.createElement('ul');
    items.forEach(function(item) {
      var li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    itemListElement.appendChild(ul);
  } else {
    itemListElement.textContent = 'No items found';
  }
}

// Call the function to display items
displayItems(items);



// Add click event listener to navigate from shopping list to location page 

      
  


  