const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

console.log('🚀 Starting comprehensive site download from LineupsValorant.com...');

const baseUrl = 'https://lineupsvalorant.com';
const downloadDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

// All maps from the site
const maps = [
  'Abyss', 'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 
  'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset', 'Corrode'
];

// Common locations per map (comprehensive list)
const locationsByMap = {
  'Abyss': [
    'A Bridge', 'A Link', 'A Lobby', 'A Main', 'A Security', 'A Site', 'A Tower', 
    'Attackers', 'B Danger', 'B Link', 'B Lobby', 'B Main', 'B Nest', 'B Site', 
    'B Tower', 'Defenders', 'Mid Bottom', 'Mid Catwalk', 'Mid Library', 'Mid Top',
    'A Secret', 'A Vent'
  ],
  'Ascent': [
    'A Door', 'A Front', 'A Garden', 'A Generator', 'A Link', 'A Lobby', 'A Main', 
    'A Rafters', 'A Site', 'A Wine', 'Attackers', 'B Back', 'B Front', 'B Lane', 
    'B Lobby', 'B Logs', 'B Main', 'B Site', 'B Stairs', 'Boathouse', 'Defenders', 
    'Mid Bottom', 'Mid Catwalk', 'Mid Courtyard', 'Mid Cubby', 'Mid Link', 
    'Mid Market', 'Mid Pizza', 'Mid Top', 'A Window', 'A Boxes', 'A Hell', 'A Heaven'
  ],
  'Bind': [
    'A Boxes', 'A Cubby', 'A Exit', 'A Gate', 'A Lamps', 'A Lobby', 'A Short', 
    'A Showers', 'A Site', 'A Teleporter', 'A Tower', 'A Truck', 'Attackers', 
    'B Elbow', 'B Exit', 'B Front', 'B Garden', 'B Hall', 'B Link', 'B Lobby', 
    'B Long', 'B Short', 'B Site', 'B Teleporter', 'B Window', 'Defenders', 
    'Wood Box', 'A Link', 'A Vents', 'Cave', 'Hookah'
  ],
  'Breeze': [
    'A Cave', 'A Hall', 'A Lobby', 'A Main', 'A Ramp', 'A Site', 'Attackers', 
    'B Elbow', 'B Main', 'B Site', 'B Tunnel', 'Defenders', 'Mid', 'Mid Bottom', 
    'Mid Cannon', 'Mid Doors', 'Mid Nest', 'Mid Pillar', 'Mid Top', 'Mid Wood'
  ],
  'Fracture': [
    'A Drop', 'A Hall', 'A Main', 'A Ramp', 'A Site', 'Attacker Side Spawn', 
    'B Arcade', 'B Main', 'B Ramp', 'B Site', 'B Tower', 'B Tunnel', 
    'Defender Side Spawn', 'Dish', 'Mid', 'A Rope', 'A Default'
  ],
  'Haven': [
    'A Heaven', 'A Hell', 'A Link', 'A Lobby', 'A Long', 'A Main', 'A Short', 
    'A Site', 'Attackers', 'B Main', 'B Site', 'Bottom Mid', 'C Cubby', 
    'C Garage', 'C Link', 'C Lobby', 'C Logs', 'C Long', 'C Site', 'Defenders', 
    'Mid Courtyard', 'Mid Window', 'Backsite B', 'Mid Doors', 'Sewers', 'C Window'
  ],
  'Icebox': [
    'A Belt', 'A Main', 'A Nest', 'A Ramp', 'A Screens', 'A Site', 'Attackers', 
    'B Green', 'B Hall', 'B Main', 'B Ramp', 'B Site', 'B Snowman', 'B Yellow', 
    'Defenders', 'Kitchen', 'Mid', 'Mid Orange', 'Mid Pallet', 'Mid Top', 'Tube'
  ],
  'Lotus': [
    'A Drop', 'A Link', 'A Main', 'A Root', 'A Site', 'A Top', 'A Tree', 
    'Attackers', 'B Link', 'B Lobby', 'B Main', 'B Pillars', 'B Site', 'B Upper', 
    'C Bend', 'C Gravel', 'C Link', 'C Lobby', 'C Mound', 'C Site', 'C Stairs', 
    'Defenders'
  ],
  'Pearl': [
    'A Art', 'A Flowers', 'A Link', 'A Long', 'A Main', 'A Ramp', 'A Secret', 
    'A Site', 'A Stairs', 'Attackers', 'B Club', 'B Hall', 'B Link', 'B Long', 
    'B Main', 'B Ramp', 'B Screen', 'B Site', 'B Tower', 'B Tunnel', 'Defenders', 
    'Mid Connector', 'Mid Doors', 'Mid Plaza', 'Mid Top'
  ],
  'Split': [
    'A Heaven', 'A Hell', 'A Lobby', 'A Main', 'A Ramp', 'A Screens', 'A Site', 
    'Attackers', 'B Heaven', 'B Hell', 'B Lobby', 'B Main', 'B Ramp', 'B Site', 
    'Defenders', 'Mid', 'Mid Bottom', 'Mid Mail', 'Mid Top', 'Sewers', 'Vent'
  ],
  'Sunset': [
    'A Alley', 'A Elbow', 'A Link', 'A Lobby', 'A Main', 'A Site', 'A Top', 
    'Attacker Spawn', 'B Boba', 'B Lobby', 'B Main', 'B Market', 'B Site', 
    'B Site Plant', 'Defender Spawn', 'Mid Bottom', 'Mid Courtyard', 'Mid Tile', 
    'Mid Top'
  ],
  'Corrode': [
    'A Back', 'A Crane', 'A Elbow', 'A Front', 'A Link', 'A Lobby', 'A Main', 
    'A Pocket', 'A Site', 'A Yard', 'Attacker Side Spawn', 'B Arch', 'B Elbow', 
    'B Link', 'B Lobby', 'B Main', 'B Site', 'B Tower', 'Mid Bottom', 'Mid Stairs', 
    'Mid Top', 'Mid Window'
  ]
};

