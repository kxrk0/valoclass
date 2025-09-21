const fs = require('fs');
const path = require('path');
const https = require('https');

// Sample lineup data to check (extracted from our comprehensive data)
const sampleLineupData = [
  // Astra
  {
    id: 'astra-1',
    agent: 'Astra',
    abilities: ['Gravity Well'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/astra-1/3.webp',
  },
  {
    id: 'astra-2',
    agent: 'Astra',
    abilities: ['Gravity Well'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/astra-2/3.webp',
  },
  // Breach
  {
    id: 'breach-1',
    agent: 'Breach',
    abilities: ['Fault Line'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/breach-1/3.webp',
  },
  {
    id: 'breach-2',
    agent: 'Breach',
    abilities: ['Aftershock'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/breach-2/3.webp',
  },
  // Brimstone
  {
    id: 'brim-1',
    agent: 'Brimstone',
    abilities: ['Incendiary'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/brim-1/3.webp',
  },
  {
    id: 'brim-2',
    agent: 'Brimstone',
    abilities: ['Incendiary'],
    image: 'https://lineupsvalorant.com/static/lineup_images_thumbnail/brim-2/3.webp',
  },
  // Add more as needed...
];

// All agents that need images
const allAgents = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Deadlock', 'Fade',
  'Gekko', 'Harbor', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze',
  'Sage', 'Skye', 'Sova', 'Tejo', 'Viper', 'Vyse', 'Yoru'
];

// All abilities that need icons (from our getAgentAbilities function)
const allAbilities = [
  // Common abilities found in lineups
  'Gravity Well', 'Nova Pulse', 'Nebula', 'Cosmic Divide',
  'Aftershock', 'Flashpoint', 'Fault Line', 'Rolling Thunder',
  'Incendiary', 'Stim Beacon', 'Sky Smoke', 'Orbital Strike',
  'Trademark', 'Headhunter', 'Rendezvous', 'Tour De Force',
  'Trapwire', 'Cyber Cage', 'Spycam', 'Neural Theft',
  'GravNet', 'Sonic Sensor', 'Barrier Mesh', 'Annihilation',
  'Prowler', 'Seize', 'Haunts', 'Nightfall',
  'Mosh Pit', 'Wingman', 'Dizzy', 'Thrash',
  'Cascade', 'Cove', 'High Tide', 'Reckoning',
  'FRAG/ment', 'FLASH/drive', 'ZERO/point', 'NULL/cmd',
  'Alarmbot', 'Turret', 'Nanoswarm', 'Lockdown',
  'Fast Lane', 'Relay Bolt', 'High Gear', 'Overdrive',
  'Shrouded Step', 'Paranoia', 'Dark Cover', 'From The Shadows',
  'Blaze', 'Curveball', 'Hot Hands', 'Run It Back',
  'Boom Bot', 'Blast Pack', 'Paint Shells', 'Showstopper',
  'Barrier Orb', 'Slow Orb', 'Healing Orb', 'Resurrection',
  'Regrowth', 'Trailblazer', 'Guiding Light', 'Seekers',
  'Owl Drone', 'Shock Bolt', 'Recon Bolt', 'Hunters Fury',
  'Steady Aim', 'Dimensional Drift',
  'Snake Bite', 'Poison Cloud', 'Toxic Screen', 'Vipers Pit',
  'Shear', 'Arc Rose', 'Razorvine', 'Steel Garden',
  'Fakeout', 'Blindside', 'Gatecrash'
];

// Check if local file exists
const checkLocalFile = (filePath) => {
  const fullPath = path.join(__dirname, '..', 'public', filePath);
  return fs.existsSync(fullPath);
};

// Check if URL is accessible
const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      resolve(response.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
};

// Main validation function
const validateAssets = async () => {
  console.log('🔍 Validating assets for LineupsValorant integration...\n');
  
  // 1. Check agent images
  console.log('👤 Checking agent images...');
  let foundAgents = 0;
  let missingAgents = [];
  
  for (const agent of allAgents) {
    const agentImagePath = `/static/agents/${agent}.webp`;
    if (checkLocalFile(agentImagePath)) {
      console.log(`✅ Found: ${agentImagePath}`);
      foundAgents++;
    } else {
      console.log(`❌ Missing: ${agentImagePath}`);
      missingAgents.push(agent);
    }
  }
  
  // 2. Check ability icons
  console.log('\n⚡ Checking ability icons...');
  let foundAbilities = 0;
  let missingAbilities = [];
  
  for (const ability of allAbilities) {
    const abilityIconPath = `/static/abilities/${ability}.webp`;
    if (checkLocalFile(abilityIconPath)) {
      console.log(`✅ Found: ${abilityIconPath}`);
      foundAbilities++;
    } else {
      console.log(`❌ Missing: ${abilityIconPath}`);
      missingAbilities.push(ability);
    }
  }
  
  // 3. Check a few sample lineup images (external URLs)
  console.log('\n📊 Checking sample lineup images...');
  let accessibleLineupImages = 0;
  
  for (const lineup of sampleLineupData.slice(0, 5)) { // Check first 5
    const isAccessible = await checkUrl(lineup.image);
    if (isAccessible) {
      console.log(`✅ Accessible: ${lineup.image}`);
      accessibleLineupImages++;
    } else {
      console.log(`❌ Not accessible: ${lineup.image}`);
    }
  }
  
  // 4. Check UI icons
  console.log('\n🎨 Checking UI icons...');
  const uiIcons = ['marker.png', 'more_dots.png'];
  let foundUiIcons = 0;
  
  for (const icon of uiIcons) {
    const iconPath = `/static/ui_icons/${icon}`;
    if (checkLocalFile(iconPath)) {
      console.log(`✅ Found: ${iconPath}`);
      foundUiIcons++;
    } else {
      console.log(`❌ Missing: ${iconPath}`);
    }
  }
  
  // 5. Check map images
  console.log('\n🗺️ Checking map images...');
  const maps = ['bind', 'ascent', 'haven', 'split', 'icebox', 'breeze', 'fracture', 'pearl', 'lotus', 'sunset'];
  let foundMaps = 0;
  
  for (const map of maps) {
    const mapImagePath = `/static/maps/${map}/minimap.webp`;
    if (checkLocalFile(mapImagePath)) {
      console.log(`✅ Found: ${mapImagePath}`);
      foundMaps++;
    } else {
      console.log(`❌ Missing: ${mapImagePath}`);
    }
  }
  
  // Summary
  console.log('\n📋 ASSET VALIDATION SUMMARY:');
  console.log(`Agent Images: ${foundAgents}/${allAgents.length} found`);
  console.log(`Ability Icons: ${foundAbilities}/${allAbilities.length} found`);
  console.log(`Lineup Images: ${accessibleLineupImages}/${sampleLineupData.slice(0, 5).length} accessible`);
  console.log(`UI Icons: ${foundUiIcons}/${uiIcons.length} found`);
  console.log(`Map Images: ${foundMaps}/${maps.length} found`);
  
  if (missingAgents.length > 0) {
    console.log('\n❌ Missing Agent Images:');
    missingAgents.forEach(agent => console.log(`   - ${agent}.webp`));
  }
  
  if (missingAbilities.length > 0) {
    console.log('\n❌ Missing Ability Icons (first 10):');
    missingAbilities.slice(0, 10).forEach(ability => console.log(`   - ${ability}.webp`));
    if (missingAbilities.length > 10) {
      console.log(`   ... and ${missingAbilities.length - 10} more`);
    }
  }
  
  const totalAssets = allAgents.length + allAbilities.length + uiIcons.length + maps.length;
  const foundAssets = foundAgents + foundAbilities + foundUiIcons + foundMaps;
  const completionPercentage = Math.round((foundAssets / totalAssets) * 100);
  
  console.log(`\n📊 Overall Completion: ${foundAssets}/${totalAssets} (${completionPercentage}%)`);
  
  if (completionPercentage >= 80) {
    console.log('✅ Good! Most assets are available.');
  } else if (completionPercentage >= 50) {
    console.log('⚠️  Moderate asset coverage. Consider downloading missing images.');
  } else {
    console.log('❌ Low asset coverage. Many images are missing.');
  }
  
  return {
    agentsFound: foundAgents,
    abilitiesFound: foundAbilities,
    completionPercentage
  };
};

// Run validation
validateAssets()
  .then((results) => {
    console.log('\n🎉 Asset validation complete!');
  })
  .catch((error) => {
    console.error('❌ Validation failed:', error);
  });
