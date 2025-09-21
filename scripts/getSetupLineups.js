const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

console.log('🎯 Focusing on Setup lineups (213 expected) to bridge the gap...');

const baseUrl = 'https://lineupsvalorant.com';
const downloadDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

// Generate setup-specific URLs
const setupUrls = [];

// 1. Basic setup URLs
setupUrls.push('/?type=setup');
setupUrls.push('/?type=setup&limit=500'); // Try high limit for setups

// 2. Setup + Map combinations
const maps = [
  'Abyss', 'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 
  'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset', 'Corrode'
];

maps.forEach(map => {
  setupUrls.push(`/?type=setup&map=${encodeURIComponent(map)}`);
  setupUrls.push(`/?type=setup&map=${encodeURIComponent(map)}&limit=100`);
});

// 3. Setup + Agent combinations
const agents = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Deadlock', 'Fade',
  'Gekko', 'Harbor', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze',
  'Sage', 'Skye', 'Sova', 'Tejo', 'Viper', 'Vyse', 'Yoru'
];

agents.forEach(agent => {
  setupUrls.push(`/?type=setup&agent=${encodeURIComponent(agent)}`);
  setupUrls.push(`/?type=setup&agent=${encodeURIComponent(agent)}&limit=50`);
});

// 4. Setup + Side combinations
const sides = ['attack', 'defense'];
sides.forEach(side => {
  setupUrls.push(`/?type=setup&side=${encodeURIComponent(side)}`);
  setupUrls.push(`/?type=setup&side=${encodeURIComponent(side)}&limit=200`);
});

// 5. Deep pagination for setups
for (let page = 1; page <= 20; page++) {
  setupUrls.push(`/?type=setup&page=${page}`);
}

// 6. Combined setup queries
maps.slice(0, 6).forEach(map => {
  agents.slice(0, 8).forEach(agent => {
    setupUrls.push(`/?type=setup&map=${encodeURIComponent(map)}&agent=${encodeURIComponent(agent)}`);
  });
});

console.log(`📋 Generated ${setupUrls.length} setup-specific URLs`);

// Remove duplicates
const uniqueSetupUrls = [...new Set(setupUrls)];
console.log(`📋 Unique URLs: ${uniqueSetupUrls.length}`);

async function downloadSetupFile(urlPath, filename) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${urlPath}`;
    const filepath = path.join(downloadDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      resolve({ skipped: true });
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ downloaded: true, size: response.headers['content-length'] });
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        resolve({ error: `HTTP ${response.statusCode}` });
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      resolve({ error: err.message });
    });
  });
}

// Download setup-specific files
async function downloadAllSetupFiles() {
  console.log('🔽 Downloading setup-specific files...');
  
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  for (let i = 0; i < uniqueSetupUrls.length; i++) {
    const urlPath = uniqueSetupUrls[i];
    const filename = `setup${urlPath.replace(/[\/\?&=]/g, '_')}.html`;
    
    const result = await downloadSetupFile(urlPath, filename);
    
    if (result.downloaded) downloaded++;
    else if (result.skipped) skipped++;
    else if (result.error) errors++;
    
    if ((downloaded + skipped + errors) % 20 === 0) {
      console.log(`📥 Progress: ${downloaded} downloaded, ${skipped} skipped, ${errors} errors`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  console.log('\n✅ Setup download complete!');
  console.log(`📥 Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  
  return { downloaded, skipped, errors };
}

// Check current setup count in our data
function analyzeCurrentSetups() {
  const dataFile = 'src/data/lineupData.ts';
  
  if (fs.existsSync(dataFile)) {
    const content = fs.readFileSync(dataFile, 'utf8');
    
    // Count setup types
    const setupMatches = content.match(/type: 'setup'/g) || [];
    const lineupMatches = content.match(/type: 'lineup'/g) || [];
    const postPlantMatches = content.match(/type: 'post-plant'/g) || [];
    
    console.log('\n📊 CURRENT DATA ANALYSIS:');
    console.log(`   Setup lineups: ${setupMatches.length} (expected: 213)`);
    console.log(`   Regular lineups: ${lineupMatches.length} (expected: 5,210)`);
    console.log(`   Post-plant lineups: ${postPlantMatches.length}`);
    console.log(`   Total: ${setupMatches.length + lineupMatches.length + postPlantMatches.length} (expected: 5,423)`);
    
    const missing = {
      setups: 213 - setupMatches.length,
      lineups: 5210 - lineupMatches.length,
      total: 5423 - (setupMatches.length + lineupMatches.length + postPlantMatches.length)
    };
    
    console.log('\n🎯 MISSING DATA:');
    console.log(`   Missing setups: ${missing.setups}`);
    console.log(`   Missing lineups: ${missing.lineups}`);
    console.log(`   Missing total: ${missing.total}`);
    
    return missing;
  }
  
  return { setups: 213, lineups: 5210, total: 5423 };
}

// Run analysis and download
analyzeCurrentSetups();
downloadAllSetupFiles().then((results) => {
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Parse the new setup files with our existing parser');
  console.log('2. Focus on finding the remaining regular lineups');
  console.log('3. Check for different HTML structures or hidden content');
});
