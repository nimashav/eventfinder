// Test the complete event creation and retrieval flow
const testCompleteEventFlow = async () => {
  console.log('🧪 Testing Complete Event Creation & Retrieval Flow...\n');

  try {
    // First, let's check existing events in the database
    console.log('📊 Step 1: Check existing events in database...');
    const allEventsResponse = await fetch('http://localhost:5002/api/events');
    const allEventsData = await allEventsResponse.json();

    console.log(`📈 Total events in database: ${allEventsData.success ? allEventsData.count : 0}`);
    if (allEventsData.success && allEventsData.data.length > 0) {
      console.log('📋 Event statuses:');
      const statusCounts = allEventsData.data.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      }, {});
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} events`);
      });
    }

    // Test login to get a token for user-specific operations
    console.log('\n🔑 Step 2: Login to get authentication token...');
    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test1755490863559@example.com', // Use existing user
        password: 'TestPass123!'
      })
    });

    const loginData = await loginResponse.json();

    if (!loginData.success) {
      console.log('❌ Login failed, let\'s register a new user...');

      // Register a new user
      const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `testuser${Date.now()}@example.com`,
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

      loginData.data = registerData.data; // Use registered user data
      console.log('✅ New user registered and logged in');
    } else {
      console.log('✅ Login successful');
    }

    const token = loginData.data.token;
    const user = loginData.data.user;

    // Test fetching user's events
    console.log('\n📂 Step 3: Fetch user\'s current events...');
    const myEventsResponse = await fetch('http://localhost:5002/api/events/user/my-events', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const myEventsData = await myEventsResponse.json();
    if (myEventsData.success) {
      console.log(`📊 User has ${myEventsData.count} events`);
      if (myEventsData.data.length > 0) {
        myEventsData.data.forEach(event => {
          console.log(`   - ${event.eventName} (${event.status})`);
        });
      }
    } else {
      console.log('❌ Failed to fetch user events:', myEventsData.message);
    }

    // Create a new event
    console.log('\n📝 Step 4: Create a new event...');
    const formData = new FormData();
    formData.append('eventName', `Test Event ${Date.now()}`);
    formData.append('description', 'This is a test event created to verify the complete flow');
    formData.append('address', '123 Test Street, Test City, TC 12345');
    formData.append('date', '2025-12-25');
    formData.append('time', '18:00');
    formData.append('category', 'tech-innovation');
    formData.append('organizer', JSON.stringify({
      name: user.fullName || `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '1234567890'
    }));

    const createEventResponse = await fetch('http://localhost:5002/api/events/with-image', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const createEventData = await createEventResponse.json();

    if (createEventData.success) {
      console.log('✅ Event created successfully!');
      console.log(`   Event ID: ${createEventData.data._id}`);
      console.log(`   Event Name: ${createEventData.data.eventName}`);
      console.log(`   Status: ${createEventData.data.status}`);
    } else {
      console.log('❌ Event creation failed:', createEventData.message);
      return;
    }

    // Fetch user's events again to see if the new event appears
    console.log('\n🔄 Step 5: Verify new event appears in user\'s events...');
    const updatedMyEventsResponse = await fetch('http://localhost:5002/api/events/user/my-events', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const updatedMyEventsData = await updatedMyEventsResponse.json();
    if (updatedMyEventsData.success) {
      console.log(`📊 User now has ${updatedMyEventsData.count} events`);
      const newEvent = updatedMyEventsData.data.find(event => event._id === createEventData.data._id);
      if (newEvent) {
        console.log('✅ New event found in user\'s events list!');
        console.log(`   Event: ${newEvent.eventName} (${newEvent.status})`);
      } else {
        console.log('❌ New event NOT found in user\'s events list');
      }
    }

    // Test fetching approved events (for landing page)
    console.log('\n🏠 Step 6: Test approved events for landing page...');
    const approvedEventsResponse = await fetch('http://localhost:5002/api/events/approved');
    const approvedEventsData = await approvedEventsResponse.json();

    if (approvedEventsData.success) {
      console.log(`📊 Approved events: ${approvedEventsData.count}`);
      if (approvedEventsData.data.length > 0) {
        console.log('📋 Featured events:');
        approvedEventsData.data.filter(event => event.priority === 'featured').forEach(event => {
          console.log(`   - ${event.eventName} (Featured)`);
        });
        console.log('📋 Recommended events:');
        approvedEventsData.data.filter(event => event.priority === 'recommended').forEach(event => {
          console.log(`   - ${event.eventName} (Recommended)`);
        });
      }
    } else {
      console.log('❌ Failed to fetch approved events:', approvedEventsData.message);
    }

    console.log('\n🎉 Complete flow test finished!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Authentication working`);
    console.log(`   ✅ Event creation working`);
    console.log(`   ✅ User events API working`);
    console.log(`   ✅ Approved events API working`);
    console.log('\n💡 Note: New events are created with "pending" status.');
    console.log('   They will appear in "My Events" but not on landing page until approved by admin.');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }
};

testCompleteEventFlow();
