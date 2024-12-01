/* Shopping Cart Functionality for Ado Official Music Shop */

// Check if the document is still loading, and if so, add an event listener for when it's ready
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Function that runs when the document is ready
function ready() {
    // Add event listeners to all 'Add To Cart' buttons
    var addToCartButtons = document.querySelectorAll('.shop-item-button, [onclick="addToCart()"]');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', addToCartClicked);
    });

    // Add event listener to purchase button
    var purchaseButton = document.querySelector('.btn-purchase');
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked);
    }
}

// Function that runs when the purchase button is clicked
function purchaseClicked() {
    alert('Thank you for your purchase!!!'); // Alert the user of the purchase
    var cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal(); // Update the total price after clearing the cart
    }
}

// Function that runs when an 'Add To Cart' button is clicked
function addToCartClicked(event) {
    var button = event.target; // Get the button that was clicked
    var shopItem = button.closest('.card'); // Find the closest card element
    
    // Extract product details
    var title = shopItem.querySelector('.shop-item-title').innerText;
    var price = shopItem.querySelector('.shop-item-title + span, h5 + span').innerText;
    var imageSrc = shopItem.querySelector('.shop-item-image').src;
    
    // Add the item to the cart
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

// Function to add an item to the cart
function addItemToCart(title, price, imageSrc) {
    var cartItems = document.querySelector('.cart-items');
    
    // Check if item already exists
    var cartItemNames = cartItems.querySelectorAll('.cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already in the cart!');
            return; // Exit the function if item is found
        }
    }
    
    // Create new cart row
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    
    // Define the contents of the new cart row
    var cartRowContents = `
        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="75" height="75 style="margin-right: 10px;">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td></td>
        <td class="cart-item cart-column" style="padding-right: 0%;">
            <span class="cart-price cart-column">${price}</span>
        </td>
                <td class="cart-item cart-column" style="padding-right: 10%;">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>        
    `;
    
    cartRow.innerHTML = cartRowContents; // Insert the row contents into the cart row
    cartItems.appendChild(cartRow); // Add the new row to the cart
    
    // Add event listeners to new row elements
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
}

// Function to remove an item from the cart
function removeCartItem(event) {
    var buttonClicked = event.target; // Get the button that was clicked
    buttonClicked.closest('.cart-row').remove(); // Remove the closest cart row
    updateCartTotal(); // Update the total price after removal
}

// Function to handle changes in item quantity
function quantityChanged(event) {
    var input = event.target; // Get the input field that triggered the event
    // Check if the input value is not a number or less than or equal to 0
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1; // Set the quantity to 1 if invalid
    }
    updateCartTotal(); // Update the cart total after quantity change
}

// Function to update the total price in the shopping cart
function updateCartTotal() {
    var cartItems = document.querySelector('.cart-items'); // Select the cart items container
    var cartRows = cartItems.querySelectorAll('.cart-row'); // Get all rows in the cart
    var total = 0; // Initialize total variable to accumulate the total price
    
     // Loop through each cart row to calculate the total price
    cartRows.forEach(function(cartRow) {
        var priceElement = cartRow.querySelector('.cart-price'); // Select the price element
        var quantityElement = cartRow.querySelector('.cart-quantity-input'); // Select the quantity input
        
        // Remove currency symbols and whitespace, then parse the price as a float
        var price = parseFloat(priceElement.innerText.replace(/[S$Rs\s]/g, ''));
        var quantity = quantityElement.value;
        
        // Calculate total price for this cart row and add it to the total
        total += price * quantity;
    });
    
    // Round to two decimal places
    total = Math.round(total * 100) / 100;
    
    // Update the displayed total price in the cart
    var cartTotalPrice = document.querySelector('.cart-total-price'); // Select the total price element
    if (cartTotalPrice) {
        // Set the inner text to the formatted total price
        cartTotalPrice.innerText = 'S$ ' + total.toFixed(2); // Format to 2 decimal places
    }
}