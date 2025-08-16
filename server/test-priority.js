const mongoose = require('mongoose');
const Event = require('./models/Event');

async function testEventCreation() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventfinder');
    console.log('Connected to MongoDB');

    // Test creating a new event (should have null priority)
    console.log('Creating a new test event...');
    const testEvent = new Event({
      eventName: 'Priority Test Event',
      description: 'Testing that priority defaults to null',
      address: 'Test Location',
      date: new Date('2025-12-31'),
      time: '18:00',
      category: 'tech-innovation',
      organizer: {
        name: 'Test User',
        email: 'test@example.com'
      }
    });

    const savedEvent = await testEvent.save();
    console.log('✅ Event created successfully:');
    console.log(`   Name: ${savedEvent.eventName}`);
    console.log(`   Priority: ${savedEvent.priority}`);
    console.log(`   Status: ${savedEvent.status}`);

    // Test updating to approved with priority
    console.log('\nTesting approval with priority...');
    const updatedEvent = await Event.findByIdAndUpdate(
      savedEvent._id,
      {
        status: 'approved',
        priority: 'featured',
        reviewedBy: 'Test Admin',
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Event approved successfully:');
    console.log(`   Name: ${updatedEvent.eventName}`);
    console.log(`   Priority: ${updatedEvent.priority}`);
    console.log(`   Status: ${updatedEvent.status}`);

    // Test that invalid priority is rejected
    console.log('\nTesting invalid priority rejection...');
    try {
      await Event.findByIdAndUpdate(
        savedEvent._id,
        { priority: 'invalid_priority' },
        { new: true, runValidators: true }
      );
      console.log('❌ Invalid priority was accepted (this is bad!)');
    } catch (error) {
      console.log('✅ Invalid priority was correctly rejected');
      console.log(`   Error: ${error.message}`);
    }

    // Clean up test event
    await Event.findByIdAndDelete(savedEvent._id);
    console.log('\n🧹 Test event cleaned up');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testEventCreation();
