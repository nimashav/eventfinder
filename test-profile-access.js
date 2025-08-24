// Test profile functionality with admin login
const testProfileAccess = async () => {
  console.log('👤 Testing Profile Access for Admin User...\n');

  const adminCredentials = {
    email: 'admin@eventwave.com',
    password: 'Admin123!'
  };

  try {
    // Step 1: Login as admin
    console.log('🔑 Step 1: Login as admin...');
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
    const user = loginData.data.user;

    // Step 2: Test profile endpoint access
    console.log('\n📊 Step 2: Test profile endpoint access...');
    const profileResponse = await fetch('http://localhost:5002/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const profileData = await profileResponse.json();

    if (profileResponse.ok && profileData.success) {
      console.log('✅ Profile endpoint accessible!');
      console.log('📋 Profile data:');
      console.log(`   📧 Email: ${profileData.data.user.email}`);
      console.log(`   🏷️ First Name: ${profileData.data.user.firstName}`);
      console.log(`   🏷️ Last Name: ${profileData.data.user.lastName}`);
      console.log(`   📱 Phone: ${profileData.data.user.phone || 'Not set'}`);
      console.log(`   👑 Role: ${profileData.data.user.role}`);
    } else {
      console.log('❌ Profile endpoint failed:', profileData.message);
      return;
    }

    // Step 3: Test profile update
    console.log('\n📝 Step 3: Test profile update...');
    const updateData = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: '+1-555-ADMIN-UPDATED'
    };

    const updateResponse = await fetch('http://localhost:5002/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();

    if (updateResponse.ok && updateResult.success) {
      console.log('✅ Profile update successful!');
      console.log(`📱 Updated phone: ${updateResult.data.user.phone}`);
    } else {
      console.log('❌ Profile update failed:', updateResult.message);
    }

    // Step 4: Frontend access instructions
    console.log('\n🚀 How to Access Profile as Admin:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Login with admin credentials:');
    console.log(`   📧 Email: ${adminCredentials.email}`);
    console.log(`   🔑 Password: ${adminCredentials.password}`);
    console.log('3. Click your avatar/name in the top-right corner');
    console.log('4. You should see these menu options:');
    console.log('   • Profile');
    console.log('   • Add Event');
    console.log('   • My Events');
    console.log('   • Admin Panel');
    console.log('   • Logout');
    console.log('5. Click "Profile" to access your profile page');

    console.log('\n📋 Profile Page Features:');
    console.log('   • View and edit personal information');
    console.log('   • Change password');
    console.log('   • Shows admin role badge');
    console.log('   • Profile avatar/initials display');

    // Step 5: Check if there might be styling issues
    console.log('\n🎨 Possible Issues to Check:');
    console.log('   1. Profile menu item might be hidden by CSS');
    console.log('   2. Avatar/dropdown menu might not be working');
    console.log('   3. JavaScript errors in browser console');
    console.log('   4. Authentication state might not be loading properly');

    console.log('\n🔧 Debugging Steps:');
    console.log('   1. Open browser developer tools (F12)');
    console.log('   2. Check Console tab for JavaScript errors');
    console.log('   3. Check Network tab for failed requests');
    console.log('   4. Try refreshing the page after login');
    console.log('   5. Try logging out and logging back in');

  } catch (error) {
    console.error('❌ Error testing profile access:', error.message);
  }
};

testProfileAccess();
