// filepath: app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(bodyParser.json());
app.use(express.static('public'));

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Add item to cart
app.post('/api/cart/add', (req, res) => {
  const { product_id, quantity } = req.body;
  
  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }

  db.run(
    "INSERT INTO cart (product_id, quantity) VALUES (?, ?)",
    [product_id, quantity],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add to cart' });
      }
      res.json({ message: 'Item added to cart', cart_id: this.lastID });
    }
  );
});

// Get cart contents
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT c.id, c.quantity, p.name, p.price, (c.quantity * p.price) as subtotal
    FROM cart c
    JOIN products p ON c.product_id = p.id
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const total = rows.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: rows, total: total.toFixed(2) });
  });
});

// Create order (checkout) - SECURE: Server-side total calculation
app.post('/api/checkout', (req, res) => {
  // SECURITY FIX: Calculate total server-side from cart items, ignore any client-supplied total
  
  // Get cart items with prices for server-side total calculation
  const cartQuery = `
    SELECT c.quantity, p.price, p.id as product_id, p.name
    FROM cart c
    JOIN products p ON c.product_id = p.id
  `;
  
  db.all(cartQuery, (err, cartItems) => {
    if (err) {
      console.error('Database error during checkout:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Business rule validation: Reject empty carts
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // SECURITY: Calculate total server-side only - never trust client data
    const serverCalculatedTotal = cartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    // Business rule validation: Reject orders with zero or negative totals
    if (serverCalculatedTotal <= 0) {
      console.warn('Suspicious order attempt: Zero or negative total detected', {
        cartItems: cartItems,
        calculatedTotal: serverCalculatedTotal,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ error: 'Invalid order total' });
    }
    
    // Additional validation: Ensure all prices are positive
    const hasInvalidPrices = cartItems.some(item => item.price <= 0 || item.quantity <= 0);
    if (hasInvalidPrices) {
      console.warn('Suspicious order attempt: Invalid product prices or quantities', {
        cartItems: cartItems,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ error: 'Invalid product data' });
    }

    // Create order with SERVER-CALCULATED total (secure)
    db.run(
      "INSERT INTO orders (total_amount, status) VALUES (?, 'completed')",
      [serverCalculatedTotal],
      function(err) {
        if (err) {
          console.error('Failed to create order:', err);
          return res.status(500).json({ error: 'Failed to create order' });
        }
        
        const orderId = this.lastID;
        
        // Security logging: Log successful order creation
        console.log('Order created successfully:', {
          orderId: orderId,
          serverCalculatedTotal: serverCalculatedTotal.toFixed(2),
          itemCount: cartItems.length,
          timestamp: new Date().toISOString()
        });
        
        // Clear cart after successful checkout
        db.run("DELETE FROM cart", (err) => {
          if (err) {
            console.error('Error clearing cart:', err);
          }
        });
        
        res.json({ 
          message: 'Order created successfully', 
          order_id: orderId,
          total: serverCalculatedTotal.toFixed(2)
        });
      }
    );
  });
});

// VULNERABLE: Process refund without proper validation
app.post('/api/refund', (req, res) => {
  const { order_id, refund_amount } = req.body;
  
  if (!order_id || refund_amount === undefined) {
    return res.status(400).json({ error: 'Order ID and refund amount required' });
  }
  
  // VULNERABILITY: No validation on refund amount
  // Users can input negative values to get money instead of refunding
  
  db.get("SELECT * FROM orders WHERE id = ?", [order_id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // CRITICAL BUG: No check if refund_amount is negative
    // A negative refund_amount will actually add money to customer account
    const newTotal = order.total_amount - refund_amount;
    
    db.run(
      "UPDATE orders SET total_amount = ?, status = 'refunded' WHERE id = ?",
      [newTotal, order_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to process refund' });
        }
        
        // This message reveals the vulnerability when negative amounts are used
        res.json({ 
          message: `Refund processed successfully. New order total: $${newTotal.toFixed(2)}`,
          refunded_amount: refund_amount,
          new_total: newTotal.toFixed(2)
        });
      }
    );
  });
});

// Get order details
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  
  db.get("SELECT * FROM orders WHERE id = ?", [orderId], (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  });
});

// Clear cart (for demo reset)
app.delete('/api/cart/clear', (req, res) => {
  db.run("DELETE FROM cart", (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to clear cart' });
    }
    res.json({ message: 'Cart cleared' });
  });
});

// Get all orders (for order history page)
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🛒 Shopping cart server running at http://${HOST}:${PORT}`);
  console.log(`🔥 VULNERABLE VERSION - Refund system has security issues!`);
  console.log(`🎯 Try: Add items to cart, checkout, then request refund with NEGATIVE amount`);
});