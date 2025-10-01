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
        const productsHtml = products.map(product => {
            const formattedPrice = typeof formatCurrency === 'function' 
                ? formatCurrency(product.price) 
                : `$${parseFloat(product.price).toFixed(2)}`;
            const addToCartText = typeof translate === 'function' 
                ? translate('shop.add_to_cart') 
                : '➕ Add to Cart';
            return `
                <div class="product">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-actions">
                        <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1">
                        <button onclick="addToCart(${product.id})">${addToCartText}</button>
                    </div>
                </div>
            `;
        }).join('');
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
            const successMsg = typeof translate === 'function' 
                ? translate('shop.success_added') 
                : '✅ Item added to cart!';
            showResult('success-msg', successMsg);
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
        
        // Update currency symbol
        const currencySymbol = document.getElementById('currency-symbol');
        if (currencySymbol) {
            const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
            currencySymbol.textContent = lang === 'pt' ? 'R$' : '$';
        }
        
        if (cart.items && cart.items.length > 0) {
            const cartHtml = cart.items.map(item => {
                const formattedSubtotal = typeof formatCurrency === 'function' 
                    ? formatCurrency(item.subtotal) 
                    : `$${parseFloat(item.subtotal).toFixed(2)}`;
                return `
                    <div class="cart-item">
                        <div>${item.name} x${item.quantity}</div>
                        <div>${formattedSubtotal}</div>
                    </div>
                `;
            }).join('');
            document.getElementById('cart-items').innerHTML = cartHtml;
            total = cart.total;
        } else {
            const emptyMsg = typeof translate === 'function' 
                ? translate('shop.cart_empty') 
                : '🛒 Your cart is empty';
            document.getElementById('cart-items').innerHTML = `<div>${emptyMsg}</div>`;
        }
        
        // Convert total to current currency
        const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
        const displayTotal = lang === 'pt' ? (total * 5).toFixed(2) : total;
        document.getElementById('cart-total-input').value = displayTotal;
    } catch (error) {
        document.getElementById('cart-items').innerHTML = 
            '<div class="error-msg">Error loading cart: ' + error.message + '</div>';
    }
}

async function checkout() {
    try {
        // Get the total value from input
        let total = parseFloat(document.getElementById('cart-total-input').value);
        
        // Convert from BRL to USD if in Portuguese mode
        const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
        if (lang === 'pt') {
            total = total / 5; // Convert BRL back to USD for server
        }
        
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total })
        });
        const result = await response.json();
        if (response.ok) {
            currentOrderId = result.order_id;
            const successMsg = typeof translate === 'function' 
                ? `✅ ${translate('shop.success_checkout')} (${translate('shop.order_details')} #${result.order_id})`
                : `✅ ${result.message} (Order #${result.order_id})`;
            showResult('success-msg', successMsg, 'checkout-result');
            
            document.getElementById('order-info').style.display = 'block';
            const formattedTotal = typeof formatCurrency === 'function' 
                ? formatCurrency(result.total) 
                : `$${result.total}`;
            const orderDetailsText = typeof translate === 'function' 
                ? translate('shop.order_details') 
                : 'Order';
            document.getElementById('order-details').innerHTML = 
                `${orderDetailsText} #${result.order_id} - ${formattedTotal}`;
            loadCart();
        } else {
            showResult('error-msg', '❌ ' + result.error, 'checkout-result');
        }
    } catch (error) {
        showResult('error-msg', '❌ Checkout error: ' + error.message, 'checkout-result');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            const successMsg = typeof translate === 'function' 
                ? translate('shop.success_cleared') 
                : '✅ Cart cleared!';
            showResult('success-msg', successMsg);
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
