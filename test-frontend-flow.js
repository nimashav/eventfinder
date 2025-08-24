// Complete frontend authentication and event creation test
const testFrontendFlow = async () => {
  console.log('🧪 Testing Complete Frontend Flow...\n');

  // Test data
  const testUser = {
    fullName: 'Test User Frontend',
    email: `frontend${Date.now()}@example.com`,
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!'
  };

  try {
    // Step 1: Register a new user
    console.log('📝 Step 1: Register new user...');
    const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const registerResult = await registerResponse.json();

    if (!registerResult.success) {
      console.log('❌ Registration failed:', registerResult.message);
      return;
    }

    console.log('✅ Registration successful');
    const token = registerResult.data.token;
    const user = registerResult.data.user;

    // Step 2: Test the /auth/me endpoint (this is what frontend calls on load)
    console.log('\n🔍 Step 2: Test user authentication endpoint...');
    const meResponse = await fetch('http://localhost:5002/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const meResult = await meResponse.json();

    if (!meResult.success) {
      console.log('❌ Auth/me failed:', meResult.message);
      return;
    }

    console.log('✅ User authentication verified');
    console.log('   User ID:', meResult.data.user._id);
    console.log('   User Email:', meResult.data.user.email);

    // Step 3: Test event creation with the token
    console.log('\n📝 Step 3: Create event with authenticated user...');

    const formData = new FormData();
    formData.append('eventName', `Frontend Test Event ${Date.now()}`);
    formData.append('description', 'This is a test event created via frontend flow simulation');
    formData.append('address', '123 Frontend Test Street, Test City');
    formData.append('date', '2025-09-15');
    formData.append('time', '19:00');
    formData.append('category', 'tech-innovation');
    formData.append('organizer', JSON.stringify({
      name: user.fullName,
      email: user.email,
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
      console.log('\n✅ Complete frontend flow test successful!');
      console.log('   ✓ User registration works');
      console.log('   ✓ User authentication works');
      console.log('   ✓ Event creation with auth works');
      console.log('   Event ID:', eventResult.data._id);
      console.log('   Event Name:', eventResult.data.eventName);
    } else {
      console.log('\n❌ Event creation failed:', eventResult.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testFrontendFlow();