// All agents
const agents = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Deadlock', 'Fade', 
  'Gekko', 'Harbor', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 
  'Sage', 'Skye', 'Sova', 'Tejo', 'Viper', 'Vyse', 'Yoru'
];

// Types and sides
const types = ['lineup', 'setup', 'post-plant'];
const sides = ['defense', 'attack'];

let totalUrls = 0;
let downloadedCount = 0;
let errorCount = 0;

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          downloadedCount++;
          if (downloadedCount % 100 === 0) {
            console.log(`📥 Downloaded ${downloadedCount}/${totalUrls} files...`);
          }
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete the file
        errorCount++;
        resolve(); // Don't reject, just continue
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete the file
      errorCount++;
      resolve(); // Don't reject, just continue
    });
  });
}

// Generate all possible URLs
const urlsToDownload = [];

// 1. Main page
urlsToDownload.push({
  url: baseUrl,
  filename: 'index.html'
});

// 2. All map combinations
maps.forEach(map => {
  const locations = locationsByMap[map] || [];
  
  // Map only
  urlsToDownload.push({
    url: `${baseUrl}/?map=${encodeURIComponent(map)}`,
    filename: `index.html@map=${map}.html`
  });
  
  // Map + start location
  locations.forEach(startLoc => {
    urlsToDownload.push({
      url: `${baseUrl}/?map=${encodeURIComponent(map)}&start=${encodeURIComponent(startLoc)}`,
      filename: `index.html@map=${map}&start=${startLoc}.html`
    });
  });
  
  // Map + end location
  locations.forEach(endLoc => {
    urlsToDownload.push({
      url: `${baseUrl}/?map=${encodeURIComponent(map)}&end=${encodeURIComponent(endLoc)}`,
      filename: `index.html@map=${map}&end=${endLoc}.html`
    });
  });
  
  // Map + agent
  agents.forEach(agent => {
    urlsToDownload.push({
      url: `${baseUrl}/?map=${encodeURIComponent(map)}&agent=${encodeURIComponent(agent)}`,
      filename: `index.html@map=${map}&agent=${agent}.html`
    });
  });
});

// 3. Agent combinations
agents.forEach(agent => {
  urlsToDownload.push({
    url: `${baseUrl}/?agent=${encodeURIComponent(agent)}`,
    filename: `index.html@agent=${agent}.html`
  });
});

// 4. Type combinations
types.forEach(type => {
  urlsToDownload.push({
    url: `${baseUrl}/?type=${encodeURIComponent(type)}`,
    filename: `index.html@type=${type}.html`
  });
});

// 5. Side combinations
sides.forEach(side => {
  urlsToDownload.push({
    url: `${baseUrl}/?side=${encodeURIComponent(side)}`,
    filename: `index.html@side=${side}.html`
  });
});

console.log(`📋 Generated ${urlsToDownload.length} URLs to download`);
totalUrls = urlsToDownload.length;

// Ensure download directory exists
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Download all files (with rate limiting)
async function downloadAll() {
  console.log('🔽 Starting downloads...');
  
  for (let i = 0; i < urlsToDownload.length; i++) {
    const { url, filename } = urlsToDownload[i];
    const filepath = path.join(downloadDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      downloadedCount++;
      continue;
    }
    
    try {
      await downloadFile(url, filepath);
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ Error downloading ${url}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n✅ DOWNLOAD COMPLETE!');
  console.log(`📊 Total URLs: ${totalUrls}`);
  console.log(`📥 Downloaded: ${downloadedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Files saved to: ${downloadDir}`);
}

downloadAll();
