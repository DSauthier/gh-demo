// i18n.js - Internationalization support with currency conversion
// 1 USD = 5 BRL conversion rate

const translations = {
    en: {
        // Index page
        shop: {
            title: "Internal Team IT Hardware Store",
            subtitle: "Get your home office items - Add items and checkout!",
            view_orders: "📋 View Order History",
            products_title: "🛍 Products",
            clear_cart: "🗑 Clear Cart",
            refresh_products: "🔄 Refresh Products",
            your_cart: "🛒 Your Cart",
            cart_empty: "🛒 Your cart is empty",
            total: "Total:",
            checkout: "💳 Checkout",
            last_order: "📦 Last Order Details",
            add_to_cart: "➕ Add to Cart",
            item_added: "✅ Item added to cart!",
            cart_cleared: "✅ Cart cleared!",
            checkout_success: "✅ Order placed successfully!",
            checkout_error: "❌ Checkout error:",
            error_loading: "Error loading",
            order_total: "Order #${id} - Total: ${total}"
        },
        // Orders page
        orders: {
            title: "📋 Order History",
            subtitle: "View all orders and identify potential exploits",
            back_to_shop: "← Back to Shop",
            refresh: "🔄 Refresh Orders",
            all_orders: "📊 All Orders",
            no_orders: "No orders found. Go to the ",
            no_orders_link: "shop",
            no_orders_end: " to create some orders!"
        },
        // Stats cards
        stats: {
            total_orders: "Total Orders",
            total_revenue: "Total Revenue",
            suspicious_orders: "Suspicious Orders",
            lost_revenue: "Lost Revenue"
        },
        // Table headers
        table: {
            order_id: "Order ID",
            date: "Date",
            total_amount: "Total Amount",
            status: "Status"
        },
        currency: {
            symbol: "$",
            code: "USD"
        }
    },
    pt: {
        // Index page
        shop: {
            title: "Loja de Hardware de TI da Equipe Interna",
            subtitle: "Obtenha seus itens de home office - Adicione itens e finalize a compra!",
            view_orders: "📋 Ver Histórico de Pedidos",
            products_title: "🛍 Produtos",
            clear_cart: "🗑 Limpar Carrinho",
            refresh_products: "🔄 Atualizar Produtos",
            your_cart: "🛒 Seu Carrinho",
            cart_empty: "🛒 Seu carrinho está vazio",
            total: "Total:",
            checkout: "💳 Finalizar Compra",
            last_order: "📦 Detalhes do Último Pedido",
            add_to_cart: "➕ Adicionar ao Carrinho",
            item_added: "✅ Item adicionado ao carrinho!",
            cart_cleared: "✅ Carrinho limpo!",
            checkout_success: "✅ Pedido realizado com sucesso!",
            checkout_error: "❌ Erro ao finalizar:",
            error_loading: "Erro ao carregar",
            order_total: "Pedido #${id} - Total: ${total}"
        },
        // Orders page
        orders: {
            title: "📋 Histórico de Pedidos",
            subtitle: "Visualize todos os pedidos e identifique possíveis explorações",
            back_to_shop: "← Voltar para a Loja",
            refresh: "🔄 Atualizar Pedidos",
            all_orders: "📊 Todos os Pedidos",
            no_orders: "Nenhum pedido encontrado. Vá para a ",
            no_orders_link: "loja",
            no_orders_end: " para criar alguns pedidos!"
        },
        // Stats cards
        stats: {
            total_orders: "Total de Pedidos",
            total_revenue: "Receita Total",
            suspicious_orders: "Pedidos Suspeitos",
            lost_revenue: "Receita Perdida"
        },
        // Table headers
        table: {
            order_id: "ID do Pedido",
            date: "Data",
            total_amount: "Valor Total",
            status: "Status"
        },
        currency: {
            symbol: "R$",
            code: "BRL"
        }
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Currency conversion rate: 1 USD = 5 BRL
const EXCHANGE_RATE = 5;

// Get translation for a key
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
        value = value[k];
        if (!value) return key;
    }
    return value;
}

// Format currency based on current language
function formatCurrency(amount, includeSymbol = true) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return amount;
    
    if (currentLanguage === 'pt') {
        // Convert USD to BRL (1 USD = 5 BRL)
        const convertedAmount = numAmount * EXCHANGE_RATE;
        const formatted = convertedAmount.toFixed(2);
        return includeSymbol ? `R$ ${formatted}` : formatted;
    } else {
        const formatted = numAmount.toFixed(2);
        return includeSymbol ? `$${formatted}` : formatted;
    }
}

// Get currency symbol
function getCurrencySymbol() {
    return t('currency.symbol');
}

// Update all elements with data-i18n attribute
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
}

// Switch language
function switchLanguage(lang) {
    if (lang === currentLanguage) return;
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update button active states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update translations
    updateTranslations();
    
    // Reload data to show with new currency
    if (typeof loadOrders === 'function') {
        loadOrders();
    }
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
    if (typeof loadCart === 'function') {
        loadCart();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set active language button
    const langBtn = document.getElementById(`lang-${currentLanguage}`);
    if (langBtn) {
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        langBtn.classList.add('active');
    }
    
    // Update translations
    updateTranslations();
});

// Export functions to global scope
window.switchLanguage = switchLanguage;
window.formatCurrency = formatCurrency;
window.getCurrencySymbol = getCurrencySymbol;
window.t = t;
