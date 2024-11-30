/* Shopping Cart Functionality for Ado Official Music Shop */
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

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

function purchaseClicked() {
    alert('Thank you for your purchase!!!');
    var cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal();
    }
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.closest('.card');
    
    // Extract product details
    var title = shopItem.querySelector('.shop-item-title').innerText;
    var price = shopItem.querySelector('.shop-item-title + span, h5 + span').innerText;
    var imageSrc = shopItem.querySelector('.shop-item-image').src;
    
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    var cartItems = document.querySelector('.cart-items');
    
    // Check if item already exists
    var cartItemNames = cartItems.querySelectorAll('.cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already in the cart!');
            return;
        }
    }
    
    // Create new cart row
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    
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
    
    cartRow.innerHTML = cartRowContents;
    cartItems.appendChild(cartRow);
    
    // Add event listeners to new row elements
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.closest('.cart-row').remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function updateCartTotal() {
    var cartItems = document.querySelector('.cart-items');
    var cartRows = cartItems.querySelectorAll('.cart-row');
    var total = 0;
    
    cartRows.forEach(function(cartRow) {
        var priceElement = cartRow.querySelector('.cart-price');
        var quantityElement = cartRow.querySelector('.cart-quantity-input');
        
        // Remove 'S$' or 'Rs' and parse float
        var price = parseFloat(priceElement.innerText.replace(/[S$Rs\s]/g, ''));
        var quantity = quantityElement.value;
        
        total += price * quantity;
    });
    
    // Round to two decimal places
    total = Math.round(total * 100) / 100;
    
    // Update total in cart
    var cartTotalPrice = document.querySelector('.cart-total-price');
    if (cartTotalPrice) {
        cartTotalPrice.innerText = 'S$ ' + total.toFixed(2);
    }
}