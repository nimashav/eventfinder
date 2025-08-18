// Test registration to see validation errors
const testRegistrationValidation = async () => {
  console.log('🧪 Testing Registration Validation...\n');

  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!',
    phone: '1234567890'
  };

  try {
    console.log('📝 Sending registration data:', testData);

    const response = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('\n📥 Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ Registration successful!');
    } else {
      console.log('\n❌ Registration failed!');
      if (data.errors && Array.isArray(data.errors)) {
        console.log('Validation errors:');
        data.errors.forEach((error, index) => {
          console.log(`${index + 1}. Field: ${error.field}, Message: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testRegistrationValidation();
