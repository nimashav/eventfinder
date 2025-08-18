// Admin tool to create and approve some test events
const createTestApprovedEvents = async () => {
  console.log('🧪 Creating Test Approved Events for Landing Page...\n');

  try {
    // First login as admin (if admin exists) or create test events directly
    console.log('📝 Creating test events...');

    const testEvents = [
      {
        eventName: 'Tech Innovation Summit 2025',
        description: 'Join us for the biggest tech summit of the year featuring keynotes from industry leaders, workshops, and networking opportunities.',
        address: 'Innovation Center, Silicon Valley, CA',
        date: '2025-09-15',
        time: '09:00',
        category: 'tech-innovation',
        organizer: {
          name: 'Tech Events Inc',
          email: 'contact@techevents.com',
          phone: '+1-555-0123'
        }
      },
      {
        eventName: 'Summer Music Festival',
        description: 'A three-day outdoor music festival featuring local and international artists across multiple genres.',
        address: 'Central Park, New York, NY',
        date: '2025-08-20',
        time: '14:00',
        category: 'music',
        organizer: {
          name: 'Music Festival Organizers',
          email: 'info@musicfest.com',
          phone: '+1-555-0456'
        }
      },
      {
        eventName: 'Art & Culture Exhibition',
        description: 'Explore contemporary art from emerging artists. Interactive installations and guided tours available.',
        address: 'Metropolitan Art Gallery, Chicago, IL',
        date: '2025-10-05',
        time: '10:00',
        category: 'art-culture',
        organizer: {
          name: 'Art Gallery Collective',
          email: 'curator@artgallery.com',
          phone: '+1-555-0789'
        }
      }
    ];

    // Register a test user first to get authentication
    const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Organizer',
        email: `organizer${Date.now()}@example.com`,
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        phone: '1234567890'
      })
    });

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      console.log('❌ Failed to register test user:', registerData.message);
      return;
    }

    const token = registerData.data.token;
    console.log('✅ Test user registered');

    const createdEvents = [];

    // Create events
    for (let i = 0; i < testEvents.length; i++) {
      const event = testEvents[i];
      console.log(`📝 Creating event ${i + 1}: ${event.eventName}...`);

      const formData = new FormData();
      formData.append('eventName', event.eventName);
      formData.append('description', event.description);
      formData.append('address', event.address);
      formData.append('date', event.date);
      formData.append('time', event.time);
      formData.append('category', event.category);
      formData.append('organizer', JSON.stringify(event.organizer));

      const createResponse = await fetch('http://localhost:5002/api/events/with-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const createData = await createResponse.json();
      if (createData.success) {
        console.log(`   ✅ Created: ${createData.data.eventName} (ID: ${createData.data._id})`);
        createdEvents.push({
          id: createData.data._id,
          name: createData.data.eventName,
          priority: i === 0 ? 'featured' : 'recommended' // Make first event featured
        });
      } else {
        console.log(`   ❌ Failed to create: ${event.eventName} - ${createData.message}`);
      }
    }

    console.log(`\n📊 Summary: Created ${createdEvents.length} events`);
    console.log('\n💡 Note: Events are created with "pending" status.');
    console.log('   To see them on the landing page, they need to be approved by an admin.');
    console.log('\n📋 Next steps to test:');
    console.log('   1. Go to http://localhost:3000 and login');
    console.log('   2. Check "My Events" to see your created events');
    console.log('   3. Use admin panel to approve events for landing page display');

    // List current events for verification
    console.log('\n📊 Current events in database:');
    const allEventsResponse = await fetch('http://localhost:5002/api/events');
    const allEventsData = await allEventsResponse.json();

    if (allEventsData.success) {
      console.log(`   Total events: ${allEventsData.count}`);
      const statusCounts = allEventsData.data.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      }, {});
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} events`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createTestApprovedEvents();
