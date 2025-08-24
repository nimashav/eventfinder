// Test Featured Events Display on Landing Page
const testFeaturedEventsDisplay = async () => {
  console.log('⭐ Testing Featured Events Display on Landing Page...\n');

  try {
    // Step 1: Check if backend is accessible
    console.log('🔍 Step 1: Checking backend accessibility...');
    const healthResponse = await fetch('http://localhost:5002/api/health');

    if (!healthResponse.ok) {
      console.log('❌ Backend server is not accessible');
      return;
    }
    console.log('✅ Backend server is accessible');

    // Step 2: Test the approved events endpoint directly
    console.log('\n📋 Step 2: Testing approved events endpoint...');
    const approvedResponse = await fetch('http://localhost:5002/api/events/approved');
    const approvedData = await approvedResponse.json();

    if (approvedResponse.ok && approvedData.success) {
      console.log(`✅ Approved events endpoint working - Found ${approvedData.data.length} approved events`);

      // Show breakdown by priority
      const featuredCount = approvedData.data.filter(event => event.priority === 'featured').length;
      const recommendedCount = approvedData.data.filter(event => event.priority === 'recommended').length;
      const noPriorityCount = approvedData.data.filter(event => !event.priority).length;

      console.log(`   🌟 Featured events: ${featuredCount}`);
      console.log(`   👍 Recommended events: ${recommendedCount}`);
      console.log(`   📋 No priority set: ${noPriorityCount}`);

      if (featuredCount > 0) {
        const firstFeatured = approvedData.data.find(event => event.priority === 'featured');
        console.log(`   📝 Sample featured event: "${firstFeatured.eventName}"`);
      }
    } else {
      console.log('❌ Approved events endpoint failed');
      return;
    }

    // Step 3: Test the featured events endpoint specifically
    console.log('\n⭐ Step 3: Testing featured events endpoint...');
    const featuredResponse = await fetch('http://localhost:5002/api/events/approved?priority=featured&limit=4');
    const featuredData = await featuredResponse.json();

    if (featuredResponse.ok && featuredData.success) {
      console.log(`✅ Featured events endpoint working - Found ${featuredData.data.length} featured events`);

      if (featuredData.data.length > 0) {
        featuredData.data.forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.eventName} (${event.category}) - ${new Date(event.date).toLocaleDateString()}`);
        });
      } else {
        console.log('⚠️ No featured events found in database');
        console.log('   ℹ️ To see featured events, approve some events as "featured" in admin dashboard');
      }
    } else {
      console.log('❌ Featured events endpoint failed');
    }

    // Step 4: Test the recommended events endpoint
    console.log('\n👍 Step 4: Testing recommended events endpoint...');
    const recommendedResponse = await fetch('http://localhost:5002/api/events/approved?priority=recommended&limit=8');
    const recommendedData = await recommendedResponse.json();

    if (recommendedResponse.ok && recommendedData.success) {
      console.log(`✅ Recommended events endpoint working - Found ${recommendedData.data.length} recommended events`);

      if (recommendedData.data.length > 0) {
        recommendedData.data.slice(0, 3).forEach((event, index) => {
          console.log(`   ${index + 1}. ${event.eventName} (${event.category}) - ${new Date(event.date).toLocaleDateString()}`);
        });
        if (recommendedData.data.length > 3) {
          console.log(`   ... and ${recommendedData.data.length - 3} more`);
        }
      } else {
        console.log('⚠️ No recommended events found in database');
      }
    } else {
      console.log('❌ Recommended events endpoint failed');
    }

    // Step 5: Instructions for testing frontend
    console.log('\n🖥️ Step 5: Frontend Testing Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Frontend URL: http://localhost:3000');
    console.log('');
    console.log('🔧 What was fixed:');
    console.log('   ✅ FeaturedEvents component now uses correct API endpoint');
    console.log('   ✅ RecommendedEvents component now uses correct API endpoint');
    console.log('   ✅ Both components use /api/events/approved instead of /api/events');
    console.log('   ✅ Added debug logging to track API responses');
    console.log('');
    console.log('📋 To test featured events display:');
    console.log('1. Go to http://localhost:3000 (landing page)');
    console.log('2. Look for "Featured Events" section');
    console.log('3. Check browser console (F12) for debug logs');
    console.log('4. If no featured events appear:');
    console.log('   • Login as admin');
    console.log('   • Go to Approved Events');
    console.log('   • Change some event priorities to "Featured"');
    console.log('   • Refresh landing page');
    console.log('');
    console.log('🎯 Expected behavior:');
    console.log('   ✅ Featured events with priority="featured" should appear');
    console.log('   ✅ Recommended events with priority="recommended" should appear');
    console.log('   ✅ Empty state message if no events of that priority exist');
    console.log('   ✅ Console logs showing fetched events');

    // Step 6: Admin instructions for creating featured events
    if (featuredData.data.length === 0) {
      console.log('\n⚡ Quick Fix - Create Featured Events:');
      console.log('1. Login as admin: admin@eventwave.com / Admin123!');
      console.log('2. Go to Admin Dashboard → Approved Events');
      console.log('3. Click "View" on any approved event');
      console.log('4. Click "Update Priority" → Select "Featured"');
      console.log('5. Refresh the landing page');
      console.log('6. Featured events should now appear!');
    }

  } catch (error) {
    console.error('❌ Error testing featured events display:', error.message);
  }
};

testFeaturedEventsDisplay();
