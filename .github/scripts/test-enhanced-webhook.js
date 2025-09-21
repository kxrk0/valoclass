#!/usr/bin/env node

/**
 * Enhanced Discord Webhook Test for PLAYVALORANTGUIDES.COM
 * Tests the new custom emoji integration and improved design
 */

const https = require('https');
const { URL } = require('url');

// Custom emojis
const CUSTOM_EMOJIS = {
  uzi: '<a:uzi:1419286915194290326>',
  z_special: '<a:z_:1419286712668000256>',
  o_special: '<a:ogi:1419286667965108327>',
  online: '<a:online:1419285611012952074>',
  verified: '<a:verified:1419285858753970179>',
  crown: '<a:crown:1419286909389377576>',
  shutdown: '<a:shutdown:1419285612854382662>',
  arrow: '<a:arrow:1419286458543378492>',
  unlem: '<a:unlem:1419286534326059089>',
  hac: '<a:hac:1419286912203489400>'
};

// Test payload with enhanced design including crown integration
function createTestPayload(authorName = 'TestUser') {
  // Determine user-specific emoji with crown integration
  let userEmoji = CUSTOM_EMOJIS.crown;
  if (authorName === 'swaffX') {
    userEmoji = `${CUSTOM_EMOJIS.z_special} ${CUSTOM_EMOJIS.crown}`;
  } else if (authorName === 'kxrk0') {
    userEmoji = `${CUSTOM_EMOJIS.o_special} ${CUSTOM_EMOJIS.crown}`;
  }

  const description = `${CUSTOM_EMOJIS.arrow} **Proje:** \`valoclass\` ${CUSTOM_EMOJIS.verified}\\n${CUSTOM_EMOJIS.arrow} **Branch:** \`main\` ${CUSTOM_EMOJIS.online}\\n${CUSTOM_EMOJIS.arrow} **Geliştirici:** ${userEmoji} **${authorName}** ${CUSTOM_EMOJIS.crown}`;
  
  const summary = `${CUSTOM_EMOJIS.arrow} **3** commit ${CUSTOM_EMOJIS.uzi} • ${CUSTOM_EMOJIS.arrow} **8** dosya değiştirildi ${CUSTOM_EMOJIS.verified}\\n${CUSTOM_EMOJIS.arrow} **47** satır eklendi • ${CUSTOM_EMOJIS.arrow} **12** satır silindi\\n${CUSTOM_EMOJIS.arrow} Toplam **156** commit ${CUSTOM_EMOJIS.crown}`;

  return {
    username: "PLAYVALORANTGUIDES.COM",
    avatar_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg",
    embeds: [{
      title: `${CUSTOM_EMOJIS.uzi} Kod Güncellemesi ${CUSTOM_EMOJIS.online}`,
      description: description,
      color: 3066993,
      fields: [{
        name: `${CUSTOM_EMOJIS.uzi} Güncelleme Özeti ${CUSTOM_EMOJIS.verified}`,
        value: summary,
        inline: false
      }, {
        name: `${CUSTOM_EMOJIS.hac} Bug Fixes (2)`,
        value: `${CUSTOM_EMOJIS.arrow} ${CUSTOM_EMOJIS.unlem} **\`a1b2c3d\`** Fixed login authentication issue\\n${userEmoji} *${authorName}* • 🕒 \`2024-01-15 14:30\`\\n\\n${CUSTOM_EMOJIS.arrow} 💡 **\`e4f5g6h\`** Minor UI alignment fix\\n${CUSTOM_EMOJIS.crown} *TestUser2* • 🕒 \`2024-01-15 15:45\``,
        inline: false
      }, {
        name: `${CUSTOM_EMOJIS.uzi} New Features (1)`,
        value: `${CUSTOM_EMOJIS.arrow} ⭐ **\`i7j8k9l\`** Added new crosshair customization feature\\n${userEmoji} *${authorName}* • 🕒 \`2024-01-15 16:20\``,
        inline: false
      }],
      footer: {
        text: `PLAYVALORANTGUIDES.COM ${CUSTOM_EMOJIS.online} Geliştirme Bildirimleri ${CUSTOM_EMOJIS.verified}`,
        icon_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg"
      },
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Github-Dark.svg"
      },
      image: {
        url: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif"
      }
    }]
  };
}

// Test different user scenarios
function runTests() {
  console.log(`${CUSTOM_EMOJIS.uzi} Starting Enhanced Webhook Tests ${CUSTOM_EMOJIS.verified}`);
  
  const testCases = [
    { name: 'swaffX', description: 'Test for swaffX user with Z + Crown emoji' },
    { name: 'kxrk0', description: 'Test for kxrk0 user with O + Crown emoji' },
    { name: 'RandomUser', description: 'Test for random user with Crown emoji only' }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\\n${CUSTOM_EMOJIS.arrow} Test ${index + 1}: ${testCase.description}`);
    const payload = createTestPayload(testCase.name);
    
    console.log(`${CUSTOM_EMOJIS.verified} Generated payload for ${testCase.name}:`);
    console.log(`${CUSTOM_EMOJIS.crown} Title: ${payload.embeds[0].title}`);
    console.log(`${CUSTOM_EMOJIS.online} User Emoji Detection: ${testCase.name === 'swaffX' ? 'Z + Crown Emoji' : testCase.name === 'kxrk0' ? 'O + Crown Emoji' : 'Crown Emoji Only'}`);
    
    // Save test payload to file
    const fs = require('fs');
    fs.writeFileSync(`test-payload-${testCase.name.toLowerCase()}-with-crown.json`, JSON.stringify(payload, null, 2));
    console.log(`${CUSTOM_EMOJIS.arrow} Saved to: test-payload-${testCase.name.toLowerCase()}-with-crown.json`);
  });

  console.log(`\\n${CUSTOM_EMOJIS.crown} All tests completed! ${CUSTOM_EMOJIS.uzi}`);
  console.log(`${CUSTOM_EMOJIS.verified} Enhanced webhook design ready for deployment ${CUSTOM_EMOJIS.online}`);
}

if (require.main === module) {
  runTests();
}

module.exports = { createTestPayload, CUSTOM_EMOJIS };
