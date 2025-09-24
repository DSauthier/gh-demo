// Test script to verify normal checkout functionality works after security fix
const http = require('http');

console.log('🔍 Testing Normal Checkout Functionality...\n');

// Helper function to make HTTP requests
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testNormalCheckout() {
  const baseOptions = {
    hostname: 'localhost',
    port: 3000,
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    // 1. Clear cart
    console.log('1️⃣ Clearing cart...');
    await makeRequest({
      ...baseOptions,
      path: '/api/cart/clear',
      method: 'DELETE'
    });

    // 2. Add items to cart
    console.log('2️⃣ Adding items to cart...');
    await makeRequest({
      ...baseOptions,
      path: '/api/cart/add',
      method: 'POST'
    }, { product_id: 1, quantity: 1 });

    await makeRequest({
      ...baseOptions,
      path: '/api/cart/add',
      method: 'POST'
    }, { product_id: 3, quantity: 2 });

    // 3. Check cart
    console.log('3️⃣ Checking cart contents...');
    const cart = await makeRequest({
      ...baseOptions,
      path: '/api/cart',
      method: 'GET'
    });
    console.log('📦 Cart items:', cart.body.items?.length || 0);
    console.log('💰 Cart total:', cart.body.total);
    const expectedTotal = parseFloat(cart.body.total);

    // 4. Normal checkout (no total parameter)
    console.log('\n4️⃣ Processing normal checkout...');
    const checkout = await makeRequest({
      ...baseOptions,
      path: '/api/checkout',
      method: 'POST'
    }, {}); // Empty body - server calculates total

    if (checkout.statusCode === 200) {
      console.log('✅ Checkout successful:', checkout.body.message);
      console.log('📦 Order ID:', checkout.body.order_id);
      console.log('💰 Order total:', checkout.body.total);
      
      const orderTotal = parseFloat(checkout.body.total);
      if (Math.abs(orderTotal - expectedTotal) < 0.01) {
        console.log('✅ Order total matches cart total exactly');
        return true;
      } else {
        console.log('❌ Order total mismatch - Expected:', expectedTotal, 'Got:', orderTotal);
        return false;
      }
    } else {
      console.log('❌ Checkout failed:', checkout.body.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// 5. Test empty cart checkout
async function testEmptyCartCheckout() {
  const baseOptions = {
    hostname: 'localhost',
    port: 3000,
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    console.log('\n5️⃣ Testing empty cart checkout...');
    
    // Clear cart
    await makeRequest({
      ...baseOptions,
      path: '/api/cart/clear',
      method: 'DELETE'
    });

    // Try to checkout empty cart
    const checkout = await makeRequest({
      ...baseOptions,
      path: '/api/checkout',
      method: 'POST'
    }, {});

    if (checkout.statusCode === 400 && checkout.body.error === 'Cart is empty') {
      console.log('✅ Empty cart properly rejected:', checkout.body.error);
      return true;
    } else {
      console.log('❌ Empty cart should be rejected but was not');
      return false;
    }
  } catch (error) {
    console.error('❌ Empty cart test failed:', error.message);
    return false;
  }
}

// Run tests sequentially
testNormalCheckout().then(normalTest => {
  testEmptyCartCheckout().then(emptyTest => {
    if (normalTest && emptyTest) {
      console.log('\n✅ ALL TESTS PASSED:');
      console.log('- Normal checkout functionality works correctly');
      console.log('- Server calculates totals properly');
      console.log('- Empty cart validation works');
      console.log('- Security fix does not break legitimate usage');
    } else {
      console.log('\n❌ SOME TESTS FAILED - Check implementation');
    }
  });
});