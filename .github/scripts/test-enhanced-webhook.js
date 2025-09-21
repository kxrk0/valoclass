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

// Clean test payload with new design
function createTestPayload(authorName = 'TestUser') {
  // Clean user-specific emoji - NO NAMES, just emojis
  let userEmoji = CUSTOM_EMOJIS.crown;
  if (authorName === 'swaffX') {
    userEmoji = CUSTOM_EMOJIS.z_special;
  } else if (authorName === 'kxrk0') {
    userEmoji = CUSTOM_EMOJIS.o_special;
  }

  const description = `**Geliştirici:** ${userEmoji}`;
  
  const summary = `${CUSTOM_EMOJIS.arrow} **3** commit gönderildi\\n${CUSTOM_EMOJIS.arrow} **8** dosya değiştirildi\\n${CUSTOM_EMOJIS.arrow} **47** satır eklendi • **12** satır silindi\\n${CUSTOM_EMOJIS.crown} Toplam proje commit sayısı: **156**`;

  return {
    username: "PLAYVALORANTGUIDES.COM",
    avatar_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg",
    embeds: [{
      title: `${CUSTOM_EMOJIS.verified} PLAYVALORANTGUIDES.COM - Geliştirme Güncellemesi ${CUSTOM_EMOJIS.online}`,
      description: description,
      color: 3066993,
      fields: [
        {
          name: `${CUSTOM_EMOJIS.verified} ━━━━━ Geliştirme İstatistikleri ━━━━━`,
          value: summary,
          inline: false
        },
        {
          name: "⠀",
          value: "⠀",
          inline: false
        },
        {
          name: `${CUSTOM_EMOJIS.crown} ━━━━━ Proje Sağlığı ━━━━━`,
          value: "🟢 **Yapı Durumu:** Başarılı\\n🔒 **Güvenlik:** Tüm kontroller geçti\\n⚡ **Performans:** Optimize edildi\\n🧪 **Test Kapsamı:** Aktif izleme",
          inline: false
        },
        {
          name: "⠀",
          value: "⠀",
          inline: false
        },
        {
          name: `${CUSTOM_EMOJIS.online} ━━━━━ Son Aktiviteler ━━━━━`,
          value: "💾 Veritabanı optimizasyonları\\n🎨 UI/UX iyileştirmeleri\\n🔧 Backend geliştirmeleri\\n📱 Mobil uyumluluk çalışmaları",
          inline: false
        }
      ],
      footer: {
        text: "PLAYVALORANTGUIDES.COM • Profesyonel Valorant Rehber Platformu",
        icon_url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Valorant.svg"
      },
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: "https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Github-Dark.svg"
      },
      image: {
        url: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGdwcWR1dWhkczR0eHI3dDNreGI3dTUwYnV0ZGduZXo2YWo2dzE4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif"
      }
    }]
  };
}

// Test different user scenarios with clean design
function runTests() {
  console.log(`🧪 Starting Clean Webhook Design Tests`);
  
  const testCases = [
    { name: 'swaffX', description: 'Clean test for swaffX with Z emoji only' },
    { name: 'kxrk0', description: 'Clean test for kxrk0 with O emoji only' },
    { name: 'RandomUser', description: 'Clean test for other users with Crown emoji' }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\\n${CUSTOM_EMOJIS.arrow} Test ${index + 1}: ${testCase.description}`);
    const payload = createTestPayload(testCase.name);
    
    console.log(`✅ Generated clean payload for ${testCase.name}`);
    console.log(`🎯 Title: ${payload.embeds[0].title}`);
    console.log(`📊 User Emoji: ${testCase.name === 'swaffX' ? 'Z Emoji' : testCase.name === 'kxrk0' ? 'O Emoji' : 'Crown Emoji'}`);
    
    // Save test payload to file
    const fs = require('fs');
    fs.writeFileSync(`clean-payload-${testCase.name.toLowerCase()}.json`, JSON.stringify(payload, null, 2));
    console.log(`💾 Saved to: clean-payload-${testCase.name.toLowerCase()}.json`);
  });

  console.log(`\\n🎉 All clean webhook tests completed!`);
  console.log(`🚀 New design ready for deployment - minimal, professional, comprehensive!`);
}

if (require.main === module) {
  runTests();
}

module.exports = { createTestPayload, CUSTOM_EMOJIS };
