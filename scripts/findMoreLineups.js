const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

console.log('🔍 Finding more lineups with comprehensive strategies...');

const baseUrl = 'https://lineupsvalorant.com';
const downloadDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

// Test different selector combinations
function testNewSelectors(html, filename) {
  const $ = cheerio.load(html);
  const results = {};
  
  // Current working selectors
  const workingSelectors = [
    '.lineup-box',
    '.lineup_box',
    '[data-id]',
    'a[href*="/?id="]'
  ];
  
  // New selectors to try
  const newSelectors = [
    '.lineup-card',
    '.lineup-item', 
    '.lineup-container',
    '[data-lineup-id]',
    '[data-lineup]',
    'article[data-id]',
    '.card[data-id]',
    '.item[data-id]',
    'img[src*="lineup"]',
    'img[alt*="lineup"]',
    'img[src*="image"]',
    'a[href*="id="]',
    'a[href*="lineup"]',
    '[class*="card"][data-id]',
    '[class*="item"][data-id]',
    '[class*="box"][data-id]',
    // Additional experimental selectors
    '.result',
    '.grid-item',
    '.content-item',
    '[data-result]',
    '[id*="lineup"]',
    '.lineup',
    '.guide',
    '.strategy'
  ];
  
  // Test each selector
  [...workingSelectors, ...newSelectors].forEach(selector => {
    try {
      const elements = $(selector);
      if (elements.length > 0) {
        results[selector] = elements.length;
      }
    } catch (e) {
      // Invalid selector, skip
    }
  });
  
  return results;
}

// Test selectors on a sample file
const sampleFile = path.join(downloadDir, 'index.html');
if (fs.existsSync(sampleFile)) {
  console.log('📊 Testing selectors on sample file...');
  const html = fs.readFileSync(sampleFile, 'utf8');
  const selectorResults = testNewSelectors(html, 'index.html');
  
  console.log('🎯 Selector test results:');
  Object.entries(selectorResults)
    .sort(([,a], [,b]) => b - a)
    .forEach(([selector, count]) => {
      console.log(`   ${count} elements: ${selector}`);
    });
}

// Generate more comprehensive URL combinations
const moreUrls = [];

// 1. Ability-specific URLs
const abilities = [
  'Aftershock', 'Incendiary', 'Trademark', 'Trapwire', 'Cyber Cage', 'Spycam',
  'GravNet', 'Sonic Sensor', 'Barrier Mesh', 'Annihilation', 'Seize', 'Haunt',
  'Mosh Pit', 'Dizzy', 'Cove', 'FRAG/ment', 'FLASH/drive', 'ZERO/point',
  'Nanoswarm', 'Relay Bolt', 'Dark Cover', 'Hot Hands', 'Boom Bot', 'Paint Shells',
  'Barrier Orb', 'Slow Orb', 'Shock Bolt', 'Recon Bolt', 'Special Delivery',
  'Snake Bite', 'Poison Cloud', 'Toxic Screen', 'Vipers Pit', 'Razorvine',
  'Fakeout', 'Blindside', 'Gatecrash'
];

abilities.forEach(ability => {
  moreUrls.push(`/?ability=${encodeURIComponent(ability)}`);
  moreUrls.push(`/?ability=${encodeURIComponent(ability)}&limit=100`);
});

// 2. Type and side combinations
const types = ['lineup', 'setup', 'post-plant'];
const sides = ['attack', 'defense'];

types.forEach(type => {
  moreUrls.push(`/?type=${type}`);
  moreUrls.push(`/?type=${type}&limit=100`);
  
  sides.forEach(side => {
    moreUrls.push(`/?type=${type}&side=${side}`);
    moreUrls.push(`/?type=${type}&side=${side}&limit=100`);
  });
});

// 3. Combined complex queries
const maps = ['Bind', 'Ascent', 'Haven', 'Split', 'Icebox', 'Breeze'];
const agents = ['Sova', 'Brimstone', 'Viper', 'KAYO', 'Fade'];

maps.forEach(map => {
  agents.forEach(agent => {
    abilities.slice(0, 5).forEach(ability => { // Limit to first 5 abilities
      moreUrls.push(`/?map=${map}&agent=${agent}&ability=${encodeURIComponent(ability)}`);
    });
  });
});

// 4. High limit queries
const highLimits = [200, 500, 1000, 2000, 5000];
highLimits.forEach(limit => {
  moreUrls.push(`/?limit=${limit}`);
  moreUrls.push(`/?limit=${limit}&sort=date`);
  moreUrls.push(`/?limit=${limit}&sort=popular`);
});

// 5. Deep pagination
for (let page = 10; page <= 100; page += 10) {
  moreUrls.push(`/?page=${page}`);
  moreUrls.push(`/?page=${page}&limit=100`);
}

console.log(`📋 Generated ${moreUrls.length} additional URLs to test`);

// Remove duplicates and filter
const uniqueUrls = [...new Set(moreUrls)];
console.log(`📋 Unique URLs: ${uniqueUrls.length}`);

// Sample test a few URLs to see if they return different data
async function testSampleUrls() {
  console.log('\n🧪 Testing sample URLs for new data...');
  const sampleUrls = uniqueUrls.slice(0, 10); // Test first 10
  
  for (const urlPath of sampleUrls) {
    try {
      const url = `${baseUrl}${urlPath}`;
      
      await new Promise((resolve) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) {
              const $ = cheerio.load(data);
              const lineupCount = $('.lineup-box').length;
              console.log(`   ${urlPath}: ${lineupCount} lineups (${data.length} chars)`);
            } else {
              console.log(`   ${urlPath}: HTTP ${res.statusCode}`);
            }
            resolve();
          });
        }).on('error', () => {
          console.log(`   ${urlPath}: Error`);
          resolve();
        });
        
        // Rate limiting
        setTimeout(resolve, 500);
      });
      
    } catch (error) {
      console.log(`   ${urlPath}: Exception`);
    }
  }
}

// Run the test
testSampleUrls().then(() => {
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Download the most promising URLs');
  console.log('2. Use higher limit parameters (limit=1000, limit=5000)');
  console.log('3. Test ability-specific combinations');
  console.log('4. Check if site has API documentation');
  
  // Save URLs for bulk download
  fs.writeFileSync('additional-urls.json', JSON.stringify(uniqueUrls, null, 2));
  console.log('\n💾 Additional URLs saved to additional-urls.json');
});
