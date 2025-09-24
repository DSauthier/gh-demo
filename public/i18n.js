// Internationalization system for the shopping cart demo
// Supports English (en) and Portuguese (pt) with currency conversion

const translations = {
    en: {
        // Common elements
        currency_symbol: '$',
        currency_code: 'USD',
        
        // Main page (index.html)
        main: {
            title: 'Internal Team IT Hardware Store',
            subtitle: 'Get your home office items - Add items and checkout!',
            view_order_history: '📋 View Order History'
        },
        
        // Products section
        products: {
            title: '🛍 Products',
            loading: 'Loading products...',
            add_to_cart: '➕ Add to Cart',
            clear_cart: '🗑 Clear Cart',
            refresh_products: '🔄 Refresh Products'
        },
        
        // Cart section
        cart: {
            title: '🛒 Your Cart',
            loading: 'Loading cart...',
            empty: '🛒 Your cart is empty',
            total: 'Total:',
            checkout: '💳 Checkout',
            last_order: '📦 Last Order Details'
        },
        
        // Orders page
        orders: {
            title: '📋 Order History',
            subtitle: 'View all orders and identify potential exploits',
            back_to_shop: '← Back to Shop',
            refresh: '🔄 Refresh Orders',
            all_orders: '📊 All Orders',
            no_orders: 'No orders found. Go to the ',
            no_orders_link: 'shop',
            no_orders_end: ' to create some orders!'
        },
        
        // Statistics
        stats: {
            total_orders: 'Total Orders',
            total_revenue: 'Total Revenue',
            suspicious_orders: 'Suspicious Orders',
            lost_revenue: 'Lost Revenue'
        },
        
        // Table headers
        table: {
            order_id: 'Order ID',
            date: 'Date',
            total_amount: 'Total Amount',
            status: 'Status'
        },
        
        // Messages
        messages: {
            cart_cleared: '✅ Cart cleared!',
            checkout_error: '❌ Checkout error:',
            error_loading_products: 'Error loading products:',
            error_loading_cart: 'Error loading cart:',
            error_loading_orders: 'Error loading orders:',
            error_clearing_cart: '❌ Error clearing cart:'
        }
    },
    
    pt: {
        // Common elements
        currency_symbol: 'R$',
        currency_code: 'BRL',
        
        // Main page (index.html)
        main: {
            title: 'Loja Interna de Hardware de TI da Equipe',
            subtitle: 'Obtenha seus itens de home office - Adicione itens e finalize a compra!',
            view_order_history: '📋 Ver Histórico de Pedidos'
        },
        
        // Products section
        products: {
            title: '🛍 Produtos',
            loading: 'Carregando produtos...',
            add_to_cart: '➕ Adicionar ao Carrinho',
            clear_cart: '🗑 Limpar Carrinho',
            refresh_products: '🔄 Atualizar Produtos'
        },
        
        // Cart section
        cart: {
            title: '🛒 Seu Carrinho',
            loading: 'Carregando carrinho...',
            empty: '🛒 Seu carrinho está vazio',
            total: 'Total:',
            checkout: '💳 Finalizar Compra',
            last_order: '📦 Detalhes do Último Pedido'
        },
        
        // Orders page
        orders: {
            title: '📋 Histórico de Pedidos',
            subtitle: 'Visualize todos os pedidos e identifique possíveis explorações',
            back_to_shop: '← Voltar à Loja',
            refresh: '🔄 Atualizar Pedidos',
            all_orders: '📊 Todos os Pedidos',
            no_orders: 'Nenhum pedido encontrado. Vá para a ',
            no_orders_link: 'loja',
            no_orders_end: ' para criar alguns pedidos!'
        },
        
        // Statistics
        stats: {
            total_orders: 'Total de Pedidos',
            total_revenue: 'Receita Total',
            suspicious_orders: 'Pedidos Suspeitos',
            lost_revenue: 'Receita Perdida'
        },
        
        // Table headers
        table: {
            order_id: 'ID do Pedido',
            date: 'Data',
            total_amount: 'Valor Total',
            status: 'Status'
        },
        
        // Messages
        messages: {
            cart_cleared: '✅ Carrinho limpo!',
            checkout_error: '❌ Erro no checkout:',
            error_loading_products: 'Erro ao carregar produtos:',
            error_loading_cart: 'Erro ao carregar carrinho:',
            error_loading_orders: 'Erro ao carregar pedidos:',
            error_clearing_cart: '❌ Erro ao limpar carrinho:'
        }
    }
};

// Currency conversion rate: 1 USD = 5 BRL
const EXCHANGE_RATE = 5;

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize internationalization
function initI18n() {
    // Apply saved language
    switchLanguage(currentLanguage, false);
}

// Switch language function
function switchLanguage(lang, save = true) {
    if (!translations[lang]) {
        console.warn(`Language "${lang}" not supported`);
        return;
    }
    
    currentLanguage = lang;
    
    if (save) {
        localStorage.setItem('language', lang);
    }
    
    // Update language button states
    updateLanguageButtons(lang);
    
    // Apply translations to all elements with data-i18n attribute
    applyTranslations(lang);
    
    // Update currency displays
    updateCurrencyDisplays(lang);
    
    // Update document language
    document.documentElement.lang = lang;
}

// Update language button active states
function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`lang-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Apply translations to elements with data-i18n attribute
function applyTranslations(lang) {
    const langData = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(langData, key);
        
        if (translation) {
            element.textContent = translation;
        }
    });
}

// Get nested translation from key path (e.g., 'orders.title')
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] ? current[key] : null;
    }, obj);
}

// Format currency based on current language
function formatCurrency(amount, lang = currentLanguage) {
    const langData = translations[lang];
    const symbol = langData.currency_symbol;
    
    // Convert currency if needed
    let convertedAmount = amount;
    if (lang === 'pt') {
        convertedAmount = amount * EXCHANGE_RATE;
    }
    
    return `${symbol}${convertedAmount.toFixed(2)}`;
}

// Update all currency displays on the page
function updateCurrencyDisplays(lang) {
    // Update cart total
    const cartTotalInput = document.getElementById('cart-total-input');
    if (cartTotalInput && cartTotalInput.value) {
        const originalAmount = parseFloat(cartTotalInput.value);
        if (!isNaN(originalAmount)) {
            cartTotalInput.value = lang === 'pt' ? (originalAmount * EXCHANGE_RATE).toFixed(2) : originalAmount.toFixed(2);
        }
    }
    
    // Update currency symbol in labels
    const totalLabel = document.querySelector('label[for="cart-total-input"]');
    if (totalLabel) {
        const langData = translations[lang];
        totalLabel.textContent = `${getNestedTranslation(langData, 'cart.total')} ${langData.currency_symbol}`;
    }
    
    // Trigger refresh of dynamic content
    if (typeof loadCart === 'function') {
        setTimeout(loadCart, 100);
    }
    
    if (typeof loadOrders === 'function') {
        setTimeout(loadOrders, 100);
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Get current currency symbol
function getCurrencySymbol() {
    return translations[currentLanguage].currency_symbol;
}

// Get translation for a key
function t(key) {
    return getNestedTranslation(translations[currentLanguage], key) || key;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initI18n);

// Export functions for global use
window.switchLanguage = switchLanguage;
window.formatCurrency = formatCurrency;
window.getCurrentLanguage = getCurrentLanguage;
window.getCurrencySymbol = getCurrencySymbol;
window.t = t;