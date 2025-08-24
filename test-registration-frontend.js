// Quick registration test script
const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration endpoint...');
    
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
      phone: '1234567890'
    };

    console.log('📤 Sending registration request...');
    console.log('Request data:', testUser);

    const response = await axios.post('http://localhost:5002/api/auth/register', testUser);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testRegistration();
