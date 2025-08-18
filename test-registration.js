// Simple test to check registration endpoint
const testRegistration = async () => {
  try {
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      phone: '1234567890'
    };

    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testRegistration();
