#!/usr/bin/env node

/**
 * Test Script for Discord Webhook System
 * This script allows you to test the Discord webhook without making actual commits
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1418956975256895518/4J_UApL7o6pxD_PkFEKXI0umRtmPcy9PZQ-R8kXC-EsDrpHfHADSRIso8A_iNlyv9Ta4';

// Örnek test verisi
const testCommits = [
  {
    hash: 'abc1234',
    message: 'Hero bölümüne yumuşak giriş animasyonları eklendi',
    author: 'Geliştirici 1',
    email: 'dev1@example.com',
    date: '15 Ocak 2024 14:30',
    timestamp: '1705328200'
  },
  {
    hash: 'def5678',
    message: 'Crosshair doğrulama hatası düzeltildi',
    author: 'Geliştirici 2', 
    email: 'dev2@example.com',
    date: '15 Ocak 2024 15:15',
    timestamp: '1705330900'
  },
  {
    hash: 'ghi9012',
    message: 'Topluluk sayfası animasyonları geliştirildi',
    author: 'Geliştirici 1',
    email: 'dev1@example.com', 
    date: '15 Ocak 2024 16:00',
    timestamp: '1705333600'
  }
];

function createTestPayload(commitCount = 3) {
  const commits = testCommits.slice(0, commitCount);
  const totalFiles = Math.floor(Math.random() * 15) + 1;
  const linesAdded = Math.floor(Math.random() * 200) + 10;
  const linesDeleted = Math.floor(Math.random() * 100) + 5;
  
  // Determine color based on commit count
  let color = 3447003; // Default blue
  if (commitCount >= 5) {
    color = 15844367; // Gold
  } else if (commitCount >= 3) {
    color = 3066993; // Green
  }
  
  const description = `**🏛️ Depo:** \`playvalorantguides\`
**🌿 Dal:** \`main\`
**👤 Tetikleyen:** **test-kullanıcı**`;

  const summaryValue = `📝 **${commitCount}** commit • 📁 **${totalFiles}** dosya değiştirildi
➕ **${linesAdded}** satır eklendi • ➖ **${linesDeleted}** satır silindi
🏗️ Toplam **1,247** commit`;

  // Commit alanlarını oluştur
  const fields = [
    {
      name: "📊 Güncelleme Özeti",
      value: summaryValue,
      inline: false
    }
  ];

  commits.forEach((commit, index) => {
    let emoji = "🔧";
    let category = "Genel";
    
    // Tür tespiti
    if (commit.message.match(/hero|animasyon|tasarım/i)) {
      emoji = "✨"; category = "Yeni Özellik";
    } else if (commit.message.match(/hata|düzelt|fix/i)) {
      emoji = "🐛"; category = "Hata Düzeltme";
    } else if (commit.message.match(/style|görsel|tasarım|animasyon/i)) {
      emoji = "🎨"; category = "Tasarım";
    } else if (commit.message.match(/crosshair|nişangah/i)) {
      emoji = "🎯"; category = "Crosshair";
    } else if (commit.message.match(/topluluk|community/i)) {
      emoji = "👥"; category = "Topluluk";
    }
    
    // Basit tek satır format
    const commitText = `\`${commit.hash}\` ${commit.message} - ${commit.author}`;
    
    fields.push({
      name: `${emoji} ${category}`,
      value: commitText,
      inline: false
    });
  });

  return {
    username: "PLAYVALORANTGUIDES.COM",
    avatar_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg",
    embeds: [
      {
        title: "🔄 Kod Güncellemesi",
        description: description,
        color: color,
        fields: fields,
        footer: {
          text: "PLAYVALORANTGUIDES.COM • Geliştirme Güncellemeleri",
          icon_url: "https://github.com/fluidicon.png"
        },
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Github-Dark.svg"
        }
      }
    ]
  };
}

function sendTestWebhook(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(WEBHOOK_URL);
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          reject({ 
            success: false, 
            statusCode: res.statusCode, 
            response: responseData 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
    
    req.write(data);
    req.end();
  });
}


// Check if running directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Discord Webhook Test Script

Usage:
  node test-webhook.js [commits]

Examples:
  node test-webhook.js     # Test with 2 commits (default)
  node test-webhook.js 1   # Test with 1 commit
  node test-webhook.js 3   # Test with 3 commits
`);
    process.exit(0);
  }
  
  // Commit sayısını al (varsayılan 2)
  const commitCount = parseInt(args[0]) || 2;
  
  console.log(`🚀 Discord Webhook Test Başlatılıyor...`);
  console.log(`📋 ${commitCount} commit ile test yapılacak\n`);
  
  console.log('📝 1/3 - Test mesajı hazırlanıyor...');
  const payload = createTestPayload(commitCount);
  
  console.log('📤 2/3 - Discord\'a gönderiliyor...');
  
  sendTestWebhook(payload)
    .then((result) => {
      console.log(`✅ 3/3 - Test başarılı!`);
      console.log(`📤 Discord'a ${commitCount} commit ile mesaj gönderildi (Status: ${result.statusCode})`);
      console.log(`\n✨ Test tamamlandı! Discord sunucunuzu kontrol edin.`);
    })
    .catch((error) => {
      console.log('❌ Test başarısız:');
      console.log(`   Status: ${error.statusCode || 'Bilinmiyor'}`);
      console.log(`   Hata: ${error.error || error.response || 'Bilinmeyen hata'}`);
      process.exit(1);
    });
}

module.exports = {
  createTestPayload,
  sendTestWebhook
};
