const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

console.log('🔍 Analyzing JavaScript data and embedded content...');

const sourceDir = 'C:\\Users\\zeyne\\lineupsvalorant.com';
const mainFiles = ['index.html', 'index.html@agent=Sova.html', 'index.html@map=Bind.html'];

// Analyze JavaScript and embedded data
function analyzeJavaScriptContent(html, filename) {
  const $ = cheerio.load(html);
  const jsData = {};
  
  // 1. Look for embedded JavaScript data
  $('script').each((i, script) => {
    const scriptContent = $(script).html() || '';
    
    // Look for common data patterns
    const dataPatterns = [
      /var\s+lineups\s*=\s*(\[.*?\]);/gs,
      /window\.lineups\s*=\s*(\[.*?\]);/gs,
      /data\s*:\s*(\[.*?\])/gs,
      /"lineups"\s*:\s*(\[.*?\])/gs,
      /lineupData\s*=\s*(\[.*?\]);/gs,
      /LINEUP_DATA\s*=\s*(\[.*?\]);/gs
    ];
    
    dataPatterns.forEach((pattern, index) => {
      const matches = scriptContent.match(pattern);
      if (matches) {
        console.log(`📋 Found data pattern ${index + 1} in ${filename}`);
        try {
          const dataStr = matches[1];
          const data = JSON.parse(dataStr);
          console.log(`   🔢 Contains ${data.length} items`);
          if (!jsData.lineupArrays) jsData.lineupArrays = [];
          jsData.lineupArrays.push(data);
        } catch (e) {
          console.log(`   ⚠️ Could not parse JSON: ${e.message}`);
        }
      }
    });
    
    // Look for API endpoints
    const apiPatterns = [
      /fetch\s*\(\s*['"]([^'"]*api[^'"]*)['"]/g,
      /ajax\s*\(\s*['"]([^'"]*)['"]/g,
      /xhr\.open\s*\(\s*['"][^'"]*['"]\s*,\s*['"]([^'"]*)['"]/g,
      /\.get\s*\(\s*['"]([^'"]*)['"]/g,
      /\.post\s*\(\s*['"]([^'"]*)['"]/g
    ];
    
    apiPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(scriptContent)) !== null) {
        console.log(`🌐 Found API endpoint pattern ${index + 1}: ${match[1]}`);
        if (!jsData.endpoints) jsData.endpoints = [];
        jsData.endpoints.push(match[1]);
      }
    });
  });
  
  // 2. Look for data attributes
  $('[data-lineups], [data-lineup], [data-id]').each((i, el) => {
    const $el = $(el);
    const dataLineups = $el.attr('data-lineups');
    const dataLineup = $el.attr('data-lineup');
    const dataId = $el.attr('data-id');
    
    if (dataLineups) {
      console.log(`📊 Found data-lineups attribute in ${filename}`);
      try {
        const data = JSON.parse(dataLineups);
        if (!jsData.dataAttributes) jsData.dataAttributes = [];
        jsData.dataAttributes.push(data);
      } catch (e) {
        console.log(`   ⚠️ Could not parse data-lineups: ${e.message}`);
      }
    }
  });
  
  // 3. Look for window/global variables
  $('script').each((i, script) => {
    const scriptContent = $(script).html() || '';
    
    const globalPatterns = [
      /window\[['"]([^'"]*lineups?[^'"]*)['"]\]/gi,
      /window\.([a-zA-Z_]*lineups?[a-zA-Z_]*)/gi,
      /var\s+([a-zA-Z_]*lineups?[a-zA-Z_]*)/gi
    ];
    
    globalPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(scriptContent)) !== null) {
        console.log(`🌍 Found global variable: ${match[1]}`);
        if (!jsData.globalVars) jsData.globalVars = [];
        jsData.globalVars.push(match[1]);
      }
    });
  });
  
  return jsData;
}

// Analyze main files
let allJsData = {};
for (const filename of mainFiles) {
  const filepath = path.join(sourceDir, filename);
  
  if (fs.existsSync(filepath)) {
    console.log(`\n📄 Analyzing ${filename}...`);
    const html = fs.readFileSync(filepath, 'utf8');
    const jsData = analyzeJavaScriptContent(html, filename);
    allJsData[filename] = jsData;
  }
}

// Look for external JS files
console.log('\n🔍 Looking for external JavaScript files...');
const jsFiles = fs.readdirSync(sourceDir)
  .filter(f => f.endsWith('.js'))
  .slice(0, 10); // Limit to first 10

if (jsFiles.length > 0) {
  console.log(`📁 Found ${jsFiles.length} JavaScript files`);
  jsFiles.forEach(jsFile => {
    console.log(`   - ${jsFile}`);
  });
} else {
  console.log('📁 No external JavaScript files found');
}

// Generate URLs for potential AJAX endpoints
console.log('\n🌐 Generating potential AJAX endpoints to test...');
const baseUrl = 'https://lineupsvalorant.com';
const potentialEndpoints = [
  '/api/lineups',
  '/api/lineups/all',
  '/api/data/lineups',
  '/lineups.json',
  '/data/lineups.json',
  '/api/v1/lineups',
  '/ajax/lineups',
  '/get-lineups',
  '/lineups/load',
  '/data.php',
  '/api.php',
  '/loadmore.php'
];

console.log('📋 Testing these endpoints:');
potentialEndpoints.forEach(endpoint => {
  console.log(`   ${baseUrl}${endpoint}`);
});

// Summary
console.log('\n📊 ANALYSIS SUMMARY:');
console.log(`📄 Files analyzed: ${Object.keys(allJsData).length}`);

const totalArrays = Object.values(allJsData)
  .reduce((sum, data) => sum + (data.lineupArrays?.length || 0), 0);
const totalEndpoints = Object.values(allJsData)
  .reduce((sum, data) => sum + (data.endpoints?.length || 0), 0);

console.log(`📊 Data arrays found: ${totalArrays}`);
console.log(`🌐 API endpoints found: ${totalEndpoints}`);

if (totalArrays === 0 && totalEndpoints === 0) {
  console.log('\n💡 No embedded JavaScript data found. The site likely uses:');
  console.log('   1. Server-side rendering');
  console.log('   2. Real-time AJAX calls');
  console.log('   3. Progressive loading');
  console.log('   4. More URL parameters we haven\'t tried');
}

// Save analysis results
fs.writeFileSync('javascript-analysis.json', JSON.stringify(allJsData, null, 2));
console.log('\n💾 Analysis saved to javascript-analysis.json');
