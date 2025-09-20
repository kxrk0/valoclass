# 📝 Commit Message Guidelines - PLAYVALORANTGUIDES.COM

Bu dokuman, proje için commit message formatını ve Discord webhook sisteminin nasıl çalıştığını açıklar.

## 🎯 Commit Message Format

Daha iyi Discord update logları için conventional commit formatı kullanın:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 📦 Commit Types

| Type | Emoji | Description | Example |
|------|-------|-------------|---------|
| `feat` | ✨ | Yeni özellik | `feat(hero): add valorant player search bar` |
| `fix` | 🐛 | Bug düzeltmesi | `fix(crosshair): resolve code validation error` |
| `style` | 🎨 | UI/tasarım değişiklikleri | `style(hero): enhance animations and transitions` |
| `refactor` | ♻️ | Code refactoring | `refactor(auth): optimize login component` |
| `perf` | ⚡ | Performans iyileştirmesi | `perf(stats): optimize data loading` |
| `docs` | 📝 | Dokümantasyon | `docs: update README with new features` |
| `test` | 🧪 | Test ekleme/düzenleme | `test(lineup): add unit tests` |
| `build` | 🏗️ | Build sistemi | `build: update dependencies` |
| `ci` | 👷 | CI/CD değişiklikleri | `ci: add discord webhook automation` |
| `chore` | 🔧 | Maintenance | `chore: clean up unused files` |
| `security` | 🔒 | Güvenlik | `security: fix authentication vulnerability` |

### 🎮 Valorant-Specific Types

| Type | Emoji | Description | Example |
|------|-------|-------------|---------|
| `valorant` | 🎯 | Valorant özellikleri | `valorant(agents): add new agent info` |
| `hero` | 🦸 | Hero section | `hero: redesign with modern animations` |
| `crosshair` | 🎯 | Crosshair sistemi | `crosshair: implement code validation` |
| `lineup` | 📐 | Lineup özellikleri | `lineup: add search and filter functionality` |
| `stats` | 📊 | İstatistik sistemi | `stats: integrate real-time player data` |
| `community` | 👥 | Topluluk özellikleri | `community: enhance user interaction` |
| `auth` | 🔐 | Authentication | `auth(riot): integrate Riot ID login` |

### 📍 Scope Examples

- `hero` - Hero section
- `crosshair` - Crosshair builder/gallery
- `lineup` - Lineup sistem
- `stats` - Statistics sayfası
- `community` - Community sayfası
- `auth` - Authentication
- `api` - API endpoints
- `ui` - User interface
- `db` - Database
- `config` - Configuration

### ⭐ Priority Indicators

Commit mesajınızda bu kelimeler kullanarak öncelik belirleyin:

- **High Priority** 🔥: `breaking`, `critical`, `urgent`, `major`, `security`
- **Medium Priority** ⭐: `important`, `significant`, `enhance`, `improve`
- **Low Priority** 💡: `minor`, `small`, `tweak`, `update`

## 💬 Discord Webhook System

### 🔄 Nasıl Çalışır?

1. **Otomatik Tetikleme**: `main` branch'a push veya PR merge olduğunda
2. **Commit Analizi**: Son commit'ler analiz edilir ve kategorilere ayrılır
3. **Discord Bildirimi**: Detaylı embed mesaj Discord sunucusuna gönderilir

### 📊 Update Log İçeriği

Discord mesajında şunlar yer alır:

- **Update Özeti**: Commit sayısı, değişen dosya sayısı
- **Kategorize Edilmiş Değişiklikler**: Type'a göre gruplandırılmış
- **Öncelik Seviyeleri**: 🔥 High, ⭐ Medium, 💡 Low
- **Geliştirici Bilgileri**: Kim, ne zaman commit yaptı
- **Repository İstatistikleri**: Toplam commit sayısı

### 🎨 Renk Kodları

- **Major Updates** (5+ commit): 🟡 Gold (#f1c40f)
- **Moderate Updates** (3-4 commit): 🟢 Green (#2ecc71)  
- **Minor Updates** (1-2 commit): 🔵 Blue (#3498db)
- **Hotfixes**: 🔴 Red (#e74c3c)

## ✅ Good Commit Examples

```bash
# Feature additions
git commit -m "feat(hero): add smooth entry animations and modern design"
git commit -m "feat(crosshair): implement real valorant crosshair codes"

# Bug fixes  
git commit -m "fix(stats): resolve player search API timeout issue"
git commit -m "fix(auth): correct riot ID button redirection"

# UI/Style improvements
git commit -m "style(community): enhance page animations and visual effects"
git commit -m "style(lineup): redesign cards with glassmorphism"

# Major updates
git commit -m "feat(valorant): major redesign of all game-related pages"
```

## ❌ Avoid These

```bash
# Too vague
git commit -m "fix stuff"
git commit -m "update"

# No context
git commit -m "changes"
git commit -m "wip"

# Not descriptive
git commit -m "small fix"
git commit -m "misc updates"
```

## 🚀 Pro Tips

1. **Clear & Descriptive**: Açık ve anlaşılır commit mesajları yazın
2. **Use Scopes**: Hangi bölümde değişiklik yaptığınızı belirtin
3. **Priority Keywords**: Önemli değişiklikler için priority keyword'ler kullanın  
4. **Atomic Commits**: Her commit tek bir şey yapsın
5. **Present Tense**: "add" not "added", "fix" not "fixed"

## 🤖 Discord Webhook URL

Webhook URL: `https://discord.com/api/webhooks/1418956975256895518/4J_UApL7o6pxD_PkFEKXI0umRtmPcy9PZQ-R8kXC-EsDrpHfHADSRIso8A_iNlyv9Ta4`

Bu sistem hem sizde hem de arkadaşınızda otomatik çalışacak. Her push'ta güzel formatlanmış update logları Discord sunucunuzda görünecek! 🎉
