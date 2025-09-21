const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

console.log('🖼️ Downloading lineup images directly from HTML files...');

const sourceDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

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
    } else if (!url.startsWith('http')) {
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

// Extract image URLs from HTML
function extractImageUrls(html) {
  const $ = cheerio.load(html);
  const imageUrls = new Set();
  
  // Look for lineup box images
  $('.lineup-box img, .lineup_box img, [data-id] img').each((i, img) => {
    const src = $(img).attr('src');
    if (src && !src.includes('agents/') && !src.includes('abilities/') && !src.includes('ui_icons/')) {
      imageUrls.add(src);
    }
  });
  
  // Look for any images in image containers
  $('.lineups-box-image-div img, .lineup-box-image').each((i, img) => {
    const src = $(img).attr('src');
    if (src) {
      imageUrls.add(src);
    }
  });
  
  return Array.from(imageUrls);
}

// Process all HTML files
async function processAllFiles() {
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.html'));
  console.log(`📁 Found ${files.length} HTML files to process`);
  
  const allImageUrls = new Set();
  
  // Extract all unique image URLs
  files.forEach(filename => {
    try {
      const filepath = path.join(sourceDir, filename);
      const html = fs.readFileSync(filepath, 'utf8');
      const imageUrls = extractImageUrls(html);
      
      imageUrls.forEach(url => allImageUrls.add(url));
      
      if (imageUrls.length > 0) {
        console.log(`📄 ${filename}: Found ${imageUrls.length} image URLs`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${filename}: ${error.message}`);
    }
  });
  
  console.log(`\n🎯 Total unique image URLs found: ${allImageUrls.size}`);
  
  // Download all images
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  
  const imageArray = Array.from(allImageUrls);
  
  for (let i = 0; i < imageArray.length; i++) {
    const imageUrl = imageArray[i];
    
    // Generate local filepath
    const urlPath = imageUrl.replace('https://lineupsvalorant.com', '');
    let localPath = `public/static${urlPath}`;
    
    // Create directory if needed
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const result = await downloadImage(imageUrl, localPath);
    
    if (result.downloaded) {
      downloaded++;
    } else if (result.skipped) {
      skipped++;
    } else {
      errors++;
      console.log(`❌ Failed: ${imageUrl} - ${result.error}`);
    }
    
    if ((downloaded + skipped + errors) % 50 === 0) {
      console.log(`📊 Progress: ${downloaded} downloaded, ${skipped} skipped, ${errors} errors`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✅ Image download complete!');
  console.log(`📥 Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  
  return { downloaded, skipped, errors };
}

// Download essential UI icons
async function downloadEssentialIcons() {
  console.log('\n🎨 Downloading essential UI icons...');
  
  const uiIcons = [
    'more_dots.png',
    'back.png', 
    'forward.png',
    'close.png',
    'copy.svg',
    'save.svg',
    'marker.png',
    'back_material.png',
    'liked.svg',
    'pin.svg',
    'collapse.svg',
    'report.svg',
    'overview.svg',
    'edit.svg',
    'delete.svg',
    'listed.svg',
    'verified.svg'
  ];
  
  for (const iconName of uiIcons) {
    const iconUrl = `https://lineupsvalorant.com/static/ui_icons/${iconName}`;
    const filepath = `public/static/ui_icons/${iconName}`;
    
    const result = await downloadImage(iconUrl, filepath);
    if (result.downloaded) {
      console.log(`✅ UI Icon: ${iconName}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Create a simple SVG placeholder
  const placeholderSvg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#2a2a2a" stroke="#444" stroke-width="1"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">
      Lineup Image
    </text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="#555" text-anchor="middle">
      Not Available
    </text>
  </svg>`;
  
  fs.writeFileSync('public/static/ui_icons/placeholder.svg', placeholderSvg);
  console.log(`✅ Created placeholder.svg`);
}

// Run everything
processAllFiles().then(async (results) => {
  await downloadEssentialIcons();
  
  console.log('\n🎯 SUMMARY:');
  console.log(`📊 Total images processed: ${results.downloaded + results.skipped + results.errors}`);
  console.log(`📥 Successfully downloaded: ${results.downloaded}`);
  console.log(`⏭️  Already existed: ${results.skipped}`);
  console.log(`❌ Failed downloads: ${results.errors}`);
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Test image display on localhost:3003/lineups');
  console.log('2. Continue with extracting missing lineups');
  console.log('3. Focus on setup lineups extraction');
});
