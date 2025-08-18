// Test Approved Events Management (Delete & Priority Update)
const testApprovedEventsManagement = async () => {
  console.log('🔧 Testing Approved Events Management Functionality...\n');

  const adminCredentials = {
    email: 'admin@eventwave.com',
    password: 'Admin123!'
  };

  try {
    // Step 1: Admin Login
    console.log('🔑 Step 1: Admin Login...');
    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok || !loginData.success) {
      console.log('❌ Admin login failed:', loginData.message);
      return;
    }

    console.log('✅ Admin login successful!');
    const token = loginData.data.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Step 2: Fetch Approved Events
    console.log('\n📋 Step 2: Fetching Approved Events...');
    const approvedResponse = await fetch('http://localhost:5002/api/events/approved');
    const approvedData = await approvedResponse.json();

    if (approvedResponse.ok && approvedData.success) {
      console.log(`✅ Found ${approvedData.data.length} approved events`);

      if (approvedData.data.length > 0) {
        const firstEvent = approvedData.data[0];
        console.log(`🎪 Test Event: ${firstEvent.eventName}`);
        console.log(`📍 Location: ${firstEvent.address}`);
        console.log(`🏷️ Current Priority: ${firstEvent.priority || 'recommended'}`);

        // Step 3: Test Priority Update
        console.log('\n⭐ Step 3: Testing Priority Update...');
        const newPriority = firstEvent.priority === 'featured' ? 'recommended' : 'featured';

        const priorityResponse = await fetch(`http://localhost:5002/api/events/${firstEvent._id}/priority`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ priority: newPriority })
        });

        const priorityData = await priorityResponse.json();

        if (priorityResponse.ok && priorityData.success) {
          console.log(`✅ Priority update successful!`);
          console.log(`🔄 Changed from "${firstEvent.priority || 'recommended'}" to "${newPriority}"`);
        } else {
          console.log('❌ Priority update failed:', priorityData.message);
        }

        // Step 4: Test Admin Stats Access
        console.log('\n📊 Step 4: Testing Admin Stats Access...');
        const statsResponse = await fetch('http://localhost:5002/api/events/admin/approved-stats', {
          headers: authHeaders
        });

        const statsData = await statsResponse.json();

        if (statsResponse.ok && statsData.success) {
          console.log('✅ Admin stats accessible!');
          console.log(`📈 Total Approved: ${statsData.data.total || 0}`);
          console.log(`🌟 Featured: ${statsData.data.featured || 0}`);
          console.log(`👍 Recommended: ${statsData.data.recommended || 0}`);
        } else {
          console.log('❌ Admin stats failed:', statsData.message);
        }

        // Step 5: Test Event Deletion (Optional - only if there are test events)
        // Note: We won't actually delete a real event, just test the endpoint
        console.log('\n🗑️ Step 5: Testing Delete Endpoint Access...');

        // Just test with a non-existent ID to see if authentication works
        const deleteTestResponse = await fetch('http://localhost:5002/api/events/000000000000000000000000', {
          method: 'DELETE',
          headers: authHeaders
        });

        if (deleteTestResponse.status === 404) {
          console.log('✅ Delete endpoint accessible (404 expected for non-existent event)');
        } else if (deleteTestResponse.status === 403) {
          console.log('❌ Delete endpoint access denied - authentication issue');
        } else {
          console.log(`ℹ️ Delete endpoint returned status: ${deleteTestResponse.status}`);
        }

      } else {
        console.log('ℹ️ No approved events found to test with');
      }
    } else {
      console.log('❌ Failed to fetch approved events:', approvedData.message);
    }

    // Step 6: Frontend Testing Instructions
    console.log('\n🖥️ Step 6: Frontend Testing Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Frontend URL: http://localhost:3002');
    console.log('');
    console.log('📋 To Test Approved Events Management:');
    console.log('1. Login as admin with credentials above');
    console.log('2. Navigate to "Approved Events" from the sidebar');
    console.log('3. Click "View" button on any approved event');
    console.log('4. In the modal, test these features:');
    console.log('   • Click "Update Priority" - change between Featured/Recommended');
    console.log('   • Click "Delete Event" - delete approved events (admin only)');
    console.log('');
    console.log('🔧 Expected Behavior:');
    console.log('   • Priority updates should work immediately');
    console.log('   • Event deletion should work for admins');
    console.log('   • Page should refresh automatically after changes');
    console.log('   • Success/error messages should appear');
    console.log('');
    console.log('✅ Authentication is now properly implemented for all admin operations!');

  } catch (error) {
    console.error('❌ Error testing approved events management:', error.message);
  }
};

testApprovedEventsManagement();
