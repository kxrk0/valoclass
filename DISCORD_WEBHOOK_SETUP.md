# 🚀 Discord Webhook Otomasyonu - Setup Guide

Bu dokuman, GitHub Actions kullanarak otomatik Discord webhook sisteminizi nasıl kuracağınızı anlatır.

## 📋 Özellikler

- ✅ **Otomatik Bildirimler**: Her push ve PR merge'de Discord'a bildirim
- 🎨 **Güzel Formatlanmış Mesajlar**: Embed mesajlar ile profesyonel görünüm
- 📊 **Detaylı İstatistikler**: Commit sayısı, dosya değişiklikleri, satır istatistikleri
- 🏷️ **Akıllı Kategorizasyon**: Commit type'larına göre otomatik kategorilendirme
- 🔥 **Öncelik Sistemi**: Critical, important, minor commit'lerin ayrılması
- 🎯 **Valorant-Specific**: Valorant projesi için özel kategoriler
- 👥 **Takım Dostu**: Hem siz hem arkadaşınız için çalışır

## 🔧 Kurulum

### 1. Dosyalar Zaten Hazır! ✨

Sistem tamamen kurulmuş durumda:

```
.github/
├── workflows/
│   └── discord-updates.yml     # Ana workflow dosyası
├── scripts/
│   ├── generate-changelog.js   # Gelişmiş changelog üretici
│   └── test-webhook.js         # Test script'i
└── config/
    └── discord-config.json     # Konfigürasyon
```

### 2. Webhook URL Zaten Tanımlı! 🔗

Webhook URL'iniz zaten sistemde tanımlı:
```
https://discord.com/api/webhooks/1418956975256895518/4J_UApL7o6pxD_PkFEKXI0umRtmPcy9PZQ-R8kXC-EsDrpHfHADSRIso8A_iNlyv9Ta4
```

### 3. İlk Test 🧪

Sistemi test etmek için:

```bash
# Test script'ini çalıştır
cd .github/scripts
node test-webhook.js

# Veya belirli commit sayısı ile test et
node test-webhook.js --commits 3

# Sadece payload'ı görmek için
node test-webhook.js --payload --commits 1
```

## 🎯 Nasıl Çalışır?

### Tetikleme Koşulları

Webhook şu durumlarda tetiklenir:
- `main` veya `master` branch'a **push** yapıldığında
- `main` veya `master` branch'a **Pull Request merge** olduğunda

### Otomatik Kategorizasyon

Commit mesajlarınıza göre otomatik kategoriler:

| Commit Prefix | Kategori | Emoji | Örnek |
|---------------|----------|-------|-------|
| `feat:` | New Feature | ✨ | `feat(hero): add search bar` |
| `fix:` | Bug Fix | 🐛 | `fix(auth): resolve login issue` |
| `style:` | UI & Design | 🎨 | `style: improve animations` |
| `refactor:` | Refactor | ♻️ | `refactor: optimize code` |
| `perf:` | Performance | ⚡ | `perf: speed up loading` |
| `docs:` | Documentation | 📝 | `docs: update README` |
| `test:` | Testing | 🧪 | `test: add unit tests` |

### Valorant-Specific Kategoriler

| Keyword | Kategori | Emoji | Örnek |
|---------|----------|-------|-------|
| `valorant`, `hero` | Valorant Feature | 🎯 | `feat(valorant): add agent info` |
| `crosshair` | Crosshair System | 🎯 | `fix(crosshair): code validation` |
| `lineup` | Lineups | 📐 | `feat(lineup): search function` |
| `stats` | Statistics | 📊 | `improve(stats): real-time data` |
| `community` | Community | 👥 | `enhance(community): user interaction` |
| `auth`, `riot` | Authentication | 🔐 | `fix(auth): riot login` |

### Öncelik Seviyeleri

