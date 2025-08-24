// Test event creation with authentication
const testEventCreation = async () => {
  console.log('🧪 Testing Event Creation...\n');

  // First, let's test login to get a token
  const loginData = {
    email: 'test1755490863559@example.com', // Use previously registered user
    password: 'TestPass123!'
  };

  try {
    console.log('🔑 Logging in to get authentication token...');
    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();

    if (!loginResult.success) {
      console.log('❌ Login failed:', loginResult.message);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Login successful, token obtained');

    // Now test event creation
    console.log('\n📝 Testing event creation...');

    const formData = new FormData();
    formData.append('eventName', 'Test Event ' + Date.now());
    formData.append('description', 'This is a test event created via API');
    formData.append('address', '123 Test Street, Test City');
    formData.append('date', '2025-08-25');
    formData.append('time', '18:00');
    formData.append('category', 'tech-innovation');
    formData.append('organizer', JSON.stringify({
      name: 'Test Organizer',
      email: 'test@example.com',
      phone: '1234567890'
    }));

    const eventResponse = await fetch('http://localhost:5002/api/events/with-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('📥 Event creation response status:', eventResponse.status);

    const eventResult = await eventResponse.json();
    console.log('📥 Event creation result:', JSON.stringify(eventResult, null, 2));

    if (eventResult.success) {
      console.log('\n✅ Event creation successful!');
      console.log('   Event ID:', eventResult.data.event._id);
      console.log('   Event Name:', eventResult.data.event.eventName);
    } else {
      console.log('\n❌ Event creation failed:', eventResult.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testEventCreation();
