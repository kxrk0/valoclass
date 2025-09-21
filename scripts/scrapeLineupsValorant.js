// Comprehensive LineupsValorant.com Scraper
// Bu script tüm agent, ability, map ve lineup verilerini çeker

const fs = require('fs');
const https = require('https');

class LineupsValorantScraper {
  constructor() {
    this.baseUrl = 'https://lineupsvalorant.com';
    this.agents = new Set();
    this.abilities = new Map(); // agent -> abilities
    this.maps = new Set();
    this.callouts = new Map(); // map -> callouts
    this.lineupTypes = new Set();
    this.sides = new Set();
    this.lineups = [];
  }

  async fetchPage(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  parseAgentsFromHTML(html) {
    // Agent selector parsing
    const agentRegex = /data-agent="([^"]+)"/g;
    const agents = [];
    let match;
    
    while ((match = agentRegex.exec(html)) !== null) {
      agents.push(match[1]);
      this.agents.add(match[1]);
    }
    
    console.log('Found agents:', Array.from(this.agents));
    return agents;
  }

  parseAbilitiesFromHTML(html) {
    // Ability parsing from lineup cards
    const abilityRegex = /alt="VALORANT ([^"]+)"/g;
    const abilities = new Set();
    let match;
    
    while ((match = abilityRegex.exec(html)) !== null) {
      abilities.add(match[1]);
    }
    
    console.log('Found abilities:', Array.from(abilities));
    return Array.from(abilities);
  }

  parseMapsFromHTML(html) {
    // Map selector parsing
    const mapRegex = /data-value="([^"]+)"/g;
    const maps = [];
    let match;
    
    while ((match = mapRegex.exec(html)) !== null) {
      if (match[1] !== 'Any') {
        maps.push(match[1]);
        this.maps.add(match[1]);
      }
    }
    
    console.log('Found maps:', Array.from(this.maps));
    return maps;
  }

  parseCalloutsFromHTML(html) {
    // Location/callout parsing
    const calloutRegex = /From <a[^>]+>([^<]+)<\/a> to <a[^>]+>([^<]+)<\/a>/g;
    const callouts = new Set();
    let match;
    
    while ((match = calloutRegex.exec(html)) !== null) {
      callouts.add(match[1]); // From location
      callouts.add(match[2]); // To location
    }
    
    console.log('Found callouts:', Array.from(callouts));
    return Array.from(callouts);
  }

  parseLineupsFromHTML(html) {
    // Parse lineup cards
    const lineupRegex = /<a[^>]+class="lineup-box"[^>]+data-id="([^"]+)"[^>]+data-type="([^"]+)"[^>]*>(.*?)<\/a>/gs;
    const lineups = [];
    let match;
    
    while ((match = lineupRegex.exec(html)) !== null) {
      const [, id, type, content] = match;
      
      // Extract title
      const titleMatch = content.match(/<span class="lineup-box-title">([^<]+)<\/span>/);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract agent
      const agentMatch = content.match(/alt="([^"]+)" src="[^"]*agents\/([^"]+)\.webp"/);
      const agent = agentMatch ? agentMatch[2] : '';
      
      // Extract abilities (multiple possible)
      const abilityMatches = content.match(/alt="VALORANT ([^"]+)"/g) || [];
      const abilities = abilityMatches.map(match => match.replace('alt="VALORANT ', '').replace('"', ''));
      
      // Extract locations
      const locationMatch = content.match(/From <a[^>]*>([^<]+)<\/a> to <a[^>]*>([^<]+)<\/a>/);
      const setupMatch = content.match(/For <a[^>]*>([^<]+)<\/a>/);
      
      let from = '', to = '';
      if (locationMatch) {
        from = locationMatch[1];
        to = locationMatch[2];
      } else if (setupMatch) {
        from = setupMatch[1];
        to = '';
      }
      
      // Extract image
      const imageMatch = content.match(/src="([^"]*lineup_images[^"]+)"/);
      const image = imageMatch ? imageMatch[1] : '';
      
      lineups.push({
        id,
        type,
        title,
        agent,
        abilities,
        from,
        to,
        image,
        url: `${this.baseUrl}/?id=${id}`
      });
      
      this.lineupTypes.add(type);
    }
    
    console.log('Found lineup types:', Array.from(this.lineupTypes));
    console.log('Found lineups count:', lineups.length);
    return lineups;
  }

  async scrapeMainPage() {
    console.log('Scraping main page...');
    const html = await this.fetchPage(this.baseUrl);
    
    this.parseAgentsFromHTML(html);
    this.parseAbilitiesFromHTML(html);
    this.parseMapsFromHTML(html);
    this.parseCalloutsFromHTML(html);
    this.lineups = this.parseLineupsFromHTML(html);
    
    return {
      agents: Array.from(this.agents),
      abilities: Array.from(this.abilities.values()).flat(),
      maps: Array.from(this.maps),
      callouts: Array.from(this.callouts.values()).flat(),
      lineupTypes: Array.from(this.lineupTypes),
      lineups: this.lineups
    };
  }

  async scrapeSpecificAgent(agent) {
    console.log(`Scraping agent: ${agent}`);
    const url = `${this.baseUrl}/?agent=${agent}`;
    const html = await this.fetchPage(url);
    
    // Parse agent-specific abilities
    const abilities = this.parseAbilitiesFromHTML(html);
    this.abilities.set(agent, abilities);
    
    return abilities;
  }

  async scrapeAllAgents() {
    console.log('Scraping all agents...');
    const agentAbilities = {};
    
    for (const agent of this.agents) {
      const abilities = await this.scrapeSpecificAgent(agent);
      agentAbilities[agent] = abilities;
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return agentAbilities;
  }

  async generateCompleteData() {
    console.log('Starting comprehensive scrape...');
    
    // Step 1: Scrape main page
    const mainData = await this.scrapeMainPage();
    
    // Step 2: Scrape each agent for complete abilities
    const agentAbilities = await this.scrapeAllAgents();
    
    // Step 3: Compile complete data
    const completeData = {
      agents: mainData.agents,
      agentAbilities,
      maps: mainData.maps,
      lineupTypes: mainData.lineupTypes,
      sides: ['All', 'Defense', 'Attack'],
      callouts: this.parseCalloutsFromHTML(''),
      lineups: mainData.lineups,
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalAgents: mainData.agents.length,
        totalMaps: mainData.maps.length,
        totalLineups: mainData.lineups.length
      }
    };
    
    // Save to file
    fs.writeFileSync('scraped-lineups-data.json', JSON.stringify(completeData, null, 2));
    console.log('Data saved to scraped-lineups-data.json');
    
    return completeData;
  }
}

// Run scraper
const scraper = new LineupsValorantScraper();
scraper.generateCompleteData()
  .then(data => {
    console.log('Scraping completed successfully!');
    console.log(`Found ${data.agents.length} agents`);
    console.log(`Found ${data.maps.length} maps`);
    console.log(`Found ${data.lineups.length} lineups`);
  })
  .catch(err => {
    console.error('Scraping failed:', err);
  });

module.exports = LineupsValorantScraper;
