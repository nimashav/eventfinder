const mongoose = require('mongoose');
const Event = require('./models/Event');

async function addTestEvent() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventfinder');
    console.log('Connected to MongoDB');

    // Create a test event
    const testEvent = new Event({
      eventName: 'Test Priority Event',
      description: 'This is a test event to verify the priority system works correctly.',
      address: 'Test Location, Test City',
      date: new Date('2025-12-25'),
      time: '14:00',
      category: 'tech-innovation',
      organizer: {
        name: 'Test Organizer',
        email: 'test@example.com',
        phone: '+1234567890'
      },
      status: 'pending'
    });

    const savedEvent = await testEvent.save();
    console.log('Test event created:', savedEvent.eventName);
    console.log('Event ID:', savedEvent._id);
    console.log('Priority:', savedEvent.priority);
    console.log('Status:', savedEvent.status);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestEvent();
