const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🖼️ Downloading lineup images from LineupsValorant.com...');

// Load our current lineup data
let comprehensiveLineupData = [];
try {
  const dataFile = fs.readFileSync('src/data/lineupData.ts', 'utf8');
  // Extract the array from the TypeScript file
  const arrayMatch = dataFile.match(/export const comprehensiveLineupData[^=]*=\s*(\[[\s\S]*?\]);/);
  if (arrayMatch) {
    const arrayString = arrayMatch[1];
    // Convert TypeScript syntax to valid JSON
    const jsonString = arrayString
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');
    
    try {
      comprehensiveLineupData = JSON.parse(jsonString);
      console.log(`📊 Loaded ${comprehensiveLineupData.length} lineups from data file`);
    } catch (parseError) {
      console.log('⚠️ Could not parse lineup data, using empty array');
    }
  }
} catch (error) {
  console.log('⚠️ Could not read lineup data file');
}

// Create necessary directories
const createDirectories = () => {
  const dirs = [
    'public/static/lineup_images',
    'public/static/setup_images', 
    'public/static/ui_icons'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

createDirectories();

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    if (fs.existsSync(filepath)) {
      resolve({ skipped: true });
      return;
    }
    
    // Handle different URL formats
    let fullUrl = url;
    if (url.startsWith('/')) {
      fullUrl = `https://lineupsvalorant.com${url}`;
    } else if (url.startsWith('http')) {
      fullUrl = url;
    } else {
      resolve({ error: 'Invalid URL format' });
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(fullUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ downloaded: true, size: response.headers['content-length'] });
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        fs.unlink(filepath, () => {});
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (redirectResponse) => {
            if (redirectResponse.statusCode === 200) {
              const newFile = fs.createWriteStream(filepath);
              redirectResponse.pipe(newFile);
              newFile.on('finish', () => {
                newFile.close();
                resolve({ downloaded: true, redirected: true });
              });
            } else {
              resolve({ error: `HTTP ${redirectResponse.statusCode} after redirect` });
            }
          }).on('error', () => resolve({ error: 'Redirect failed' }));
        } else {
          resolve({ error: `HTTP ${response.statusCode} - no redirect location` });
        }
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

// Main download function
async function downloadAllImages() {
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  console.log('\n🔽 Starting lineup image downloads...');
  
  for (let i = 0; i < comprehensiveLineupData.length; i++) {
    const lineup = comprehensiveLineupData[i];
    
    if (lineup.image) {
      // Determine file extension
      let extension = '.webp';
      if (lineup.image.includes('.jpg') || lineup.image.includes('.jpeg')) {
        extension = '.jpg';
      } else if (lineup.image.includes('.png')) {
        extension = '.png';
      }
      
      // Create lineup-specific directory
      const lineupDir = `public/static/lineup_images/${lineup.id}`;
      if (!fs.existsSync(lineupDir)) {
        fs.mkdirSync(lineupDir, { recursive: true });
      }
      
      // Download main image as cover
      const filepath = path.join(lineupDir, `cover${extension}`);
      const result = await downloadImage(lineup.image, filepath);
      
      if (result.downloaded) {
        downloaded++;
        console.log(`✅ Downloaded: ${lineup.id} - ${lineup.title.substring(0, 50)}...`);
      } else if (result.skipped) {
        skipped++;
      } else {
        errors++;
        console.log(`❌ Failed: ${lineup.id} - ${result.error}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if ((downloaded + skipped + errors) % 50 === 0) {
        console.log(`📊 Progress: ${downloaded} downloaded, ${skipped} skipped, ${errors} errors`);
      }
    }
  }
  
  console.log('\n✅ Image download complete!');
  console.log(`📥 Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  
  // Download essential UI icons
  console.log('\n🎨 Downloading essential UI icons...');
  
  const uiIcons = [
    'https://lineupsvalorant.com/static/ui_icons/more_dots.png',
    'https://lineupsvalorant.com/static/ui_icons/back.png',
    'https://lineupsvalorant.com/static/ui_icons/forward.png',
    'https://lineupsvalorant.com/static/ui_icons/close.png',
    'https://lineupsvalorant.com/static/ui_icons/copy.svg',
    'https://lineupsvalorant.com/static/ui_icons/save.svg',
    'https://lineupsvalorant.com/static/ui_icons/marker.png'
  ];
  
  for (const iconUrl of uiIcons) {
    const filename = path.basename(iconUrl);
    const filepath = `public/static/ui_icons/${filename}`;
    
    const result = await downloadImage(iconUrl, filepath);
    if (result.downloaded) {
      console.log(`✅ UI Icon: ${filename}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Create a simple placeholder image for missing images
  console.log('\n🖼️ Creating placeholder image...');
  
  const placeholderSvg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a1a"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" dy=".3em">
      Image Not Available
    </text>
  </svg>`;
  
  fs.writeFileSync('public/static/ui_icons/placeholder.png', placeholderSvg);
  
  return { downloaded, skipped, errors };
}

downloadAllImages().then((results) => {
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Update lineup data to use local image paths');
  console.log('2. Test image display on the website');
  console.log('3. Continue with extracting missing lineups');
});
