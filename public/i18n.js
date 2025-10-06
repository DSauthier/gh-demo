// i18n.js - Internationalization and Currency Conversion

// Translation dictionary
const translations = {
    en: {
        // Main page
        'main.title': 'Internal Team IT Hardware Store',
        'main.subtitle': 'Get your home office items - Add items and checkout!',
        'main.view_orders': '📋 View Order History',
        'main.products': '🛍 Products',
        'main.loading_products': 'Loading products...',
        'main.clear_cart': '🗑 Clear Cart',
        'main.refresh_products': '🔄 Refresh Products',
        'main.cart': '🛒 Your Cart',
        'main.loading_cart': 'Loading cart...',
        'main.cart_empty': '🛒 Your cart is empty',
        'main.total': 'Total:',
        'main.checkout': '💳 Checkout',
        'main.last_order': '📦 Last Order Details',
        'main.add_to_cart': '➕ Add to Cart',
        'main.item_added': '✅ Item added to cart!',
        'main.cart_cleared': '✅ Cart cleared!',
        'main.order_success': '✅',
        'main.order_total': 'Order #',
        'main.error_loading_products': 'Error loading products:',
        'main.error_loading_cart': 'Error loading cart:',
        'main.error_checkout': '❌ Checkout error:',
        'main.error_clearing_cart': '❌ Error clearing cart:',
        'main.error_adding_item': '❌ Error adding item:',
        
        // Orders page
        'orders.title': '📋 Order History',
        'orders.subtitle': 'View all orders and identify potential exploits',
        'orders.back_to_shop': '← Back to Shop',
        'orders.refresh': '🔄 Refresh Orders',
        'orders.all_orders': '📊 All Orders',
        'orders.no_orders': 'No orders found. Go to the ',
        'orders.no_orders_link': 'shop',
        'orders.no_orders_end': ' to create some orders!',
        
        // Stats
        'stats.total_orders': 'Total Orders',
        'stats.total_revenue': 'Total Revenue',
        'stats.suspicious_orders': 'Suspicious Orders',
        'stats.lost_revenue': 'Lost Revenue',
        
        // Table
        'table.order_id': 'Order ID',
        'table.date': 'Date',
        'table.total_amount': 'Total Amount',
        'table.status': 'Status'
    },
    pt: {
        // Main page
        'main.title': 'Loja Interna de Hardware de TI',
        'main.subtitle': 'Obtenha seus itens de escritório doméstico - Adicione itens e finalize!',
        'main.view_orders': '📋 Ver Histórico de Pedidos',
        'main.products': '🛍 Produtos',
        'main.loading_products': 'Carregando produtos...',
        'main.clear_cart': '🗑 Limpar Carrinho',
        'main.refresh_products': '🔄 Atualizar Produtos',
        'main.cart': '🛒 Seu Carrinho',
        'main.loading_cart': 'Carregando carrinho...',
        'main.cart_empty': '🛒 Seu carrinho está vazio',
        'main.total': 'Total:',
        'main.checkout': '💳 Finalizar Compra',
        'main.last_order': '📦 Detalhes do Último Pedido',
        'main.add_to_cart': '➕ Adicionar ao Carrinho',
        'main.item_added': '✅ Item adicionado ao carrinho!',
        'main.cart_cleared': '✅ Carrinho limpo!',
        'main.order_success': '✅',
        'main.order_total': 'Pedido #',
        'main.error_loading_products': 'Erro ao carregar produtos:',
        'main.error_loading_cart': 'Erro ao carregar carrinho:',
        'main.error_checkout': '❌ Erro ao finalizar compra:',
        'main.error_clearing_cart': '❌ Erro ao limpar carrinho:',
        'main.error_adding_item': '❌ Erro ao adicionar item:',
        
        // Orders page
        'orders.title': '📋 Histórico de Pedidos',
        'orders.subtitle': 'Visualize todos os pedidos e identifique possíveis explorações',
        'orders.back_to_shop': '← Voltar para a Loja',
        'orders.refresh': '🔄 Atualizar Pedidos',
        'orders.all_orders': '📊 Todos os Pedidos',
        'orders.no_orders': 'Nenhum pedido encontrado. Vá para a ',
        'orders.no_orders_link': 'loja',
        'orders.no_orders_end': ' para criar alguns pedidos!',
        
        // Stats
        'stats.total_orders': 'Total de Pedidos',
        'stats.total_revenue': 'Receita Total',
        'stats.suspicious_orders': 'Pedidos Suspeitos',
        'stats.lost_revenue': 'Receita Perdida',
        
        // Table
        'table.order_id': 'ID do Pedido',
        'table.date': 'Data',
        'table.total_amount': 'Valor Total',
        'table.status': 'Status'
    }
};

// Currency conversion rates (1 USD = 5 BRL)
const currencyRates = {
    en: { rate: 1, symbol: '$', code: 'USD' },
    pt: { rate: 5, symbol: 'R$', code: 'BRL' }
};

// Current language (default to English)
let currentLanguage = localStorage.getItem('language') || 'en';

// Get translation for a key
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Format currency based on current language
function formatCurrency(amount) {
    const currency = currencyRates[currentLanguage];
    const convertedAmount = amount * currency.rate;
    return `${currency.symbol}${convertedAmount.toFixed(2)}`;
}

// Get currency rate
function getCurrencyRate() {
    return currencyRates[currentLanguage].rate;
}

// Get currency symbol
function getCurrencySymbol() {
    return currencyRates[currentLanguage].symbol;
}

// Switch language
function switchLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`lang-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update all translated elements
    updatePageTranslations();
    
    // Trigger custom event for pages to refresh their content
    window.dispatchEvent(new Event('languageChanged'));
}

// Update all elements with data-i18n attribute
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        if (translation !== key) {
            element.textContent = translation;
        }
    });
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    const savedLang = localStorage.getItem('language') || 'en';
    if (savedLang !== 'en') {
        switchLanguage(savedLang);
    } else {
        updatePageTranslations();
    }
});

// Export functions for use in other scripts
window.t = t;
window.formatCurrency = formatCurrency;
window.getCurrencyRate = getCurrencyRate;
window.getCurrencySymbol = getCurrencySymbol;
window.switchLanguage = switchLanguage;
