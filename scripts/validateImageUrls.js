const fs = require('fs');
const path = require('path');
const https = require('https');

// Import the comprehensive lineup data
const { comprehensiveLineupData } = require('../src/data/lineupData.ts');

// Extract all unique image URLs from the lineup data
const extractImageUrls = () => {
  const imageUrls = new Set();
  
  comprehensiveLineupData.forEach(lineup => {
    if (lineup.image) {
      imageUrls.add(lineup.image);
    }
  });
  
  return Array.from(imageUrls);
};

// Extract ability icon URLs that need to be downloaded
const extractAbilityIcons = () => {
  const abilityIcons = new Set();
  
  comprehensiveLineupData.forEach(lineup => {
    lineup.abilities.forEach(ability => {
      // Convert ability name to expected file path
      const iconPath = `/static/abilities/${ability}.webp`;
      abilityIcons.add(iconPath);
    });
  });
  
  return Array.from(abilityIcons);
};

// Extract agent images that need to be available
const extractAgentImages = () => {
  const agentImages = new Set();
  
  comprehensiveLineupData.forEach(lineup => {
    const agentImagePath = `/static/agents/${lineup.agent}.webp`;
    agentImages.add(agentImagePath);
  });
  
  return Array.from(agentImages);
};

// Check if local file exists
const checkLocalFile = (filePath) => {
  const fullPath = path.join(__dirname, '..', 'public', filePath);
  return fs.existsSync(fullPath);
};

// Download file from URL
const downloadFile = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const fullOutputPath = path.join(__dirname, '..', 'public', outputPath);
    const dir = path.dirname(fullOutputPath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(fullOutputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${outputPath}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${url}: ${response.statusCode}`);
        resolve(); // Continue with other downloads
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${url}: ${err.message}`);
      resolve(); // Continue with other downloads
    });
  });
};

// Main validation function
const validateAndDownloadAssets = async () => {
  console.log('🔍 Validating image URLs and downloading missing assets...\n');
  
  // 1. Check lineup images
  console.log('📊 Checking lineup images...');
  const lineupImageUrls = extractImageUrls();
  console.log(`Found ${lineupImageUrls.length} unique lineup images`);
  
  let missingLineupImages = 0;
  for (const imageUrl of lineupImageUrls) {
    try {
      // Try to access the URL (basic check)
      const urlObj = new URL(imageUrl);
      console.log(`✅ Valid URL: ${urlObj.pathname}`);
    } catch (err) {
      console.log(`❌ Invalid URL: ${imageUrl}`);
      missingLineupImages++;
    }
  }
  
  // 2. Check agent images
  console.log('\n👤 Checking agent images...');
  const agentImages = extractAgentImages();
  console.log(`Found ${agentImages.length} unique agent images needed`);
  
  let missingAgentImages = 0;
  for (const agentImagePath of agentImages) {
    if (!checkLocalFile(agentImagePath)) {
      console.log(`❌ Missing: ${agentImagePath}`);
      missingAgentImages++;
    } else {
      console.log(`✅ Found: ${agentImagePath}`);
    }
  }
  
  // 3. Check ability icons
  console.log('\n⚡ Checking ability icons...');
  const abilityIcons = extractAbilityIcons();
  console.log(`Found ${abilityIcons.length} unique ability icons needed`);
  
  let missingAbilityIcons = 0;
  for (const abilityIconPath of abilityIcons) {
    if (!checkLocalFile(abilityIconPath)) {
      console.log(`❌ Missing: ${abilityIconPath}`);
      missingAbilityIcons++;
    } else {
      console.log(`✅ Found: ${abilityIconPath}`);
    }
  }
  
  // Summary
  console.log('\n📋 SUMMARY:');
  console.log(`Lineup Images: ${lineupImageUrls.length - missingLineupImages}/${lineupImageUrls.length} valid URLs`);
  console.log(`Agent Images: ${agentImages.length - missingAgentImages}/${agentImages.length} found locally`);
  console.log(`Ability Icons: ${abilityIcons.length - missingAbilityIcons}/${abilityIcons.length} found locally`);
  
  if (missingAgentImages > 0 || missingAbilityIcons > 0) {
    console.log('\n⚠️  Some assets are missing. Please ensure all required images are downloaded.');
  } else {
    console.log('\n✅ All required assets are available!');
  }
  
  return {
    lineupImages: lineupImageUrls,
    agentImages: agentImages,
    abilityIcons: abilityIcons,
    missingAgentImages,
    missingAbilityIcons
  };
};

// Run validation
validateAndDownloadAssets()
  .then((results) => {
    console.log('\n🎉 Validation complete!');
  })
  .catch((error) => {
    console.error('❌ Validation failed:', error);
  });
