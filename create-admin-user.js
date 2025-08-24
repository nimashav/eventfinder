// Script to create an admin user
const createAdminUser = async () => {
  console.log('👑 Creating Admin User...\n');

  const adminData = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@eventwave.com',
    password: 'Admin123!',
    confirmPassword: 'Admin123!',
    phone: '+1-555-ADMIN'
  };

  try {
    // First, check if admin already exists
    console.log('🔍 Checking if admin user already exists...');
    const checkResponse = await fetch('http://localhost:5002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminData.email,
        password: adminData.password
      })
    });

    if (checkResponse.ok) {
      const loginData = await checkResponse.json();
      if (loginData.success && loginData.data.user.role === 'admin') {
        console.log('✅ Admin user already exists and can login!');
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`🔑 Password: ${adminData.password}`);
        console.log(`👑 Role: ${loginData.data.user.role}`);
        return;
      }
    }

    // Admin doesn't exist, let's create one
    console.log('📝 Creating new admin user...');
    const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });

    const registerData = await registerResponse.json();

    if (!registerData.success) {
      console.log('❌ Failed to create admin user:', registerData.message);
      return;
    }

    console.log('✅ Admin user created successfully!');
    const userId = registerData.data.user.id;

    // Now we need to update the user role to 'admin'
    // Since we don't have a direct endpoint for this, let's create a simple script
    console.log('\n⚠️  Important: The user was created but with "user" role.');
    console.log('We need to manually update the role to "admin" in the database.');

    console.log('\n📋 Admin User Details:');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log(`🆔 User ID: ${userId}`);

    console.log('\n🔧 Next Steps:');
    console.log('1. The user has been created but needs role update');
    console.log('2. We\'ll create a separate script to update the role to admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

createAdminUser();
