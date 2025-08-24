// Test admin login functionality
const testAdminLogin = async () => {
  console.log('👑 Testing Admin Login...\n');

  const adminCredentials = {
    email: 'admin@eventwave.com',
    password: 'Admin123!'
  };

  try {
    console.log('🔑 Attempting admin login...');
    const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminCredentials)
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok && loginData.success) {
      console.log('✅ Admin login successful!');
      console.log(`👤 Name: ${loginData.data.user.fullName}`);
      console.log(`📧 Email: ${loginData.data.user.email}`);
      console.log(`👑 Role: ${loginData.data.user.role}`);
      console.log(`🆔 User ID: ${loginData.data.user.id}`);

      // Test admin-specific endpoint
      console.log('\n📊 Testing admin-specific API access...');
      const statsResponse = await fetch('http://localhost:5002/api/events/admin/stats', {
        headers: { 'Authorization': `Bearer ${loginData.data.token}` }
      });

      const statsData = await statsResponse.json();

      if (statsResponse.ok && statsData.success) {
        console.log('✅ Admin API access confirmed!');
        console.log('📊 Event Statistics:');
        console.log(`   Total Events: ${statsData.data.total}`);
        console.log(`   Pending: ${statsData.data.pending}`);
        console.log(`   Approved: ${statsData.data.approved}`);
        console.log(`   Rejected: ${statsData.data.rejected}`);
      } else {
        console.log('❌ Admin API access failed:', statsData.message);
      }

      console.log('\n🚀 How to Access Admin Panel:');
      console.log('1. Go to http://localhost:3000');
      console.log('2. Click "Login"');
      console.log('3. Use these credentials:');
      console.log(`   📧 Email: ${adminCredentials.email}`);
      console.log(`   🔑 Password: ${adminCredentials.password}`);
      console.log('4. After login, click your avatar in the top-right');
      console.log('5. You should see "Admin Panel" option in the dropdown');
      console.log('6. Click "Admin Panel" to access dashboard');
      console.log('\n📋 Available Admin Routes:');
      console.log('   • /admin/dashboard - Main admin dashboard');
      console.log('   • /admin/approved - Manage approved events');
      console.log('   • /admin/users - User management');

    } else {
      console.log('❌ Admin login failed:', loginData.message);
    }

  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
  }
};

testAdminLogin();
