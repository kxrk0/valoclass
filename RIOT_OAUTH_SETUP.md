# Riot ID OAuth Setup Guide

## 🚀 Riot Games OAuth Entegrasyonu

Bu dokümanda Riot ID ile giriş sistemini nasıl kuracağınız açıklanmaktadır.

## 📋 Gereksinimler

### 1. Riot Developer Portal'dan OAuth Credentials Alın

1. [Riot Developer Portal](https://developer.riotgames.com/) adresine gidin
2. Hesabınızla giriş yapın (Riot ID kullanın)
3. "Create New App" butonuna tıklayın
4. Uygulama bilgilerinizi doldurun:
   - **App Name**: ValoClass
   - **App Type**: Web Application
   - **Redirect URI**: `http://localhost:3000/api/auth/oauth/riot`
   - **Description**: Valorant community platform

5. Uygulamanız onaylandıktan sonra aşağıdaki bilgileri alacaksınız:
   - **Client ID** (örn: `abc123def456`)
   - **Client Secret** (örn: `secret123xyz789`)

### 2. Environment Variables Setup

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Riot Games OAuth Credentials
RIOT_CLIENT_ID=your_riot_client_id_here
RIOT_CLIENT_SECRET=your_riot_client_secret_here
RIOT_API_KEY=RGAPI-c8b0dfbe-aab0-470b-911e-ce40139d7d5e

# OAuth Redirect URI
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database (if needed)
DATABASE_URL=your_database_url_here
```

### 3. NextAuth Secret Oluşturun

Terminal'de aşağıdaki komutu çalıştırın:

```bash
openssl rand -base64 32
```

Çıktıyı `NEXTAUTH_SECRET` olarak kullanın.

## 🧪 Test Etme

### API Anahtarını Test Edin

```bash
curl http://localhost:3000/api/test/riot
```

### Riot ID Lookup Test Edin

```bash
curl -X POST http://localhost:3000/api/test/riot \
  -H "Content-Type: application/json" \
  -d '{"gameName":"YourRiotID","tagLine":"TAG"}'
```

## 🔧 OAuth Flow

1. Kullanıcı "Continue with Riot ID" butonuna tıklar
2. Riot'un OAuth sayfasına yönlendirilir
3. Kullanıcı giriş yapar ve izinleri onaylar
4. Riot callback URL'e authorization code gönderir
5. Sunucumuz bu code'u access token ile değiştirir
6. Access token ile kullanıcı bilgilerini alırız
7. Kullanıcı sisteme giriş yapmış olur

## 🛠️ Mevcut Durum

✅ **Tamamlanan:**
- Riot ID butonu eklendi
- OAuth route oluşturuldu
- Riot API servisi hazırlandı
- Test endpoint'leri eklendi

⏳ **Yapılacaklar:**
- `.env.local` dosyasında OAuth credentials set edin
- Riot Developer Portal'da uygulama oluşturun
- Production için HTTPS redirect URI güncelleyin

## 🔗 Faydalı Linkler

- [Riot Developer Portal](https://developer.riotgames.com/)
- [Riot Games API Documentation](https://developer.riotgames.com/docs/portal)
- [OAuth 2.0 Guide](https://developer.riotgames.com/docs/portal#web-apis_oauth)

## 📞 Destek

Herhangi bir sorun yaşarsanız Riot Developer Discord kanallarını kullanabilirsiniz.
