const http = require('http');

const testData = JSON.stringify({
  firstName: 'Test',
  lastName: 'User',
  email: `testuser${Date.now()}@example.com`,
  password: 'TestPassword123',
  confirmPassword: 'TestPassword123',
  phone: '1234567890'
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('🧪 Testing registration with native HTTP...');
console.log('📤 Request data:', JSON.parse(testData));

const req = http.request(options, (res) => {
  console.log(`📡 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const responseData = JSON.parse(data);
      if (res.statusCode === 201) {
        console.log('✅ Registration successful!');
        console.log('📥 Response:', responseData);
      } else {
        console.log('❌ Registration failed!');
        console.log('📥 Response:', responseData);
      }
    } catch (error) {
      console.log('❌ Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('🔥 Server is not running on port 5002');
  }
});

req.write(testData);
req.end();
