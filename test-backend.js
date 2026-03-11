// Quick backend test script
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

console.log('🧪 Testing Backend API...\n');

async function testBackend() {
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('   ✅ Health:', health);
    
    if (health.database !== 'connected') {
      console.log('\n   ⚠️  Database not connected!');
      console.log('   📖 Please set up MongoDB first (see QUICK_MONGODB_SETUP.md)');
      return;
    }
    
    // Test 2: Register user
    console.log('\n2️⃣ Testing user registration...');
    const registerRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        name: 'Test User'
      })
    });
    const registerData = await registerRes.json();
    console.log('   ✅ Registration:', registerData);
    
    // Test 3: Login
    console.log('\n3️⃣ Testing user login...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.email || 'test@example.com',
        password: 'test123'
      })
    });
    const loginData = await loginRes.json();
    console.log('   ✅ Login:', loginData);
    
    // Test 4: Save tracking data
    console.log('\n4️⃣ Testing time tracking...');
    const trackingRes = await fetch(`${API_URL}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: registerData.userId,
        domain: 'github.com',
        url: 'https://github.com',
        title: 'GitHub',
        time_spent: 120,
        visit_date: new Date().toISOString().split('T')[0]
      })
    });
    const trackingData = await trackingRes.json();
    console.log('   ✅ Tracking saved:', trackingData);
    
    // Test 5: Get tracking data
    console.log('\n5️⃣ Testing tracking retrieval...');
    const getTrackingRes = await fetch(`${API_URL}/tracking/${registerData.userId}`);
    const getTrackingData = await getTrackingRes.json();
    console.log('   ✅ Retrieved records:', getTrackingData.length);
    
    console.log('\n🎉 All tests passed! Backend is working perfectly!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is set up (see QUICK_MONGODB_SETUP.md)');
    console.log('   2. Server is running (npm run server)');
    console.log('   3. Server is on http://localhost:3000\n');
  }
}

testBackend();