| Priority | Emoji | Keywords |
|----------|-------|----------|
| **High** | 🔥 | `breaking`, `critical`, `urgent`, `major`, `security` |
| **Medium** | ⭐ | `important`, `significant`, `enhance`, `improve` |
| **Low** | 💡 | `minor`, `small`, `tweak`, `update` |

## 📊 Discord Mesaj Formatı

Her bildirim şunları içerir:

### Header
- **Update Type**: 🔄 Code Update veya 🔀 Pull Request Merged
- **Repository**: Proje adı
- **Branch**: Hangi branch
- **Triggered by**: Kim tetikledi

### Update Summary
- 📝 Commit sayısı
- 📁 Değişen dosya sayısı  
- ➕ Eklenen satır sayısı
- ➖ Silinen satır sayısı
- 🏗️ Toplam commit sayısı

### Commit Detayları
Her commit için:
- Kategori (emoji + isim)
- Öncelik seviyesi
- Commit hash
- Commit mesajı
- Yazar adı
- Tarih/saat

### Renk Kodları
- 🟡 **Major Updates** (5+ commit): Gold
- 🟢 **Moderate Updates** (3-4 commit): Green  
- 🔵 **Minor Updates** (1-2 commit): Blue
- 🔴 **Hotfixes**: Red
- 🟣 **Pull Requests**: Purple

## ✍️ İdeal Commit Mesajı Formatı

Daha iyi Discord logları için:

```bash
# ✅ Mükemmel örnekler
git commit -m "feat(hero): add smooth entry animations and modern design"
git commit -m "fix(crosshair): resolve validation error for valorant codes"  
git commit -m "style(community): enhance page animations and visual effects"
git commit -m "perf(stats): optimize player data loading speed"

# ⚠️ Kaçınılması gerekenler
git commit -m "fix stuff"
git commit -m "update"
git commit -m "changes"
```

## 🔧 Özelleştirme

### Webhook URL'ini Değiştirme

Webhook URL'nizi değiştirmek için `.github/workflows/discord-updates.yml` dosyasındaki `DISCORD_WEBHOOK` değerini güncelleyin.

### Kategori Ekleme

Yeni kategoriler için `.github/scripts/generate-changelog.js` dosyasındaki `COMMIT_TYPES` objesine ekleyin:

```javascript
myfeature: { 
  emoji: '🆕', 
  category: 'My Feature', 
  color: '#ff6b6b' 
}
```

### Renk Değiştirme

Discord embed renklerini `.github/config/discord-config.json` dosyasından değiştirebilirsiniz.

## 🐛 Sorun Giderme

### Webhook Çalışmıyor
1. Webhook URL'nin doğru olduğunu kontrol edin
2. Discord sunucusunda webhook'un aktif olduğunu doğrulayın
3. GitHub Actions sekmesinde hataları kontrol edin

### Test Etme
```bash
# Manuel test
node .github/scripts/test-webhook.js

# GitHub Actions loglarını kontrol et
# GitHub → Actions → Discord Update Notifications
```

### Yaygın Hatalar

**Error: 404 Not Found**
- Webhook URL'si yanlış veya webhook silinmiş

**Error: 401 Unauthorized** 
- Webhook token'i geçersiz

**Error: Rate Limited**
- Çok fazla mesaj gönderilmiş, birkaç dakika bekleyin

## 🎉 Başarılı Kurulum

Sistem başarıyla kurulduğunda:

1. ✅ Her push'ta Discord'a bildirim gelir
2. ✅ Commit'ler kategorilere ayrılır  
3. ✅ Öncelik seviyeleri gösterilir
4. ✅ İstatistikler detaylı şekilde görünür
5. ✅ Hem siz hem arkadaşınız için çalışır

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Actions loglarını kontrol edin
- `test-webhook.js` script'i ile test yapın
- Commit message formatını kontrol edin

---

**🎯 PLAYVALORANTGUIDES.COM için özel olarak hazırlanmıştır!** 

Artık her geliştirme Discord sunucunuzda güzel formatlanmış update logları ile takip edilecek! 🚀
