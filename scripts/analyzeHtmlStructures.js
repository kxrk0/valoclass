const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('🔍 Analyzing HTML structures to find missed lineups...');

const sourceDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';

// Sample different types of files to analyze structure
const sampleFiles = [
  'index.html',
  'pagination_page_10.html',
  'pagination_limit_100.html',
  'pagination_agent_Sova&limit_100.html'
];

// Current selectors we use
const currentSelectors = [
  '.lineup-box',
  '.lineup_box',
  '[data-id]',
  'a[href*="/?id="]',
  '.lineups-box',
  'div[data-type]'
];

function analyzeHtmlStructure(html, filename) {
  const $ = cheerio.load(html);
  const analysis = {
    filename,
    totalElements: $('*').length,
    possibleLineupElements: {},
    dataAttributes: {},
    imageElements: {},
    linkElements: {}
  };
  
  // 1. Find all elements with 'lineup' in class/id/data attributes
  $('[class*="lineup"], [id*="lineup"], [data*="lineup"]').each((i, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const classes = $el.attr('class') || '';
    const id = $el.attr('id') || '';
    const dataAttrs = Object.keys(el.attribs).filter(attr => attr.startsWith('data-'));
    
    const key = `${tag}.${classes}#${id}[${dataAttrs.join(',')}]`;
    analysis.possibleLineupElements[key] = (analysis.possibleLineupElements[key] || 0) + 1;
  });
  
  // 2. Find elements with data-id, data-type, etc.
  $('[data-id], [data-type], [data-agent], [data-map]').each((i, el) => {
    const $el = $(el);
    const dataId = $el.attr('data-id');
    const dataType = $el.attr('data-type');
    const dataAgent = $el.attr('data-agent');
    const dataMap = $el.attr('data-map');
    
    if (dataId || dataType || dataAgent || dataMap) {
      const key = `data-id:${dataId} data-type:${dataType} data-agent:${dataAgent} data-map:${dataMap}`;
      analysis.dataAttributes[key] = (analysis.dataAttributes[key] || 0) + 1;
    }
  });
  
  // 3. Find images that might be lineup images
  $('img').each((i, img) => {
    const src = $(img).attr('src') || '';
    const alt = $(img).attr('alt') || '';
    
    if (src.includes('lineup') || src.includes('image') || alt.includes('lineup')) {
      const key = `${src} | ${alt}`;
      analysis.imageElements[key] = (analysis.imageElements[key] || 0) + 1;
    }
  });
  
  // 4. Find links that might be lineup links
  $('a').each((i, link) => {
    const href = $(link).attr('href') || '';
    const text = $(link).text().trim();
    
    if (href.includes('?id=') || href.includes('lineup') || text.includes('lineup')) {
      const key = `${href} | ${text.substring(0, 50)}`;
      analysis.linkElements[key] = (analysis.linkElements[key] || 0) + 1;
    }
  });
  
  return analysis;
}

// Analyze sample files
const analyses = [];
for (const filename of sampleFiles) {
  const filepath = path.join(sourceDir, filename);
  
  if (fs.existsSync(filepath)) {
    console.log(`\n📄 Analyzing ${filename}...`);
    const html = fs.readFileSync(filepath, 'utf8');
    const analysis = analyzeHtmlStructure(html, filename);
    analyses.push(analysis);
    
    console.log(`   Elements: ${analysis.totalElements}`);
    console.log(`   Possible lineup elements: ${Object.keys(analysis.possibleLineupElements).length}`);
    console.log(`   Data attributes: ${Object.keys(analysis.dataAttributes).length}`);
    console.log(`   Lineup images: ${Object.keys(analysis.imageElements).length}`);
    console.log(`   Lineup links: ${Object.keys(analysis.linkElements).length}`);
  } else {
    console.log(`❌ File not found: ${filename}`);
  }
}

// Find common patterns
console.log('\n🔍 COMMON PATTERNS ANALYSIS:');

// Most common lineup element types
const allLineupElements = {};
analyses.forEach(analysis => {
  Object.entries(analysis.possibleLineupElements).forEach(([key, count]) => {
    allLineupElements[key] = (allLineupElements[key] || 0) + count;
  });
});

console.log('\n📊 Most common lineup element patterns:');
Object.entries(allLineupElements)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([pattern, count]) => {
    console.log(`   ${count}x: ${pattern}`);
  });

// Most common data attributes
const allDataAttributes = {};
analyses.forEach(analysis => {
  Object.entries(analysis.dataAttributes).forEach(([key, count]) => {
    allDataAttributes[key] = (allDataAttributes[key] || 0) + count;
  });
});

console.log('\n📊 Most common data attribute patterns:');
Object.entries(allDataAttributes)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([pattern, count]) => {
    console.log(`   ${count}x: ${pattern}`);
  });

// Generate new selector suggestions
console.log('\n💡 SUGGESTED NEW SELECTORS TO TRY:');
const suggestedSelectors = [
  // Based on common patterns
  '.lineup-card',
  '.lineup-item',
  '.lineup-container',
  '[data-lineup-id]',
  '[data-lineup]',
  'article[data-id]',
  '.card[data-id]',
  '.item[data-id]',
  // Image-based selectors
  'img[src*="lineup"]',
  'img[alt*="lineup"]',
  'img[src*="image"]',
  // Link-based selectors
  'a[href*="id="]',
  'a[href*="lineup"]',
  // Generic patterns
  '[class*="card"][data-id]',
  '[class*="item"][data-id]',
  '[class*="box"][data-id]'
];

suggestedSelectors.forEach(selector => {
  console.log(`   ${selector}`);
});

// Save analysis results
fs.writeFileSync('html-structure-analysis.json', JSON.stringify(analyses, null, 2));
console.log('\n💾 Analysis saved to html-structure-analysis.json');

console.log('\n🎯 NEXT STEPS:');
console.log('1. Update parsing script with new selectors');
console.log('2. Test each selector individually to find missed lineups');
console.log('3. Look for JavaScript-generated content');
console.log('4. Check if site has infinite scroll or lazy loading');
