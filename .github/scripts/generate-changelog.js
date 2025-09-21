#!/usr/bin/env node

/**
 * Advanced Changelog Generator for PLAYVALORANTGUIDES.COM
 * Generates detailed and categorized update logs for Discord webhooks
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Configuration for commit categorization
const COMMIT_TYPES = {
  feat: { emoji: '✨', category: 'New Features', color: '#00d4aa' },
  fix: { emoji: '🐛', category: 'Bug Fixes', color: '#f14c4c' },
  style: { emoji: '🎨', category: 'UI & Design', color: '#f39c12' },
  refactor: { emoji: '♻️', category: 'Code Refactoring', color: '#9b59b6' },
  perf: { emoji: '⚡', category: 'Performance', color: '#e74c3c' },
  docs: { emoji: '📝', category: 'Documentation', color: '#3498db' },
  test: { emoji: '🧪', category: 'Testing', color: '#95a5a6' },
  build: { emoji: '🏗️', category: 'Build System', color: '#34495e' },
  ci: { emoji: '👷', category: 'CI/CD', color: '#16a085' },
  chore: { emoji: '🔧', category: 'Maintenance', color: '#7f8c8d' },
  security: { emoji: '🔒', category: 'Security', color: '#e67e22' },
  valorant: { emoji: '🎯', category: 'Valorant Features', color: '#ff4654' },
  database: { emoji: '🗄️', category: 'Database', color: '#2ecc71' },
  api: { emoji: '🔌', category: 'API', color: '#3498db' },
  animation: { emoji: '🎪', category: 'Animations', color: '#9013fe' },
  hero: { emoji: '🦸', category: 'Hero Section', color: '#ff6b7a' },
  crosshair: { emoji: '🎯', category: 'Crosshair System', color: '#f0db4f' },
  lineup: { emoji: '📐', category: 'Lineups', color: '#00f5a0' },
  stats: { emoji: '📊', category: 'Statistics', color: '#00d4ff' },
  community: { emoji: '👥', category: 'Community', color: '#9d4edd' },
  auth: { emoji: '🔐', category: 'Authentication', color: '#ff8c42' }
};

// Priority levels for different changes
const PRIORITY_KEYWORDS = {
  high: ['breaking', 'critical', 'urgent', 'major', 'security'],
  medium: ['important', 'significant', 'enhance', 'improve'],
  low: ['minor', 'small', 'tweak', 'update']
};

function parseCommitMessage(message) {
  // Extract conventional commit type
  const conventionalMatch = message.match(/^(\w+)(?:\(([^)]+)\))?: (.+)/);
  
  if (conventionalMatch) {
    const [, type, scope, description] = conventionalMatch;
    return {
      type: type.toLowerCase(),
      scope: scope || '',
      description: description,
      original: message
    };
  }
  
  // Fallback parsing for non-conventional commits
  const lowerMessage = message.toLowerCase();
  
  // Try to detect type based on keywords
  for (const [type, config] of Object.entries(COMMIT_TYPES)) {
    const keywords = getKeywordsForType(type);
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        type: type,
        scope: '',
        description: message,
        original: message
      };
    }
  }
  
  return {
    type: 'chore',
    scope: '',
    description: message,
    original: message
  };
}

function getKeywordsForType(type) {
  const keywordMap = {
    feat: ['add', 'new', 'feature', 'implement', 'create'],
    fix: ['fix', 'bug', 'error', 'issue', 'resolve', 'correct'],
    style: ['style', 'css', 'design', 'ui', 'theme', 'color'],
    refactor: ['refactor', 'restructure', 'organize', 'clean'],
    perf: ['optimize', 'performance', 'speed', 'fast'],
    docs: ['docs', 'documentation', 'readme', 'comment'],
    test: ['test', 'spec', 'testing'],
    build: ['build', 'compile', 'bundle'],
    ci: ['ci', 'workflow', 'github', 'action'],
    chore: ['chore', 'maintenance', 'update'],
    security: ['security', 'vulnerability', 'secure'],
    valorant: ['valorant', 'agent', 'map', 'weapon'],
    database: ['database', 'db', 'schema', 'migration'],
    api: ['api', 'endpoint', 'route', 'service'],
    animation: ['animation', 'animate', 'transition', 'effect'],
    hero: ['hero', 'landing', 'banner'],
    crosshair: ['crosshair', 'crosshairs', 'aim'],
    lineup: ['lineup', 'lineups', 'utility'],
    stats: ['stats', 'statistics', 'data', 'analytics'],
    community: ['community', 'social', 'user'],
    auth: ['auth', 'login', 'register', 'oauth', 'riot']
  };
  
  return keywordMap[type] || [];
}

function getPriority(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return priority;
    }
  }
  
  return 'low';
}

function generateChangelog(commits) {
  const categorizedCommits = {};
  const priorities = { high: [], medium: [], low: [] };
  
  commits.forEach(commit => {
    const parsed = parseCommitMessage(commit.message);
    const type = parsed.type;
    const priority = getPriority(commit.message);
    
    if (!categorizedCommits[type]) {
      categorizedCommits[type] = [];
    }
    
    const commitInfo = {
      ...commit,
      parsed,
      priority
    };
    
    categorizedCommits[type].push(commitInfo);
    priorities[priority].push(commitInfo);
  });
  
  return {
    categorized: categorizedCommits,
    priorities,
    total: commits.length
  };
}

function formatDiscordField(type, commits) {
  const config = COMMIT_TYPES[type] || COMMIT_TYPES.chore;
  const commitList = commits.map(commit => {
    const priorityEmoji = {
      high: '🔥',
      medium: '⭐',
      low: '💡'
    }[commit.priority];
    
    // Clean and professional formatting without \n artifacts
    const cleanDescription = commit.parsed.description
      .replace(/\\n/g, ' ')
      .replace(/\bli\b/g, '•')
      .trim();
    
    return `${priorityEmoji} **\`${commit.hash}\`** ${cleanDescription}\n📝 *${commit.author}* • 🕒 \`${commit.date}\``;
  }).join('\n\n');
  
  return {
    name: `${config.emoji} **${config.category}** (${commits.length})`,
    value: commitList.length > 1024 ? commitList.substring(0, 1020) + '...' : commitList,
    inline: false
  };
}

function generateStats(changelog) {
  const typeStats = Object.entries(changelog.categorized)
    .map(([type, commits]) => {
      const config = COMMIT_TYPES[type] || COMMIT_TYPES.chore;
      return `${config.emoji} ${commits.length}`;
    })
    .join(' • ');
    
  const priorityStats = Object.entries(changelog.priorities)
    .filter(([, commits]) => commits.length > 0)
    .map(([priority, commits]) => {
      const emoji = { high: '🔥', medium: '⭐', low: '💡' }[priority];
      return `${emoji} ${commits.length}`;
    })
    .join(' • ');
    
  return {
    types: typeStats,
    priorities: priorityStats
  };
}

// Export for use in GitHub Actions
if (require.main === module) {
  try {
    // This would be called from the GitHub Action
    const commits = JSON.parse(process.argv[2] || '[]');
    const changelog = generateChangelog(commits);
    const stats = generateStats(changelog);
    
    console.log(JSON.stringify({
      changelog,
      stats,
      formatted: Object.entries(changelog.categorized).map(([type, commits]) => 
        formatDiscordField(type, commits)
      )
    }));
  } catch (error) {
    console.error('Error generating changelog:', error);
    process.exit(1);
  }
}

module.exports = {
  parseCommitMessage,
  generateChangelog,
  formatDiscordField,
  generateStats,
  COMMIT_TYPES,
  PRIORITY_KEYWORDS
};
