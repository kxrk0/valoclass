const https = require('https');

console.log('🌐 Testing potential API endpoints for additional lineup data...');

const baseUrl = 'https://lineupsvalorant.com';
const endpoints = [
  '/api/lineups',
  '/api/lineups/all',
  '/api/data/lineups',
  '/lineups.json',
  '/data/lineups.json',
  '/api/v1/lineups',
  '/ajax/lineups',
  '/get-lineups',
  '/lineups/load',
  '/data.php',
  '/api.php',
  '/loadmore.php',
  // Additional endpoints based on analysis
  '/?format=json',
  '/?ajax=1',
  '/api/search',
  '/load-more',
  '/pagination',
  '/?page=2',
  '/?limit=100',
  '/?offset=20'
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${endpoint}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            // Try to parse as JSON
            const jsonData = JSON.parse(data);
            console.log(`✅ ${endpoint} - JSON data found! (${JSON.stringify(jsonData).length} chars)`);
            
            if (Array.isArray(jsonData)) {
              console.log(`   📊 Array with ${jsonData.length} items`);
            } else if (jsonData.lineups) {
              console.log(`   📊 Object with ${jsonData.lineups.length || 'unknown'} lineups`);
            } else {
              console.log(`   📊 Object with keys: ${Object.keys(jsonData).join(', ')}`);
            }
            
            resolve({ endpoint, success: true, data: jsonData, type: 'json' });
          } catch (e) {
            // Not JSON, check if it's HTML with data
            if (data.includes('lineup-box') || data.includes('data-id')) {
              console.log(`✅ ${endpoint} - HTML with lineup data found! (${data.length} chars)`);
              resolve({ endpoint, success: true, data: data, type: 'html' });
            } else {
              console.log(`❌ ${endpoint} - No relevant data`);
              resolve({ endpoint, success: false });
            }
          }
        } else {
          console.log(`❌ ${endpoint} - HTTP ${res.statusCode}`);
          resolve({ endpoint, success: false, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${endpoint} - Error: ${err.message}`);
      resolve({ endpoint, success: false, error: err.message });
    });
  });
}

// Test all endpoints
async function testAllEndpoints() {
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 ENDPOINT TEST SUMMARY:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎯 SUCCESSFUL ENDPOINTS:');
    successful.forEach(result => {
      console.log(`   ${result.endpoint} (${result.type})`);
    });
    
    // Save successful data
    const fs = require('fs');
    fs.writeFileSync('api-results.json', JSON.stringify(successful, null, 2));
    console.log('\n💾 Successful API results saved to api-results.json');
  }
  
  return results;
}

testAllEndpoints();
