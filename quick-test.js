// Simple test to verify approved events endpoints
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const quickTest = async () => {
  try {
    console.log('🔍 Quick Backend Test...');

    // Test 1: Check if server is running
    const healthResponse = await fetch('http://localhost:5002/api/health');
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server health check failed');
      return;
    }

    // Test 2: Get approved events (public endpoint)
    const approvedResponse = await fetch('http://localhost:5002/api/events/approved');
    const approvedData = await approvedResponse.json();

    if (approvedResponse.ok) {
      console.log(`✅ Approved events endpoint working - Found ${approvedData.data?.length || 0} events`);
    } else {
      console.log('❌ Approved events endpoint failed');
    }

    // Test 3: Admin login
    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@eventwave.com',
        password: 'Admin123!'
      })
    });

    const loginData = await loginResponse.json();
    if (loginResponse.ok && loginData.success) {
      console.log('✅ Admin login working');

      // Test 4: Admin stats with auth
      const token = loginData.data.token;
      const statsResponse = await fetch('http://localhost:5002/api/events/admin/approved-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        console.log('✅ Admin authenticated endpoints working');
      } else {
        console.log('❌ Admin authenticated endpoints failed');
      }
    } else {
      console.log('❌ Admin login failed');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

quickTest();
