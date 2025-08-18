// Direct database script to create admin user
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  phone: String
}, { timestamps: true });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

const createAdminDirectly = async () => {
  try {
    console.log('👑 Creating Admin User Directly in Database...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('✅ Connected to MongoDB');

    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@eventwave.com',
      password: 'Admin123!',
      phone: '+1-555-ADMIN',
      role: 'admin' // Set role directly to admin
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👑 Role: ${existingAdmin.role}`);
      console.log(`🔑 Password: Admin123!`);

      // Update role to admin if it's not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user role to admin');
      }
    } else {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

      // Create admin user
      const adminUser = new User({
        ...adminData,
        password: hashedPassword
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔑 Password: ${adminData.password}`);
      console.log(`👑 Role: ${adminUser.role}`);
      console.log(`🆔 User ID: ${adminUser._id}`);
    }

    console.log('\n🚀 Admin Login Instructions:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Click "Login"');
    console.log('3. Use these credentials:');
    console.log(`   📧 Email: admin@eventwave.com`);
    console.log(`   🔑 Password: Admin123!`);
    console.log('4. You should now have admin access!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

createAdminDirectly();
