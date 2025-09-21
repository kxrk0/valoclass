const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('📄 Downloading paginated data using discovered pagination parameters...');

const baseUrl = 'https://lineupsvalorant.com';
const downloadDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

// Pagination strategies to try
const paginationUrls = [];

// 1. Page-based pagination
for (let page = 1; page <= 50; page++) {
  paginationUrls.push(`/?page=${page}`);
}

// 2. Limit-based (higher limits)
const limits = [50, 100, 200, 500, 1000, 2000];
limits.forEach(limit => {
  paginationUrls.push(`/?limit=${limit}`);
});

// 3. Offset-based pagination
for (let offset = 0; offset <= 1000; offset += 20) {
  paginationUrls.push(`/?offset=${offset}`);
}

// 4. Combined parameters
for (let page = 1; page <= 20; page++) {
  limits.forEach(limit => {
    paginationUrls.push(`/?page=${page}&limit=${limit}`);
  });
}

// 5. Agent-specific pagination
const agents = ['Sova', 'Brimstone', 'Viper', 'KAYO', 'Fade', 'Yoru'];
agents.forEach(agent => {
  for (let page = 1; page <= 10; page++) {
    paginationUrls.push(`/?agent=${agent}&page=${page}`);
    paginationUrls.push(`/?agent=${agent}&limit=100`);
    paginationUrls.push(`/?agent=${agent}&offset=${page * 20}`);
  }
});

// 6. Map-specific pagination
const maps = ['Bind', 'Ascent', 'Haven', 'Split', 'Icebox'];
maps.forEach(map => {
  for (let page = 1; page <= 10; page++) {
    paginationUrls.push(`/?map=${map}&page=${page}`);
    paginationUrls.push(`/?map=${map}&limit=100`);
  }
});

console.log(`📋 Generated ${paginationUrls.length} pagination URLs to test`);

// Remove duplicates
const uniqueUrls = [...new Set(paginationUrls)];
console.log(`📋 Unique URLs: ${uniqueUrls.length}`);

let downloadedCount = 0;
let errorCount = 0;
let duplicateCount = 0;

// Function to download a file
function downloadFile(url, filename) {
  return new Promise((resolve) => {
    const filepath = path.join(downloadDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      duplicateCount++;
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          downloadedCount++;
          if (downloadedCount % 50 === 0) {
            console.log(`📥 Downloaded ${downloadedCount}/${uniqueUrls.length} files...`);
          }
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete the file
        errorCount++;
        resolve();
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete the file
      errorCount++;
      resolve();
    });
  });
}

// Download all paginated URLs
async function downloadAllPaginated() {
  console.log('🔽 Starting paginated downloads...');
  
  for (let i = 0; i < uniqueUrls.length; i++) {
    const urlPath = uniqueUrls[i];
    const url = `${baseUrl}${urlPath}`;
    const filename = `pagination${urlPath.replace(/[\/\?&=]/g, '_')}.html`;
    
    try {
      await downloadFile(url, filename);
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ Error downloading ${url}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n✅ PAGINATION DOWNLOAD COMPLETE!');
  console.log(`📊 Total URLs: ${uniqueUrls.length}`);
  console.log(`📥 Downloaded: ${downloadedCount}`);
  console.log(`🔄 Duplicates skipped: ${duplicateCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Files saved to: ${downloadDir}`);
}

downloadAllPaginated();
