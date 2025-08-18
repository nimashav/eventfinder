// Frontend-Backend Integration Test
console.log('🧪 Testing Frontend-Backend Integration...\n');

// Test data
const testEmail = `frontendtest${Date.now()}@example.com`;
const testPassword = 'TestPass123!';

const testData = {
  firstName: 'Frontend',
  lastName: 'User',
  email: testEmail,
  password: testPassword,
  confirmPassword: testPassword,
  phone: '9876543210'
};

// Test Registration
async function testRegistration() {
  console.log('📝 Testing Registration...');

  try {
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Registration successful!');
      console.log(`   User: ${data.data.user.fullName}`);
      console.log(`   Email: ${data.data.user.email}`);
      console.log(`   Role: ${data.data.user.role}`);
      return { success: true, user: data.data.user };
    } else {
      console.log('❌ Registration failed:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Registration network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Login
async function testLogin(email, password) {
  console.log('\n🔐 Testing Login...');

  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Login successful!');
      console.log(`   User: ${data.data.user.fullName}`);
      console.log(`   Token: ${data.data.token ? 'Generated' : 'Missing'}`);
      return { success: true, token: data.data.token, user: data.data.user };
    } else {
      console.log('❌ Login failed:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Login network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test Protected Route
async function testProtectedRoute(token) {
  console.log('\n🔒 Testing Protected Route...');

  try {
    const response = await fetch('http://localhost:5001/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Protected route access successful!');
      console.log(`   User: ${data.data.user.fullName}`);
      return { success: true };
    } else {
      console.log('❌ Protected route access failed:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Protected route network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Authentication Tests...\n');

  // Test 1: Registration
  const registrationResult = await testRegistration();

  if (registrationResult.success) {
    // Test 2: Login
    const loginResult = await testLogin(testEmail, testPassword);

    if (loginResult.success) {
      // Test 3: Protected Route
      await testProtectedRoute(loginResult.token);
    }
  }

  console.log('\n🏁 Tests completed!');
  console.log('\n💡 Frontend should now work with these APIs:');
  console.log('   • Registration: http://localhost:5001/api/auth/register');
  console.log('   • Login: http://localhost:5001/api/auth/login');
  console.log('   • Profile: http://localhost:5001/api/auth/me');
  console.log('\n🌐 Frontend running on: http://localhost:3000');
}

runAllTests();
