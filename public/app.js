// public/app.js - Shopping Cart Demo Frontend Logic

let currentOrderId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
});

// Listen for language changes to reload products and cart
window.addEventListener('languageChanged', function() {
    loadProducts();
    loadCart();
});

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const productsHtml = products.map(product => {
            const priceInCurrency = formatCurrency(parseFloat(product.price));
            return `
                <div class="product">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    <div class="product-price">${priceInCurrency}</div>
                    <div class="product-actions">
                        <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1">
                        <button onclick="addToCart(${product.id})" data-i18n="main.add_to_cart">➕ Add to Cart</button>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('products-list').innerHTML = productsHtml;
    } catch (error) {
        document.getElementById('products-list').innerHTML = 
            '<div class="error-msg">' + t('main.error_loading_products') + ' ' + error.message + '</div>';
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
            showResult('success-msg', t('main.item_added'));
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        showResult('error-msg', t('main.error_adding_item') + ' ' + error.message);
    }
}

async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        let total = 0;
        if (cart.items && cart.items.length > 0) {
            const cartHtml = cart.items.map(item => {
                const subtotalInCurrency = formatCurrency(parseFloat(item.subtotal));
                return `
                    <div class="cart-item">
                        <div>${item.name} x${item.quantity}</div>
                        <div>${subtotalInCurrency}</div>
                    </div>
                `;
            }).join('');
            document.getElementById('cart-items').innerHTML = cartHtml;
            total = cart.total;
        } else {
            document.getElementById('cart-items').innerHTML = '<div>' + t('main.cart_empty') + '</div>';
        }
        // Convert total to current currency
        const totalInCurrency = parseFloat(total) * getCurrencyRate();
        document.getElementById('cart-total-input').value = totalInCurrency.toFixed(2);
        document.getElementById('currency-symbol').textContent = getCurrencySymbol();
    } catch (error) {
        document.getElementById('cart-items').innerHTML = 
            '<div class="error-msg">' + t('main.error_loading_cart') + ' ' + error.message + '</div>';
    }
}

async function checkout() {
    try {
        // Convert displayed total back to USD for server
        const displayedTotal = document.getElementById('cart-total-input').value;
        const totalInUSD = parseFloat(displayedTotal) / getCurrencyRate();
        
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: totalInUSD })
        });
        const result = await response.json();
        if (response.ok) {
            currentOrderId = result.order_id;
            const totalDisplay = formatCurrency(parseFloat(result.total));
            showResult('success-msg', `${t('main.order_success')} ${result.message} (${t('main.order_total')}${result.order_id})`, 'checkout-result');
            document.getElementById('order-info').style.display = 'block';
            document.getElementById('order-details').innerHTML = 
                `${t('main.order_total')}${result.order_id} - ${t('main.total')} ${totalDisplay}`;
            loadCart();
        } else {
            showResult('error-msg', '❌ ' + result.error, 'checkout-result');
        }
    } catch (error) {
        showResult('error-msg', t('main.error_checkout') + ' ' + error.message, 'checkout-result');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            showResult('success-msg', t('main.cart_cleared'));
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        showResult('error-msg', t('main.error_clearing_cart') + ' ' + error.message);
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
