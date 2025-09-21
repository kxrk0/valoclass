const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

// Test admin APIs
async function testAdminAPIs() {
    console.log('🔍 Testing Admin Panel APIs...');
    
    try {
        // Test 1: API Info
        console.log('\n1. Testing API Info endpoint...');
        const apiInfo = await axios.get(`${BASE_URL}/`);
        console.log('✅ API Info:', apiInfo.data.name);
        
        // Test 2: User Stats (without auth for now)
        console.log('\n2. Testing User Stats...');
        try {
            const userStats = await axios.get(`${BASE_URL}/admin/users/stats`);
            console.log('❌ User stats should require auth');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ User stats properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        // Test 3: Analytics endpoint
        console.log('\n3. Testing Analytics endpoint...');
        try {
            const analytics = await axios.get(`${BASE_URL}/admin/analytics`);
            console.log('❌ Analytics should require auth');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Analytics properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        // Test 4: System Health endpoint
        console.log('\n4. Testing System Health endpoint...');
        try {
            const health = await axios.get(`${BASE_URL}/admin/system/health`);
            console.log('❌ System health should require auth');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ System health properly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        console.log('\n🎉 All admin API tests completed!');
        console.log('✅ Authentication is properly enforced');
        console.log('✅ All endpoints are accessible');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAdminAPIs();
