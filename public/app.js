// public/app.js - Shopping Cart Demo Frontend Logic

let currentOrderId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const productsHtml = products.map(product => `
            <div class="product">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-actions">
                    <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1">
                    <button onclick="addToCart(${product.id})" data-i18n="shop.add_to_cart">➕ Add to Cart</button>
                </div>
            </div>
        `).join('');
        document.getElementById('products-list').innerHTML = productsHtml;
    } catch (error) {
        document.getElementById('products-list').innerHTML = 
            '<div class="error-msg">Error loading products: ' + error.message + '</div>';
    }
}

async function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            showResult('success-msg', t('shop.item_added'));
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        showResult('error-msg', '❌ Error adding item: ' + error.message);
    }
}

async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        let total = 0;
        if (cart.items && cart.items.length > 0) {
            const cartHtml = cart.items.map(item => `
                <div class="cart-item">
                    <div>${item.name} x${item.quantity}</div>
                    <div>${formatCurrency(item.subtotal)}</div>
                </div>
            `).join('');
            document.getElementById('cart-items').innerHTML = cartHtml;
            total = cart.total;
        } else {
            document.getElementById('cart-items').innerHTML = '<div data-i18n="shop.cart_empty">🛒 Your cart is empty</div>';
        }
        document.getElementById('cart-total-input').value = formatCurrency(total, false);
        document.getElementById('currency-symbol').textContent = getCurrencySymbol();
    } catch (error) {
        document.getElementById('cart-items').innerHTML = 
            '<div class="error-msg">Error loading cart: ' + error.message + '</div>';
    }
}

async function checkout() {
    try {
        const total = document.getElementById('cart-total-input').value;
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total })
        });
        const result = await response.json();
        if (response.ok) {
            currentOrderId = result.order_id;
            const successMsg = t('shop.checkout_success');
            showResult('success-msg', `${successMsg} (Order #${result.order_id})`, 'checkout-result');
            document.getElementById('order-info').style.display = 'block';
            const orderTotalText = t('shop.order_total')
                .replace('${id}', result.order_id)
                .replace('${total}', formatCurrency(result.total));
            document.getElementById('order-details').innerHTML = orderTotalText;
            loadCart();
        } else {
            showResult('error-msg', '❌ ' + result.error, 'checkout-result');
        }
    } catch (error) {
        const errorMsg = t('shop.checkout_error');
        showResult('error-msg', `${errorMsg} ${error.message}`, 'checkout-result');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            showResult('success-msg', t('shop.cart_cleared'));
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        showResult('error-msg', '❌ Error clearing cart: ' + error.message);
    }
}

function showResult(className, message, targetId = null) {
    const resultDiv = document.createElement('div');
    resultDiv.className = `result ${className}`;
    resultDiv.innerHTML = message;
    const target = targetId ? document.getElementById(targetId) : document.body;
    const existingResult = target.querySelector('.result');
    if (existingResult) {
        existingResult.remove();
    }
    target.appendChild(resultDiv);
    setTimeout(() => {
        if (resultDiv.parentNode) {
            resultDiv.remove();
        }
    }, 5000);
}

// Expose functions for HTML onclick
window.clearCart = clearCart;
window.loadProducts = loadProducts;
window.checkout = checkout;
window.addToCart = addToCart;
