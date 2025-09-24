// i18n.js - Internationalization support for the shopping cart demo

// Language definitions
const languages = {
    en: {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        translations: {
            // Header
            'app.title': 'Internal Team IT Hardware Store',
            'app.subtitle': 'Get your home office items - Add items and checkout!',
            'nav.view_orders': '📋 View Order History',
            
            // Products section
            'products.title': 'Products',
            'products.loading': 'Loading products...',
            'products.error': 'Error loading products: ',
            'products.add_to_cart': '➕ Add to Cart',
            'products.clear_cart': 'Clear Cart',
            'products.refresh': 'Refresh Products',
            
            // Cart section
            'cart.title': 'Your Cart',
            'cart.loading': 'Loading cart...',
            'cart.empty': '🛒 Your cart is empty',
            'cart.total': 'Total: $',
            'cart.checkout': 'Checkout',
            'cart.clear_success': '✅ Cart cleared!',
            'cart.clear_error': '❌ ',
            'cart.add_success': '✅ Added to cart!',
            'cart.add_error': '❌ Error adding to cart: ',
            'cart.checkout_success': '✅ Order placed successfully! Order ID: ',
            'cart.checkout_error': '❌ Error during checkout: ',
            
            // Orders page
            'orders.title': 'Order History',
            'orders.subtitle': 'View all orders and identify potential exploits',
            'orders.back_to_shop': '← Back to Shop',
            'orders.refresh': '🔄 Refresh Orders',
            'orders.all_orders': '📊 All Orders',
            'orders.no_orders': 'No orders found. Go to the ',
            'orders.no_orders_link': 'shop',
            'orders.no_orders_end': ' to create some orders!',
            'orders.error': 'Error loading orders: ',
            
            // Order stats
            'stats.total_orders': 'Total Orders',
            'stats.total_revenue': 'Total Revenue',
            'stats.suspicious_orders': 'Suspicious Orders',
            'stats.lost_revenue': 'Lost Revenue',
            
            // Order table headers
            'table.order_id': 'Order ID',
            'table.date': 'Date',
            'table.total_amount': 'Total Amount',
            'table.status': 'Status',
            
            // Order details
            'order.last_details': 'Last Order Details'
        }
    },
    pt: {
        code: 'pt',
        name: 'Português',
        flag: '🇧🇷',
        translations: {
            // Header
            'app.title': 'Loja de Hardware de TI da Equipe Interna',
            'app.subtitle': 'Obtenha seus itens de home office - Adicione itens e finalize a compra!',
            'nav.view_orders': '📋 Ver Histórico de Pedidos',
            
            // Products section
            'products.title': 'Produtos',
            'products.loading': 'Carregando produtos...',
            'products.error': 'Erro ao carregar produtos: ',
            'products.add_to_cart': '➕ Adicionar ao Carrinho',
            'products.clear_cart': 'Limpar Carrinho',
            'products.refresh': 'Atualizar Produtos',
            
            // Cart section
            'cart.title': 'Seu Carrinho',
            'cart.loading': 'Carregando carrinho...',
            'cart.empty': '🛒 Seu carrinho está vazio',
            'cart.total': 'Total: R$',
            'cart.checkout': 'Finalizar Compra',
            'cart.clear_success': '✅ Carrinho limpo!',
            'cart.clear_error': '❌ ',
            'cart.add_success': '✅ Adicionado ao carrinho!',
            'cart.add_error': '❌ Erro ao adicionar ao carrinho: ',
            'cart.checkout_success': '✅ Pedido realizado com sucesso! ID do Pedido: ',
            'cart.checkout_error': '❌ Erro durante o checkout: ',
            
            // Orders page
            'orders.title': 'Histórico de Pedidos',
            'orders.subtitle': 'Veja todos os pedidos e identifique possíveis explorações',
            'orders.back_to_shop': '← Voltar à Loja',
            'orders.refresh': '🔄 Atualizar Pedidos',
            'orders.all_orders': '📊 Todos os Pedidos',
            'orders.no_orders': 'Nenhum pedido encontrado. Vá para a ',
            'orders.no_orders_link': 'loja',
            'orders.no_orders_end': ' para criar alguns pedidos!',
            'orders.error': 'Erro ao carregar pedidos: ',
            
            // Order stats
            'stats.total_orders': 'Total de Pedidos',
            'stats.total_revenue': 'Receita Total',
            'stats.suspicious_orders': 'Pedidos Suspeitos',
            'stats.lost_revenue': 'Receita Perdida',
            
            // Order table headers
            'table.order_id': 'ID do Pedido',
            'table.date': 'Data',
            'table.total_amount': 'Valor Total',
            'table.status': 'Status',
            
            // Order details
            'order.last_details': 'Detalhes do Último Pedido'
        }
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize i18n system
function initI18n() {
    updatePageLanguage();
}

// Get translation for a key
function t(key) {
    const lang = languages[currentLanguage];
    if (lang && lang.translations[key]) {
        return lang.translations[key];
    }
    // Fallback to English if key not found
    const fallback = languages.en.translations[key];
    if (fallback) {
        return fallback;
    }
    // Return key if no translation found
    return key;
}

// Switch language
function switchLanguage(langCode) {
    if (languages[langCode]) {
        currentLanguage = langCode;
        localStorage.setItem('language', langCode);
        updatePageLanguage();
        
        // Reload dynamic content based on page
        if (typeof loadProducts === 'function') {
            loadProducts();
            loadCart();
        }
        if (typeof loadOrders === 'function') {
            loadOrders();
        }
    }
}

// Update page language
function updatePageLanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update language button states
    updateLanguageButtons();
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update all elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        element.innerHTML = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Update title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
    
    // Update page title
    if (document.title) {
        document.title = t('app.title');
    }
}

// Update language button states
function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.getElementById(`lang-${currentLanguage}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Get currency symbol based on language
function getCurrencySymbol() {
    return currentLanguage === 'pt' ? 'R$' : '$';
}

// Format currency based on language
function formatCurrency(amount) {
    const symbol = getCurrencySymbol();
    const value = parseFloat(amount).toFixed(2);
    return currentLanguage === 'pt' ? `${symbol}${value}` : `${symbol}${value}`;
}

// Expose functions globally
window.t = t;
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.getCurrencySymbol = getCurrencySymbol;
window.formatCurrency = formatCurrency;
window.initI18n = initI18n;
window.languages = languages;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}