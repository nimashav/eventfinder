// Test event deletion functionality
const testEventDeletion = async () => {
  console.log('🧪 Testing Event Deletion Functionality...\n');

  try {
    // First, login or register a user
    console.log('🔑 Step 1: Login/Register user...');

    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test1755490863559@example.com',
        password: 'TestPass123!'
      })
    });

    let userData;
    if (!loginResponse.ok) {
      // Register a new user
      console.log('📝 Registering new user...');
      const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `deletetest${Date.now()}@example.com`,
          password: 'TestPass123!',
          confirmPassword: 'TestPass123!',
          phone: '1234567890'
        })
      });

      const registerData = await registerResponse.json();
      if (!registerData.success) {
        console.log('❌ Registration failed:', registerData.message);
        return;
      }
      userData = registerData.data;
      console.log('✅ User registered successfully');
    } else {
      const loginData = await loginResponse.json();
      if (!loginData.success) {
        console.log('❌ Login failed:', loginData.message);
        return;
      }
      userData = loginData.data;
      console.log('✅ User logged in successfully');
    }

    const token = userData.token;
    const user = userData.user;

    // Create a test event to delete
    console.log('\n📝 Step 2: Create a test event...');
    const formData = new FormData();
    formData.append('eventName', `Delete Test Event ${Date.now()}`);
    formData.append('description', 'This event will be deleted as part of testing');
    formData.append('address', '123 Delete Test St, Test City');
    formData.append('date', '2025-12-31');
    formData.append('time', '23:59');
    formData.append('category', 'other');
    formData.append('organizer', JSON.stringify({
      name: user.fullName || `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '1234567890'
    }));

    const createResponse = await fetch('http://localhost:5002/api/events/with-image', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const createData = await createResponse.json();
    if (!createData.success) {
      console.log('❌ Failed to create test event:', createData.message);
      return;
    }

    const eventId = createData.data._id;
    const eventName = createData.data.eventName;
    console.log(`✅ Created test event: ${eventName} (ID: ${eventId})`);

    // Verify the event exists in user's events
    console.log('\n📊 Step 3: Verify event exists in user\'s events...');
    const myEventsResponse = await fetch('http://localhost:5002/api/events/user/my-events', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const myEventsData = await myEventsResponse.json();
    if (myEventsData.success) {
      const testEvent = myEventsData.data.find(event => event._id === eventId);
      if (testEvent) {
        console.log(`✅ Event found in user's events: ${testEvent.eventName} (${testEvent.status})`);
      } else {
        console.log('❌ Event not found in user\'s events');
        return;
      }
    }

    // Test deletion
    console.log('\n🗑️ Step 4: Attempt to delete the event...');
    const deleteResponse = await fetch(`http://localhost:5002/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const deleteResult = await deleteResponse.json();

    console.log(`📥 Delete response status: ${deleteResponse.status}`);
    console.log(`📥 Delete response:`, deleteResult);

    if (deleteResponse.ok && deleteResult.success) {
      console.log('✅ Event deleted successfully!');

      // Verify the event is no longer in user's events
      console.log('\n🔍 Step 5: Verify event is removed from user\'s events...');
      const verifyResponse = await fetch('http://localhost:5002/api/events/user/my-events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const verifyData = await verifyResponse.json();
      if (verifyData.success) {
        const deletedEvent = verifyData.data.find(event => event._id === eventId);
        if (!deletedEvent) {
          console.log('✅ Event successfully removed from user\'s events');
        } else {
          console.log('❌ Event still exists in user\'s events');
        }
      }
    } else {
      console.log('❌ Event deletion failed:', deleteResult.message);
    }

    console.log('\n🎉 Event deletion test completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }
};

testEventDeletion();
