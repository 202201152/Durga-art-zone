/**
 * Google OAuth Test Script
 * Run this to verify Google OAuth is working
 */

const axios = require('axios');

async function testGoogleOAuth() {
    try {
        console.log('🧪 Testing Google OAuth...');

        // Test 1: Check if Google OAuth endpoint redirects to Google
        console.log('\n1. Testing Google OAuth redirect...');
        const response = await axios.get('http://localhost:5000/api/v1/auth/google', {
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });

        if (response.headers.location && response.headers.location.includes('accounts.google.com')) {
            console.log('✅ Google OAuth redirect working correctly');
            console.log(`🔗 Redirects to: ${response.headers.location.split('?')[0]}`);
        } else {
            console.log('❌ Google OAuth redirect not working');
            return;
        }

        // Test 2: Check backend health
        console.log('\n2. Testing backend health...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Backend is healthy');

        console.log('\n🎉 Google OAuth is ready for testing!');
        console.log('\n📋 Next Steps:');
        console.log('1. Go to frontend: http://localhost:3000');
        console.log('2. Navigate to login page');
        console.log('3. Click "Login with Google"');
        console.log('4. Complete Google OAuth flow');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure backend server is running on port 5000');
        }
    }
}

testGoogleAuth();
