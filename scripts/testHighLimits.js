const https = require('https');
const cheerio = require('cheerio');

console.log('🔍 Testing very high limit parameters to bypass pagination...');

const baseUrl = 'https://lineupsvalorant.com';

// Test extremely high limits
const testUrls = [
  '/?limit=10000',
  '/?limit=9000', 
  '/?limit=8542',  // Exact target number
  '/?limit=5000',
  '/?limit=2000',
  '/?limit=1000',
  '/?all=true',
  '/?show=all',
  '/?per_page=10000',
  '/?count=10000',
  '/?size=10000',
  // API-style endpoints
  '/api?limit=10000',
  '/data?all=true',
  '/export',
  '/dump',
  '/all',
  // Different formats
  '/?format=json&limit=10000',
  '/?output=json',
  '/?export=json',
  // Bypass parameters
  '/?no_pagination=true',
  '/?disable_limit=true',
  '/?unlimited=true'
];

async function testHighLimitUrl(urlPath) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${urlPath}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const $ = cheerio.load(data);
          const lineupCount = $('.lineup-box').length;
          const totalSize = data.length;
          
          // Check if response is different (more data)
          if (lineupCount > 20 || totalSize > 80000) {
            console.log(`🎯 PROMISING: ${urlPath} -> ${lineupCount} lineups (${totalSize} chars)`);
          } else {
            console.log(`   ${urlPath} -> ${lineupCount} lineups (${totalSize} chars)`);
          }
          
          // Check for JSON response
          try {
            const jsonData = JSON.parse(data);
            console.log(`📊 JSON RESPONSE: ${urlPath} -> ${JSON.stringify(jsonData).length} chars`);
          } catch (e) {
            // Not JSON, ignore
          }
          
          resolve({ urlPath, lineupCount, totalSize, status: res.statusCode });
        } else {
          console.log(`❌ ${urlPath} -> HTTP ${res.statusCode}`);
          resolve({ urlPath, lineupCount: 0, totalSize: 0, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${urlPath} -> Error: ${err.message}`);
      resolve({ urlPath, lineupCount: 0, totalSize: 0, error: err.message });
    });
  });
}

async function testAllHighLimits() {
  console.log('🧪 Testing high limit URLs...\n');
  
  const results = [];
  
  for (const urlPath of testUrls) {
    const result = await testHighLimitUrl(urlPath);
    results.push(result);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n📊 SUMMARY:');
  const successful = results.filter(r => r.lineupCount > 20);
  const largeResponses = results.filter(r => r.totalSize > 100000);
  
  console.log(`✅ URLs with >20 lineups: ${successful.length}`);
  console.log(`📈 URLs with large responses: ${largeResponses.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎯 SUCCESSFUL URLS:');
    successful.forEach(result => {
      console.log(`   ${result.urlPath}: ${result.lineupCount} lineups`);
    });
  }
  
  if (largeResponses.length > 0) {
    console.log('\n📈 LARGE RESPONSE URLS:');
    largeResponses.forEach(result => {
      console.log(`   ${result.urlPath}: ${result.totalSize} chars`);
    });
  }
  
  return results;
}

testAllHighLimits().then(results => {
  console.log('\n💡 ANALYSIS:');
  if (results.every(r => r.lineupCount <= 20)) {
    console.log('🤔 All responses returned ≤20 lineups. This suggests:');
    console.log('   1. Site enforces strict pagination limits');
    console.log('   2. Total lineup count might be lower than 8,542');
    console.log('   3. Site uses client-side pagination/infinite scroll');
    console.log('   4. Different data structure or hidden endpoints');
  }
  
  const fs = require('fs');
  fs.writeFileSync('high-limit-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to high-limit-test-results.json');
});
