#!/usr/bin/env node

/**
 * Discord Webhook Debug Test
 * Simple test to check if webhook is working with custom emojis
 */

const https = require('https');
const { URL } = require('url');

// Test webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1418956975256895518/4J_UApL7o6pxD_PkFEKXI0umRtmPcy9PZQ-R8kXC-EsDrpHfHADSRIso8A_iNlyv9Ta4';

// Custom emojis for testing
const EMOJIS = {
  uzi: '<a:uzi:1419286915194290326>',
  z_special: '<a:z_:1419286712668000256>',
  o_special: '<a:ogi:1419286667965108327>',
  online: '<a:online:1419285611012952074>',
  verified: '<a:verified:1419285858753970179>',
  crown: '<a:crown:1419286909389377576>',
  arrow: '<a:arrow:1419286458543378492>'
};

// Simple test payload
function createSimpleTestPayload() {
  return {
    username: "PLAYVALORANTGUIDES.COM",
    avatar_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg",
    content: `${EMOJIS.uzi} **WEBHOOK DEBUG TEST** ${EMOJIS.verified}`,
    embeds: [{
      title: `${EMOJIS.crown} Discord Webhook Test ${EMOJIS.online}`,
      description: `${EMOJIS.arrow} Bu bir test mesajıdır\\n${EMOJIS.arrow} Webhook çalışıyor mu kontrol ediyoruz`,
      color: 15844367,
      fields: [{
        name: `${EMOJIS.uzi} Test Detayları`,
        value: `${EMOJIS.arrow} Zaman: ${new Date().toLocaleString('tr-TR')}\\n${EMOJIS.verified} Durum: Test mesajı gönderiliyor`,
        inline: false
      }],
      footer: {
        text: `Debug Test ${EMOJIS.online}`,
        icon_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg"
      },
      timestamp: new Date().toISOString()
    }]
  };
}

// Send webhook function
function sendWebhook(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(WEBHOOK_URL);
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'PLAYVALORANTGUIDES-Webhook-Test/1.0'
      }
    };

    console.log(`${EMOJIS.arrow} Webhook'a mesaj gönderiliyor...`);
    console.log(`${EMOJIS.verified} URL: ${url.hostname}${url.pathname}`);
    console.log(`${EMOJIS.crown} Payload size: ${Buffer.byteLength(data)} bytes`);

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`${EMOJIS.online} HTTP Status: ${res.statusCode}`);
        console.log(`${EMOJIS.arrow} Headers:`, res.headers);
        
        if (res.statusCode === 204) {
          console.log(`${EMOJIS.uzi} SUCCESS: Webhook mesajı başarıyla gönderildi! ${EMOJIS.verified}`);
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          console.log(`${EMOJIS.arrow} Response: ${responseData}`);
          console.log(`❌ FAILED: HTTP ${res.statusCode}`);
          reject({ success: false, statusCode: res.statusCode, response: responseData });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Network Error:`, error.message);
      reject({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.error(`❌ Request Timeout`);
      req.destroy();
      reject({ success: false, error: 'Request timeout' });
    });

    req.setTimeout(10000); // 10 second timeout
    req.write(data);
    req.end();
  });
}

// Test with different scenarios
async function runDebugTests() {
  console.log(`${EMOJIS.uzi} DISCORD WEBHOOK DEBUG TEST BAŞLADI ${EMOJIS.verified}`);
  console.log(`${EMOJIS.crown} Webhook URL kontrol ediliyor...`);

  try {
    // Test 1: Simple test message
    console.log(`\\n${EMOJIS.arrow} Test 1: Basit test mesajı`);
    const simplePayload = createSimpleTestPayload();
    
    // Save payload for inspection
    const fs = require('fs');
    fs.writeFileSync('debug-test-payload.json', JSON.stringify(simplePayload, null, 2));
    console.log(`${EMOJIS.verified} Payload saved to: debug-test-payload.json`);
    
    await sendWebhook(simplePayload);
    
    console.log(`\\n${EMOJIS.crown} Test tamamlandı! Discord sunucunuzu kontrol edin.`);
    
  } catch (error) {
    console.error(`\\n❌ TEST FAILED:`, error);
    
    // Troubleshooting suggestions
    console.log(`\\n${EMOJIS.arrow} TROUBLESHOOTING ÖNERİLERİ:`);
    console.log(`${EMOJIS.verified} 1. Discord webhook URL'ini kontrol edin`);
    console.log(`${EMOJIS.verified} 2. Sunucu permissions'larını kontrol edin`);
    console.log(`${EMOJIS.verified} 3. Webhook'un silinip silinmediğini kontrol edin`);
    console.log(`${EMOJIS.verified} 4. Rate limiting olup olmadığını kontrol edin`);
  }
}

if (require.main === module) {
  runDebugTests();
}

module.exports = { sendWebhook, createSimpleTestPayload, EMOJIS };
