// Test frontend registration using fetch to match frontend behavior
const testFrontendRegistration = async () => {
  console.log('🧪 Testing Frontend Registration Flow...\n');

  const testData = {
    firstName: 'Frontend',
    lastName: 'Test',
    email: `frontendtest${Date.now()}@example.com`,
    password: 'Test123!',
    confirmPassword: 'Test123!',
    phone: '1234567890'
  };

  try {
    console.log('📝 Testing with data:', testData);

    // Test 1: Direct fetch call (like axios would do)
    console.log('\n🚀 Making direct fetch request...');
    const response = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('\n✅ Frontend registration flow should work!');
    } else {
      console.log('\n❌ Registration failed!');
      if (result.errors) {
        console.log('Validation errors:');
        result.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.field}: ${error.message}`);
        });
      }
    }

    // Test 2: Try with minimal data to see what fields are required
    console.log('\n🧪 Testing with minimal data...');
    const minimalData = {
      firstName: 'Test',
      lastName: 'User',
      email: `minimal${Date.now()}@example.com`,
      password: 'Test123!',
      confirmPassword: 'Test123!'
    };

    const response2 = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData)
    });

    const result2 = await response2.json();
    console.log('📥 Minimal data response:', JSON.stringify(result2, null, 2));

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testFrontendRegistration();
