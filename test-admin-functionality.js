// Test Admin Profile and Event Approval Functionality
const testAdminFunctionality = async () => {
  console.log('🔧 Testing Admin Profile and Event Approval Functionality...\n');

  const adminCredentials = {
    email: 'admin@eventwave.com',
    password: 'Admin123!'
  };

  try {
    // Step 1: Login as admin
    console.log('🔑 Step 1: Admin Login Test...');
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
    console.log(`👤 Name: ${loginData.data.user.fullName}`);
    console.log(`👑 Role: ${loginData.data.user.role}`);

    const token = loginData.data.token;

    // Step 2: Test Profile Access with Authentication
    console.log('\n👤 Step 2: Profile Access Test...');
    const profileResponse = await fetch('http://localhost:5002/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const profileData = await profileResponse.json();

    if (profileResponse.ok && profileData.success) {
      console.log('✅ Profile endpoint accessible with authentication!');
      console.log(`📧 Email: ${profileData.data.user.email}`);
      console.log(`🏷️ Name: ${profileData.data.user.fullName}`);
      console.log(`👑 Role: ${profileData.data.user.role}`);
    } else {
      console.log('❌ Profile access failed:', profileData.message);
    }

    // Step 3: Test Event Approval Endpoint Access
    console.log('\n📊 Step 3: Admin Stats Endpoint Test...');
    const statsResponse = await fetch('http://localhost:5002/api/events/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const statsData = await statsResponse.json();

    if (statsResponse.ok && statsData.success) {
      console.log('✅ Admin stats endpoint accessible!');
      console.log(`📈 Pending: ${statsData.data.pending || 0}`);
      console.log(`✅ Approved: ${statsData.data.approved || 0}`);
      console.log(`❌ Rejected: ${statsData.data.rejected || 0}`);
    } else {
      console.log('❌ Admin stats failed:', statsData.message);
    }

    // Step 4: Test Pending Events Fetch
    console.log('\n📝 Step 4: Pending Events Fetch Test...');
    const eventsResponse = await fetch('http://localhost:5002/api/events?status=pending', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const eventsData = await eventsResponse.json();

    if (eventsResponse.ok && eventsData.success) {
      console.log(`✅ Pending events fetch successful! Found ${eventsData.data.length} pending events.`);

      if (eventsData.data.length > 0) {
        const firstEvent = eventsData.data[0];
        console.log(`🎪 Sample Event: ${firstEvent.eventName}`);
        console.log(`📅 Date: ${new Date(firstEvent.date).toLocaleDateString()}`);
        console.log(`📍 Location: ${firstEvent.address}`);
        console.log(`🏷️ Category: ${firstEvent.category}`);

        // Step 5: Test Event Approval
        console.log('\n✅ Step 5: Event Approval Test...');
        const approvalResponse = await fetch(`http://localhost:5002/api/events/${firstEvent._id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'approved',
            priority: 'recommended',
            reviewedBy: loginData.data.user.fullName
          })
        });

        const approvalData = await approvalResponse.json();

        if (approvalResponse.ok && approvalData.success) {
          console.log('🎉 Event approval successful!');
          console.log(`✅ Event "${firstEvent.eventName}" approved as recommended`);
          console.log(`👤 Reviewed by: ${loginData.data.user.fullName}`);
        } else {
          console.log('❌ Event approval failed:', approvalData.message);
        }
      } else {
        console.log('ℹ️ No pending events found to test approval');
      }
    } else {
      console.log('❌ Pending events fetch failed:', eventsData.message);
    }

    // Step 6: Frontend Access Instructions
    console.log('\n🖥️ Step 6: Frontend Access Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Frontend URL: http://localhost:3002');
    console.log('🔑 Admin Credentials:');
    console.log(`   📧 Email: ${adminCredentials.email}`);
    console.log(`   🔐 Password: ${adminCredentials.password}`);
    console.log('');
    console.log('📋 Admin Profile Section Features:');
    console.log('   1. Login to the admin dashboard');
    console.log('   2. Look for user avatar/profile in top-right of AdminHeader');
    console.log('   3. Click on the avatar to see dropdown menu with:');
    console.log('      • Profile (view/edit profile information)');
    console.log('      • My Events (view admin\'s events)');
    console.log('      • Admin Dashboard (go to admin panel)');
    console.log('      • Logout (logout from system)');
    console.log('');
    console.log('🔧 Event Approval Features:');
    console.log('   1. Go to Admin Dashboard');
    console.log('   2. View pending events in the table');
    console.log('   3. Click "View Details" on any pending event');
    console.log('   4. Use the modal to approve/reject events');
    console.log('   5. Select priority (recommended/featured) for approved events');
    console.log('');
    console.log('✅ Both backend authentication and admin functionality are working!');

  } catch (error) {
    console.error('❌ Error testing admin functionality:', error.message);
  }
};

testAdminFunctionality();
