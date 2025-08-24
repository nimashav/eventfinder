const axios = require('axios');

const API_URL = 'http://localhost:5002/api';

async function testDetailedRegistration() {
  console.log('🔍 Testing detailed registration flow...\n');

  // Test 1: Basic valid registration
  console.log('Test 1: Valid registration with all required fields');
  const validUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${Date.now()}@example.com`,
    password: 'Password123',
    confirmPassword: 'Password123',
    phone: '1234567890'
  };

  try {
    console.log('📤 Sending request:', JSON.stringify(validUser, null, 2));
    const response = await axios.post(`${API_URL}/auth/register`, validUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Registration without phone (optional field)
  console.log('Test 2: Valid registration without phone');
  const userWithoutPhone = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: `jane.smith.${Date.now()}@example.com`,
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123'
  };

  try {
    console.log('📤 Sending request:', JSON.stringify(userWithoutPhone, null, 2));
    const response = await axios.post(`${API_URL}/auth/register`, userWithoutPhone, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Test various invalid scenarios
  console.log('Test 3: Invalid scenarios');

  const invalidTests = [
    {
      name: 'Missing uppercase in password',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test1.${Date.now()}@example.com`,
        password: 'password123',
        confirmPassword: 'password123'
      }
    },
    {
      name: 'Missing number in password',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test2.${Date.now()}@example.com`,
        password: 'Password',
        confirmPassword: 'Password'
      }
    },
    {
      name: 'Password mismatch',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test3.${Date.now()}@example.com`,
        password: 'Password123',
        confirmPassword: 'Password456'
      }
    },
    {
      name: 'Invalid email format',
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123'
      }
    }
  ];

  for (const test of invalidTests) {
    console.log(`\nTesting: ${test.name}`);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, test.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('⚠️ Unexpected success:', response.data);
    } catch (error) {
      console.log('✅ Correctly rejected:', error.response?.data?.message);
      if (error.response?.data?.errors) {
        console.log('   Validation errors:', error.response.data.errors);
      }
    }
  }
}

async function testServerConnection() {
  console.log('🌐 Testing server connection...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Server is running:', response.data);
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error config:', error.config?.url);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive registration tests...\n');

  await testServerConnection();
  console.log('\n' + '='.repeat(50) + '\n');

  await testDetailedRegistration();

  console.log('\n✅ All tests completed!');
}

runAllTests();
