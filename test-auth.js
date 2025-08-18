const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test registration endpoint
    console.log('2. Testing registration endpoint...');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123!',
      phone: '1234567890'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data);
      console.log('');

      // Test login endpoint
      console.log('3. Testing login endpoint...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data);
      console.log('');

      // Test protected route
      console.log('4. Testing protected route...');
      const token = loginResponse.data.token;
      const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Profile fetch successful:', profileResponse.data);
      console.log('');

    } catch (authError) {
      console.log('❌ Auth error:', authError.response?.data || authError.message);
    }

  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('Make sure the server is running on http://localhost:5001');
  }
}

testAuthEndpoints();
