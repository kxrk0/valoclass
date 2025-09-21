const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('🚀 Starting comprehensive lineup parsing from LineupsValorant.com files...');

const sourceDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';
const outputFile = 'src/data/lineupData.ts';

// Get all HTML files
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.html'));
console.log(`📁 Found ${files.length} HTML files to parse`);

const allLineups = [];
const seenIds = new Set();

// Function to extract lineup data from HTML
function extractLineupsFromHTML(html, filename) {
  const $ = cheerio.load(html);
  const lineups = [];
  
  // Look for lineup boxes (multiple possible selectors)
  const lineupSelectors = [
    '.lineup-box',
    '.lineup_box',
    '[data-id]',
    'a[href*="/?id="]',
    '.lineups-box',
    'div[data-type]'
  ];
  
  let lineupElements = $();
  for (const selector of lineupSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      lineupElements = elements;
      break;
    }
  }
  
  lineupElements.each((i, element) => {
    try {
      const $el = $(element);
      
      // Extract basic info
      const dataId = $el.attr('data-id') || $el.find('[data-id]').attr('data-id');
      const dataType = $el.attr('data-type') || $el.find('[data-type]').attr('data-type');
      
      // Extract title
      const title = $el.find('.lineup-box-title, .lineup_box_title, h3, .title').text().trim() ||
                   $el.find('img').attr('alt') || 
                   'Unknown Lineup';
      
      // Extract agent info
      const agentImg = $el.find('.lineup-box-agent img, .agent img, img[src*="/agents/"]');
      let agent = 'Unknown';
      if (agentImg.length > 0) {
        const agentSrc = agentImg.attr('src') || '';
        const agentMatch = agentSrc.match(/\/agents\/([^\/\.]+)/);
        if (agentMatch) {
          agent = agentMatch[1];
        }
      }
      
      // Extract abilities
      const abilities = [];
      $el.find('.lineup-box-abilities img, .abilities img, img[src*="/abilities/"]').each((j, abilityImg) => {
        const abilitySrc = $(abilityImg).attr('src') || '';
        const abilityMatch = abilitySrc.match(/\/abilities\/([^\/\.]+)/);
        if (abilityMatch) {
          abilities.push(abilityMatch[1].replace(/\.(webp|png|jpg)$/, ''));
        }
      });
      
      // Extract map info from filename or content
      let map = 'Unknown';
      const mapMatch = filename.match(/map=([^&]+)/);
      if (mapMatch) {
        map = decodeURIComponent(mapMatch[1]);
      }
      
      // Extract locations
      const position = $el.find('.lineup-box-position, .position').text().trim();
      let from = 'Unknown';
      let to = 'Unknown';
      
      if (position.includes('From') && position.includes('to')) {
        const fromMatch = position.match(/From\s+([^t]+?)\s+to/i);
        const toMatch = position.match(/to\s+(.+?)(?:\s|$)/i);
        if (fromMatch) from = fromMatch[1].trim();
        if (toMatch) to = toMatch[1].trim();
      }
      
      // Extract image
      const mainImg = $el.find('.lineup-box-image, .main-image, img').first();
      const image = mainImg.attr('src') || mainImg.attr('data-src') || '';
      
      // Extract description
      const description = $el.find('.description, .lineup-description').text().trim() || 
                         position || 
                         `${from} to ${to}`;
      
      // Generate unique ID
      const uniqueId = dataId || `${agent}-${map}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      
      if (!seenIds.has(uniqueId) && title !== 'Unknown Lineup' && agent !== 'Unknown') {
        seenIds.add(uniqueId);
        
        lineups.push({
          id: uniqueId,
          type: dataType || 'lineup',
          agent: agent,
          abilities: abilities.length > 0 ? abilities : ['Unknown'],
          title: title,
          description: description,
          from: from,
          to: to,
          image: image.startsWith('http') ? image : `https://lineupsvalorant.com${image}`,
          map: map,
          tags: []
        });
      }
      
    } catch (error) {
      console.log(`⚠️  Error parsing lineup ${i} in ${filename}:`, error.message);
    }
  });
  
  return lineups;
}

// Process all files
let totalProcessed = 0;
for (const filename of files) {
  try {
    const filePath = path.join(sourceDir, filename);
    const html = fs.readFileSync(filePath, 'utf8');
    
    const lineups = extractLineupsFromHTML(html, filename);
    allLineups.push(...lineups);
    
    if (lineups.length > 0) {
      console.log(`📄 ${filename}: Found ${lineups.length} lineups`);
    }
    
    totalProcessed++;
    if (totalProcessed % 50 === 0) {
      console.log(`🔄 Processed ${totalProcessed}/${files.length} files... Found ${allLineups.length} lineups so far`);
    }
    
  } catch (error) {
    console.log(`❌ Error reading ${filename}:`, error.message);
  }
}

console.log(`\n✅ Processing complete!`);
console.log(`📊 Total files processed: ${totalProcessed}`);
console.log(`📊 Total lineups found: ${allLineups.length}`);
console.log(`📊 Unique lineups: ${seenIds.size}`);

// Group by agent
const byAgent = {};
allLineups.forEach(lineup => {
  if (!byAgent[lineup.agent]) byAgent[lineup.agent] = 0;
  byAgent[lineup.agent]++;
});

console.log('\n📈 Lineups by agent:');
Object.entries(byAgent)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([agent, count]) => {
    console.log(`   ${agent}: ${count}`);
  });

// Generate TypeScript file
const tsContent = `// Comprehensive lineup data extracted from LineupsValorant.com
// Total: ${allLineups.length} lineups
// Generated: ${new Date().toISOString()}

interface LineupData {
  id: string
  type: 'lineup' | 'setup' | 'post-plant'
  agent: string
  abilities: string[]
  title: string
  description: string
  from: string
  to: string
  image: string
  map: string
  tags?: string[]
}

export const comprehensiveLineupData: LineupData[] = ${JSON.stringify(allLineups, null, 2)};

// Stats
export const lineupStats = {
  total: ${allLineups.length},
  byAgent: ${JSON.stringify(byAgent, null, 2)},
  extractedAt: "${new Date().toISOString()}"
};
`;

// Write to file
fs.writeFileSync(outputFile, tsContent);
console.log(`\n💾 Saved ${allLineups.length} lineups to ${outputFile}`);

// Final summary
console.log('\n🎉 EXTRACTION COMPLETE!');
console.log(`🎯 Target: 8542 lineups`);
console.log(`📊 Found: ${allLineups.length} lineups`);
console.log(`📈 Coverage: ${((allLineups.length / 8542) * 100).toFixed(1)}%`);

if (allLineups.length < 8542) {
  console.log('\n💡 If count is still low, we may need to:');
  console.log('   - Check different HTML selectors');
  console.log('   - Look for AJAX-loaded content');
  console.log('   - Parse JavaScript data objects');
  console.log('   - Download additional pages');
}
