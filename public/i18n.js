// i18n.js - Internationalization support for Portuguese/English

const translations = {
    en: {
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
        stats: {
            total_orders: 'Total Orders',
            total_revenue: 'Total Revenue',
            suspicious_orders: 'Suspicious Orders',
            lost_revenue: 'Lost Revenue'
        },
        table: {
            order_id: 'Order ID',
            date: 'Date',
            total_amount: 'Total Amount',
            status: 'Status'
        },
        shop: {
            title: 'Internal Team IT Hardware Store',
            subtitle: 'Get your home office items - Add items and checkout!',
            view_orders: '📋 View Order History',
            products_title: '🛍 Products',
            cart_title: '🛒 Your Cart',
            cart_empty: '🛒 Your cart is empty',
            total: 'Total',
            clear_cart: '🗑 Clear Cart',
            refresh_products: '🔄 Refresh Products',
            checkout: '💳 Checkout',
            add_to_cart: '➕ Add to Cart',
            last_order: '📦 Last Order Details',
            order_details: 'Order',
            success_added: '✅ Item added to cart!',
            success_cleared: '✅ Cart cleared!',
            success_checkout: '✅ Order placed successfully!'
        }
    },
    pt: {
        orders: {
            title: '📋 Histórico de Pedidos',
            subtitle: 'Visualizar todos os pedidos e identificar possíveis explorações',
            back_to_shop: '← Voltar para a Loja',
            refresh: '🔄 Atualizar Pedidos',
            all_orders: '📊 Todos os Pedidos',
            no_orders: 'Nenhum pedido encontrado. Vá para a ',
            no_orders_link: 'loja',
            no_orders_end: ' para criar alguns pedidos!'
        },
        stats: {
            total_orders: 'Total de Pedidos',
            total_revenue: 'Receita Total',
            suspicious_orders: 'Pedidos Suspeitos',
            lost_revenue: 'Receita Perdida'
        },
        table: {
            order_id: 'ID do Pedido',
            date: 'Data',
            total_amount: 'Valor Total',
            status: 'Status'
        },
        shop: {
            title: 'Loja de Hardware de TI da Equipe Interna',
            subtitle: 'Obtenha seus itens de home office - Adicione itens e finalize a compra!',
            view_orders: '📋 Ver Histórico de Pedidos',
            products_title: '🛍 Produtos',
            cart_title: '🛒 Seu Carrinho',
            cart_empty: '🛒 Seu carrinho está vazio',
            total: 'Total',
            clear_cart: '🗑 Limpar Carrinho',
            refresh_products: '🔄 Atualizar Produtos',
            checkout: '💳 Finalizar Compra',
            add_to_cart: '➕ Adicionar ao Carrinho',
            last_order: '📦 Detalhes do Último Pedido',
            order_details: 'Pedido',
            success_added: '✅ Item adicionado ao carrinho!',
            success_cleared: '✅ Carrinho limpo!',
            success_checkout: '✅ Pedido realizado com sucesso!'
        }
    }
};

// Currency conversion rate: 1 USD = 5 BRL
const USD_TO_BRL = 5;

// Get current language from localStorage or default to 'en'
let currentLanguage = localStorage.getItem('language') || 'en';

// Currency formatting
function formatCurrency(amount, language = currentLanguage) {
    const numAmount = parseFloat(amount);
    if (language === 'pt') {
        const brlAmount = numAmount * USD_TO_BRL;
        return `R$ ${brlAmount.toFixed(2)}`;
    }
    return `$${numAmount.toFixed(2)}`;
}

// Get translation
function translate(key, language = currentLanguage) {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || key;
}

// Apply translations to page
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translate(key);
    });
}

// Switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Apply translations
    applyTranslations();
    
    // Reload data to apply currency conversion
    if (typeof loadOrders === 'function') {
        loadOrders();
    }
    if (typeof loadCart === 'function') {
        loadCart();
    }
    if (typeof loadProducts === 'function') {
        loadProducts();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set active language button
    const langBtn = document.getElementById(`lang-${currentLanguage}`);
    if (langBtn) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        langBtn.classList.add('active');
    }
    
    // Apply translations
    applyTranslations();
});

// Export functions globally
window.switchLanguage = switchLanguage;
window.formatCurrency = formatCurrency;
window.translate = translate;
window.getCurrentLanguage = () => currentLanguage;
