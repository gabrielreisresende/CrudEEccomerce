var existingProducts = [];
var cart = [];

document.addEventListener('DOMContentLoaded', function () {
    updateEcommercePage();

    window.addEventListener('storage', function (event) {
        if (event.key === 'db_produto') {
            updateEcommercePage();
        }
    });
});

function updateEcommercePage() {
    existingProducts = JSON.parse(localStorage.getItem('db_produto')) || [];
    var ecommerceContainer = document.getElementById('ecommerceContainer');
    ecommerceContainer.innerHTML = '';

    existingProducts.forEach(function (product, index) {
        var productElement = createProductElement(product, index);
        ecommerceContainer.appendChild(productElement);
    });
}

function createProductElement(product, index) {
    var productElement = document.createElement('div');
    productElement.innerHTML = `
    <img src="${product.imagem}" alt="${product.produto}">
    <div class="product-item">
        <span class="product-name">${product.produto}</span>
        <span class="product-price">${product.preco}</span>
        <span class="product-description">Descrição: ${product.descricao}</span>
        <button class="add-to-cart-button" onclick="addToCart(${index})">Comprar</button>
    </div>
  `;
    return productElement;
}

function addToCart(index) {
    var product = existingProducts[index];
    var existingCartItem = findCartItem(product);

    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({ product: product, quantity: 1 });
    }

    var confirmation = confirm("Gostaria de adicionar " + product.produto + " ao carrinho?");

    if (confirmation) {
        saveCartToLocalStorage();
        showCart();
    }
}



function findCartItem(product) {
    return cart.find(function (item) {
        return item.product === product;
    });
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCart() {
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    var cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>O carrinho está vazio</p> ';
    } else {
        cartItems.forEach(function (item, index) {
            var cartItem = createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItem);
        });
    }

    var totalPriceElement = document.createElement('span');
    totalPriceElement.classList.add('total-price');
    totalPriceElement.textContent = 'Total: R$ ' + calculateTotalPrice();
    cartItemsContainer.appendChild(totalPriceElement);
}
''
function createCartItemElement(item, index) {
    var cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    var productImage = document.createElement('img');
    productImage.src = item.product.imagem;
    productImage.alt = item.product.produto;
    cartItem.appendChild(productImage);

    var productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    var productName = document.createElement('span');
    productName.textContent = item.product.produto;
    productInfo.appendChild(productName);

    var productQuantity = document.createElement('span');
    productQuantity.classList.add('product-quantity');
    productQuantity.textContent = ' - Quantidade: ' + item.quantity; 
    productInfo.appendChild(productQuantity);

    var productPrice = document.createElement('span');
    productPrice.classList.add('product-price');
    productPrice.textContent = ' - ' + item.product.preco;
    productInfo.appendChild(productPrice);

    var incrementButton = document.createElement('button');
    incrementButton.style.cursor='pointer'
    incrementButton.style.fontSize='16px'
    incrementButton.style.background='none';
    incrementButton.style.border='none';
    incrementButton.textContent = '+';
    incrementButton.addEventListener('click', function () {
        incrementQuantity(index);
    });
    productInfo.appendChild(incrementButton);

    var decrementButton = document.createElement('button');
    decrementButton.style.cursor='pointer'
    decrementButton.style.fontSize='18px'
    decrementButton.style.background='none';
    decrementButton.style.border='none';
    decrementButton.textContent = '-';
    decrementButton.addEventListener('click', function () {
        decrementQuantity(index);
    });
    productInfo.appendChild(decrementButton);

    var deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.addEventListener('click', function () {
        removeProduct(index);
        showCart();
    });

    productInfo.appendChild(deleteIcon);
    cartItem.appendChild(productInfo);

    return cartItem;
}

function toggleCart() {
    var cartContainer = document.getElementById('cartContainer');
    showCart();
    cartContainer.classList.toggle('show');
}

function removeProduct(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    showCart();
}

function incrementQuantity(index) {
    cart[index].quantity++;
    saveCartToLocalStorage();
    showCart();
}

function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCartToLocalStorage();
    showCart();
}

function calculateTotalPrice() {
    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    var totalPrice = 0;

    cartItems.forEach(function (item) {
        var price = item.product.preco.replace(/[^\d.-]/g, '');
        totalPrice += parseFloat(price) * item.quantity / 100;
    });

    return totalPrice.toFixed(2);
}

function redirectToPayment() {
    window.location.href = 'pagamento.html';
}
