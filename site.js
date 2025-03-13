import { products } from "./products.js"

// this is to select the product and cart container from the DOM
const productsContainer = document.getElementById("products-container");
const cartList = document.getElementById("cartList");
const totalAmountElement = document.querySelector(".total-amount");

// create a cart object to track added items
const cart = {};

// function to render the product list
function renderProducts() {
    productsContainer.innerHTML = "";
    products.forEach((product, index) => {
        if(product.quantity > 0) {
            const productCard = document.createElement("div");
            productCard.setAttribute("draggable", true); // Make draggable
            productCard.dataset.index = index; // Store index for reference
            
            productCard.innerHTML = `
                <div class="card-img" style="background-image: url(${product.image});"></div>
                <div class="card-content">
                    <div class="card-title">${product.title}</div>
                    <div class="card-description">${product.description}</div>
                    <div class="card-price">$${product.price.toFixed(2)}</div>
                    <div class="card-quantity">Quantity: ${product.quantity}</div>
                </div>
            `;
            
            // this is to put the drag event
            productCard.addEventListener("dragstart", handleDragStart);
            
            productsContainer.appendChild(productCard);
        }
    });
}

// this is the function to render the cart items
function renderCart() {
    cartList.innerHTML = ""; // Clear cart
    let totalPrice = 0;
    
    Object.keys(cart).forEach(index => {
        const cartItem = cart[index];
        totalPrice += cartItem.quantity * cartItem.price;
        
        const cartCard = document.createElement("div");
        cartCard.classList.add("card");
        cartCard.setAttribute("draggable", true);
        cartCard.dataset.index = index;
        
        cartCard.innerHTML = `
            <div class="card-img" style="background-image: url(${cartItem.image});"></div>
            <div class="card-content">
                <div class="card-title">${cartItem.title}</div>
                <div class="card-price">$${cartItem.price.toFixed(2)}</div>
                <div class="card-quantity">Quantity: ${cartItem.quantity}</div>
            </div>
        `;
        
        // this is to put the drag event for removing items
        cartCard.addEventListener("dragstart", handleCartDragStart);
        
        cartList.appendChild(cartCard);
    });
    
    // Updating the total price
    totalAmountElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Handle product drag event
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
}

// Handle cart drag event (for removing items)
function handleCartDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
    event.dataTransfer.setData("fromCart", "true");
}

// Handle drop event in the cart
cartList.addEventListener("dragover", event => event.preventDefault());
cartList.addEventListener("drop", event => {
    event.preventDefault();
    const index = event.dataTransfer.getData("text/plain");
    const fromCart = event.dataTransfer.getData("fromCart");
    
    if (fromCart) {
        removeFromCart(index);
    } else {
        addToCart(index);
    }
});

// this is the function to add items to the cart
function addToCart(index) {
    index = parseInt(index);
    if (products[index].quantity > 0) {
        if (!cart[index]) {
            cart[index] = { ...products[index], quantity: 0 };
        }
        
        cart[index].quantity++;
        products[index].quantity--;
        
        renderProducts();
        renderCart();
    }
}

// Function to remove items from the cart
function removeFromCart(index) {
    index = parseInt(index);
    if (cart[index]) {
        products[index].quantity += cart[index].quantity;
        delete cart[index];
        
        renderProducts();
        renderCart();
    }
}

// Initial rendering of the products
renderProducts();
