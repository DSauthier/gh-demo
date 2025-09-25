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
                <div class="product-price">${window.formatCurrency ? window.formatCurrency(parseFloat(product.price)) : '$' + parseFloat(product.price).toFixed(2)}</div>
                <div class="product-actions">
                    <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1">
                    <button onclick="addToCart(${product.id})" data-i18n="main.add_to_cart">➕ Add to Cart</button>
                </div>
            </div>
        `).join('');
        document.getElementById('products-list').innerHTML = productsHtml;
        
        // Update button text translations
        if (window.t) {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = window.t(key);
                if (translation && translation !== key) {
                    element.textContent = translation;
                }
            });
        }
    } catch (error) {
        const errorMsg = window.t ? window.t('msg.loading_error', 'Error loading') : 'Error loading';
        document.getElementById('products-list').innerHTML = 
            `<div class="error-msg">${errorMsg} products: ${error.message}</div>`;
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
            showResult('success-msg', '✅ Item added to cart!');
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
                    <div>${window.formatCurrency ? window.formatCurrency(parseFloat(item.subtotal)) : '$' + parseFloat(item.subtotal).toFixed(2)}</div>
                </div>
            `).join('');
            document.getElementById('cart-items').innerHTML = cartHtml;
            total = cart.total;
        } else {
            const emptyMsg = window.t ? window.t('main.cart_empty') : '🛒 Your cart is empty';
            document.getElementById('cart-items').innerHTML = `<div>${emptyMsg}</div>`;
        }
        
        // Update currency symbol and total
        const currencyInfo = window.getCurrencyInfo ? window.getCurrencyInfo() : {symbol: '$'};
        document.getElementById('currency-symbol').textContent = currencyInfo.symbol;
        const convertedTotal = window.convertAmount ? window.convertAmount(total) : total;
        document.getElementById('cart-total-input').value = convertedTotal.toFixed(2);
        
    } catch (error) {
        const errorMsg = window.t ? window.t('msg.loading_error', 'Error loading') : 'Error loading';
        document.getElementById('cart-items').innerHTML = 
            `<div class="error-msg">${errorMsg} cart: ${error.message}</div>`;
    }
}

async function checkout() {
    try {
        // VULNERABILITY: Send client-supplied total (can be manipulated!)
        // Convert the displayed amount back to USD for server
        const displayedTotal = document.getElementById('cart-total-input').value;
        const usdTotal = window.currentLanguage && window.currentLanguage() === 'pt' 
            ? displayedTotal / 5 : displayedTotal;
        
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: usdTotal }) // Send client-supplied total - VULNERABLE!
        });
        const result = await response.json();
        if (response.ok) {
            currentOrderId = result.order_id;
            showResult('success-msg', `✅ ${result.message} (Order #${result.order_id})`, 'checkout-result');
            document.getElementById('order-info').style.display = 'block';
            const displayTotal = window.formatCurrency ? window.formatCurrency(parseFloat(result.total)) : `$${result.total}`;
            document.getElementById('order-details').innerHTML = 
                `Order #${result.order_id} - Total: ${displayTotal}`;
            loadCart();
        } else {
            showResult('error-msg', '❌ ' + result.error, 'checkout-result');
        }
    } catch (error) {
        const errorMsg = window.t ? window.t('msg.checkout_error', 'Checkout error') : 'Checkout error';
        showResult('error-msg', `❌ ${errorMsg}: ${error.message}`, 'checkout-result');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            const successMsg = window.t ? window.t('msg.cart_cleared') : '✅ Cart cleared!';
            showResult('success-msg', successMsg);
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        const errorMsg = window.t ? window.t('msg.loading_error', 'Error clearing') : 'Error clearing';
        showResult('error-msg', `❌ ${errorMsg} cart: ${error.message}`);
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
