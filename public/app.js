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
            const price = parseFloat(product.price);
            const formattedPrice = typeof formatCurrency === 'function' ? 
                formatCurrency(price) : `$${price.toFixed(2)}`;
            const addToCartText = typeof t === 'function' ? 
                t('products.add_to_cart') : '➕ Add to Cart';
            
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
        const errorMsg = typeof t === 'function' ? 
            t('messages.error_loading_products') : 'Error loading products:';
        document.getElementById('products-list').innerHTML = 
            `<div class="error-msg">${errorMsg} ${error.message}</div>`;
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
            const cartHtml = cart.items.map(item => {
                const subtotal = parseFloat(item.subtotal);
                const formattedSubtotal = typeof formatCurrency === 'function' ? 
                    formatCurrency(subtotal) : `$${subtotal.toFixed(2)}`;
                
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
            const emptyMsg = typeof t === 'function' ? 
                t('cart.empty') : '🛒 Your cart is empty';
            document.getElementById('cart-items').innerHTML = `<div>${emptyMsg}</div>`;
        }
        
        // Convert total for display if Portuguese is selected
        const displayTotal = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'pt' ? 
            (total * 5).toFixed(2) : parseFloat(total).toFixed(2);
        document.getElementById('cart-total-input').value = displayTotal;
        
        // Update currency symbol in label
        if (typeof getCurrencySymbol === 'function' && typeof t === 'function') {
            const totalLabel = document.querySelector('label[for="cart-total-input"]');
            if (totalLabel) {
                totalLabel.textContent = `${t('cart.total')} ${getCurrencySymbol()}`;
            }
        }
    } catch (error) {
        const errorMsg = typeof t === 'function' ? 
            t('messages.error_loading_cart') : 'Error loading cart:';
        document.getElementById('cart-items').innerHTML = 
            `<div class="error-msg">${errorMsg} ${error.message}</div>`;
    }
}

async function checkout() {
    try {
        // VULNERABILITY: Send client-supplied total (can be manipulated!)
        let total = document.getElementById('cart-total-input').value;
        
        // Convert back to USD if we're showing BRL
        if (typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'pt') {
            total = (parseFloat(total) / 5).toFixed(2); // Convert BRL back to USD for server
        }
        
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: total }) // Send client-supplied total - VULNERABLE!
        });
        const result = await response.json();
        if (response.ok) {
            currentOrderId = result.order_id;
            showResult('success-msg', `✅ ${result.message} (Order #${result.order_id})`, 'checkout-result');
            document.getElementById('order-info').style.display = 'block';
            
            // Format the total for display
            const displayTotal = typeof formatCurrency === 'function' ? 
                formatCurrency(parseFloat(result.total)) : `$${result.total}`;
            
            document.getElementById('order-details').innerHTML = 
                `Order #${result.order_id} - Total: ${displayTotal}`;
            loadCart();
        } else {
            const errorMsg = typeof t === 'function' ? 
                t('messages.checkout_error') : '❌ Checkout error:';
            showResult('error-msg', `${errorMsg} ${result.error}`, 'checkout-result');
        }
    } catch (error) {
        const errorMsg = typeof t === 'function' ? 
            t('messages.checkout_error') : '❌ Checkout error:';
        showResult('error-msg', `${errorMsg} ${error.message}`, 'checkout-result');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            loadCart();
            const successMsg = typeof t === 'function' ? 
                t('messages.cart_cleared') : '✅ Cart cleared!';
            showResult('success-msg', successMsg);
        } else {
            showResult('error-msg', '❌ ' + result.error);
        }
    } catch (error) {
        const errorMsg = typeof t === 'function' ? 
            t('messages.error_clearing_cart') : '❌ Error clearing cart:';
        showResult('error-msg', `${errorMsg} ${error.message}`);
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
