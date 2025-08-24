// Test login functionality
const testLogin = async () => {
  try {
    // Use the email from our previous registration test
    const testData = {
      email: 'test1755490863559@example.com', // Use the email from the successful registration
      password: 'TestPass123!'
    };

    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.data.user);
      console.log('Token:', data.data.token ? 'Token received' : 'No token');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testLogin();
