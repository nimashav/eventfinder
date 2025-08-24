const axios = require('axios');

const API_URL = 'http://localhost:5002/api';

async function testRegistration() {
  console.log('🧪 Testing user registration...');

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser' + Date.now() + '@example.com',
    password: 'TestPassword123',
    confirmPassword: 'TestPassword123',
    phone: '1234567890'
  };

  try {
    console.log('📤 Sending registration request...');
    console.log('User data:', testUser);

    const response = await axios.post(`${API_URL}/auth/register`, testUser);

    console.log('✅ Registration successful!');
    console.log('Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ Registration failed!');
    console.error('Error:', error.response?.data || error.message);

    return null;
  }
}

// Test with invalid password (missing requirements)
async function testInvalidPassword() {
  console.log('\n🧪 Testing registration with invalid password...');

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser' + Date.now() + '@example.com',
    password: 'weakpass', // Missing uppercase and number
    confirmPassword: 'weakpass',
    phone: '1234567890'
  };

  try {
    console.log('📤 Sending registration request with weak password...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('⚠️ Unexpected success with weak password:', response.data);
  } catch (error) {
    console.log('✅ Correctly rejected weak password');
    console.log('Error details:', error.response?.data);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting registration tests...\n');

  // Test 1: Valid registration
  await testRegistration();

  // Test 2: Invalid password
  await testInvalidPassword();

  console.log('\n✅ Tests completed!');
}

runTests();
