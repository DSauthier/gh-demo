// i18n.js - Internationalization system with currency conversion

// Currency conversion rate: 1 USD = 5 BRL
const EXCHANGE_RATE = 5;

// Language translations
const translations = {
  en: {
    // Main page translations
    'main.title': 'Internal Team IT Hardware Store',
    'main.subtitle': 'Get your home office items - Add items and checkout!',
    'main.view_orders': '📋 View Order History',
    'main.products_section': '🛍 Products',
    'main.loading_products': 'Loading products...',
    'main.clear_cart': '🗑 Clear Cart',
    'main.refresh_products': '🔄 Refresh Products',
    'main.cart_section': '🛒 Your Cart',
    'main.loading_cart': 'Loading cart...',
    'main.cart_empty': '🛒 Your cart is empty',
    'main.total': 'Total',
    'main.checkout': '💳 Checkout',
    'main.last_order': '📦 Last Order Details',
    'main.add_to_cart': '➕ Add to Cart',

    // Orders page translations
    'orders.title': '📋 Order History',
    'orders.subtitle': 'View all orders and identify potential exploits',
    'orders.back_to_shop': '← Back to Shop',
    'orders.refresh': '🔄 Refresh Orders',

    // Stats translations
    'stats.total_orders': 'Total Orders',
    'stats.total_revenue': 'Total Revenue',
    'stats.suspicious_orders': 'Suspicious Orders',
    'stats.lost_revenue': 'Lost Revenue',

    // Table headers
    'table.order_id': 'Order ID',
    'table.date': 'Date',
    'table.amount': 'Amount',
    'table.total_amount': 'Total Amount',
    'table.status': 'Status',

    // Orders page specific
    'orders.all_orders': '📊 All Orders',
    'orders.no_orders': 'No orders found. Go to the ',
    'orders.no_orders_link': 'shop',
    'orders.no_orders_end': ' to create some orders!',

    // Messages
    'msg.cart_cleared': '✅ Cart cleared!',
    'msg.checkout_error': '❌ Checkout error',
    'msg.loading_error': 'Error loading',
    'msg.no_orders': 'No orders found. Go to the shop to create some orders!',

    // Currency
    'currency.symbol': '$',
    'currency.code': 'USD'
  },
  pt: {
    // Main page translations
    'main.title': 'Loja de Hardware de TI da Equipe Interna',
    'main.subtitle': 'Obtenha seus itens de home office - Adicione itens e finalize a compra!',
    'main.view_orders': '📋 Ver Histórico de Pedidos',
    'main.products_section': '🛍 Produtos',
    'main.loading_products': 'Carregando produtos...',
    'main.clear_cart': '🗑 Limpar Carrinho',
    'main.refresh_products': '🔄 Atualizar Produtos',
    'main.cart_section': '🛒 Seu Carrinho',
    'main.loading_cart': 'Carregando carrinho...',
    'main.cart_empty': '🛒 Seu carrinho está vazio',
    'main.total': 'Total',
    'main.checkout': '💳 Finalizar Compra',
    'main.last_order': '📦 Detalhes do Último Pedido',
    'main.add_to_cart': '➕ Adicionar ao Carrinho',

    // Orders page translations
    'orders.title': '📋 Histórico de Pedidos',
    'orders.subtitle': 'Visualizar todos os pedidos e identificar possíveis explorações',
    'orders.back_to_shop': '← Voltar à Loja',
    'orders.refresh': '🔄 Atualizar Pedidos',

    // Stats translations
    'stats.total_orders': 'Total de Pedidos',
    'stats.total_revenue': 'Receita Total',
    'stats.suspicious_orders': 'Pedidos Suspeitos',
    'stats.lost_revenue': 'Receita Perdida',

    // Table headers
    'table.order_id': 'ID do Pedido',
    'table.date': 'Data',
    'table.amount': 'Valor',
    'table.total_amount': 'Valor Total',
    'table.status': 'Status',

    // Orders page specific
    'orders.all_orders': '📊 Todos os Pedidos',
    'orders.no_orders': 'Nenhum pedido encontrado. Vá para a ',
    'orders.no_orders_link': 'loja',
    'orders.no_orders_end': ' para criar alguns pedidos!',

    // Messages
    'msg.cart_cleared': '✅ Carrinho limpo!',
    'msg.checkout_error': '❌ Erro na finalização',
    'msg.loading_error': 'Erro ao carregar',
    'msg.no_orders': 'Nenhum pedido encontrado. Vá para a loja para criar alguns pedidos!',

    // Currency
    'currency.symbol': 'R$',
    'currency.code': 'BRL'
  }
};

// Current language (default: English)
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize i18n system when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Apply saved language
  switchLanguage(currentLanguage);
});

// Switch language function
function switchLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not supported, falling back to English`);
    lang = 'en';
  }

  currentLanguage = lang;
  localStorage.setItem('language', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = translations[lang][key];
    if (translation) {
      element.textContent = translation;
    }
  });

  // Update language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`lang-${lang}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Refresh displayed prices and totals if on main page
  if (window.loadProducts && typeof window.loadProducts === 'function') {
    setTimeout(() => {
      window.loadProducts();
      if (window.loadCart && typeof window.loadCart === 'function') {
        window.loadCart();
      }
    }, 100);
  }

  // Refresh orders page if on orders page
  if (window.loadOrders && typeof window.loadOrders === 'function') {
    setTimeout(() => {
      window.loadOrders();
    }, 100);
  }
}

// Get translation function
function t(key, fallback = key) {
  return translations[currentLanguage][key] || fallback;
}

// Format currency based on current language
function formatCurrency(amountInUSD) {
  const amount = currentLanguage === 'pt' ? amountInUSD * EXCHANGE_RATE : amountInUSD;
  const symbol = translations[currentLanguage]['currency.symbol'];
  return `${symbol}${amount.toFixed(2)}`;
}

// Convert currency for display
function convertAmount(usdAmount) {
  return currentLanguage === 'pt' ? usdAmount * EXCHANGE_RATE : usdAmount;
}

// Get current currency info
function getCurrencyInfo() {
  return {
    symbol: translations[currentLanguage]['currency.symbol'],
    code: translations[currentLanguage]['currency.code'],
    rate: currentLanguage === 'pt' ? EXCHANGE_RATE : 1
  };
}

// Make functions available globally
window.switchLanguage = switchLanguage;
window.t = t;
window.formatCurrency = formatCurrency;
window.convertAmount = convertAmount;
window.getCurrencyInfo = getCurrencyInfo;
window.currentLanguage = () => currentLanguage;