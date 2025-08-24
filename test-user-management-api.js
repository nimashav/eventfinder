// Use native fetch API (Node.js 18+)
const BASE_URL = 'http://localhost:5002/api';

// Test function for admin login
async function testAdminLogin() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@eventwave.com',
        password: 'Admin123!'
      })
    });

    const data = await response.json();
    console.log('Admin login test:', data);

    if (data.success) {
      return data.data.token;
    }
    return null;
  } catch (error) {
    console.error('Admin login error:', error);
    return null;
  }
}

// Test function for user management endpoints
async function testUserManagement(token) {
  if (!token) {
    console.log('No token available for user management tests');
    return;
  }

  try {
    // Test get users
    console.log('\n--- Testing GET /users ---');
    const usersResponse = await fetch(`${BASE_URL}/auth/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const usersData = await usersResponse.json();
    console.log('Get users:', usersData);

    // Test get user stats
    console.log('\n--- Testing GET /admin/user-stats ---');
    const statsResponse = await fetch(`${BASE_URL}/auth/admin/user-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const statsData = await statsResponse.json();
    console.log('Get user stats:', statsData);

    // Test create user
    console.log('\n--- Testing POST /admin/create-user ---');
    const createResponse = await fetch(`${BASE_URL}/auth/admin/create-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      })
    });
    const createData = await createResponse.json();
    console.log('Create user:', createData);

    if (createData.success) {
      const userId = createData.data.user.id;

      // Test update user role
      console.log('\n--- Testing PUT /users/:userId/role ---');
      const roleResponse = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'admin' })
      });
      const roleData = await roleResponse.json();
      console.log('Update user role:', roleData);

      // Test toggle user status
      console.log('\n--- Testing PUT /users/:userId/toggle-status ---');
      const statusResponse = await fetch(`${BASE_URL}/auth/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const statusData = await statusResponse.json();
      console.log('Toggle user status:', statusData);

      // Test delete user
      console.log('\n--- Testing DELETE /users/:userId ---');
      const deleteResponse = await fetch(`${BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const deleteData = await deleteResponse.json();
      console.log('Delete user:', deleteData);
    }

    // Test export users
    console.log('\n--- Testing GET /admin/users/export ---');
    const exportResponse = await fetch(`${BASE_URL}/auth/admin/users/export`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const exportData = await exportResponse.json();
    console.log('Export users:', exportData);

  } catch (error) {
    console.error('User management test error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting User Management API Tests...\n');

  const token = await testAdminLogin();
  await testUserManagement(token);

  console.log('\n✅ Tests completed!');
}

runTests();
