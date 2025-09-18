# PlayValorantGuides.com - VPS Kurulum Rehberi

## 🎯 Domain: playvalorantguides.com
## 📅 Güncelleme: 2025-09-18

---

## 🔧 **1. VPS Hazırlık**

### **VPS'e Bağlan:**
```bash
ssh root@194.105.5.37
```

### **Sistem Güncelleme:**
```bash
apt update && apt upgrade -y
apt install -y curl wget git htop nano
```

---

## 🟢 **2. Node.js ve PM2 Kurulumu**

### **Node.js 20 Kurulumu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
```

### **PM2 Global Kurulum:**
```bash
npm install -g pm2
pm2 startup
pm2 save
```

---

## 🌐 **3. Caddy Kurulumu**

### **Caddy Repository Ekleme:**
```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
```

### **Caddy Kurulum:**
```bash
apt update
apt install caddy
systemctl enable caddy
systemctl start caddy
```

### **Log Dizini Oluşturma:**
```bash
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy
chmod 755 /var/log/caddy
```

---

## ⚙️ **4. Caddy Konfigürasyon**

### **Mevcut Caddyfile'ı Yedekle:**
```bash
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup
```

### **Yeni Konfigürasyonu Kopyala:**
```bash
# caddy.txt dosyasını /etc/caddy/Caddyfile'a kopyala
nano /etc/caddy/Caddyfile
# caddy.txt içeriğini yapıştır ve kaydet
```

### **Konfigürasyonu Test Et:**
```bash
caddy validate --config /etc/caddy/Caddyfile
caddy fmt --overwrite /etc/caddy/Caddyfile
```

### **Caddy'yi Yeniden Başlat:**
```bash
systemctl restart caddy
systemctl status caddy
```

---

## 🔥 **5. Firewall Ayarları**

### **UFW Konfigürasyonu:**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8080/tcp  # Health check
ufw --force enable
ufw status
```

---

## 🗄️ **6. Proje Dizini Hazırlığı**

### **Ana Dizin Oluştur:**
```bash
mkdir -p /root/valoclass
cd /root/valoclass
```

---

## 📊 **7. Sistem Test Komutları**

### **PM2 Durumu:**
```bash
pm2 status
pm2 logs --lines 20
```

### **Port Kontrolü:**
```bash
ss -tulpn | grep -E ':(80|443|3000|8000|8080)'
```

### **Servis Testleri:**
```bash
# Frontend test
curl -I http://localhost:3000

# Backend test
curl -I http://localhost:8000

# Caddy test
curl -I http://localhost:80

# Health check
curl http://localhost:8080/health
curl http://localhost:8080/status
```

### **Domain Test:**
```bash
# DNS test
nslookup playvalorantguides.com 1.1.1.1

# HTTP test
curl -I http://playvalorantguides.com

# HTTPS test
curl -I https://playvalorantguides.com
```

---

## 🌍 **8. DNS Ayarları**

### **playvalorantguides.com için DNS Records:**

| Type | Name | Content | TTL |
|------|------|---------|-----|
| A | @ | 194.105.5.37 | 300 |
| A | www | 194.105.5.37 | 300 |
| A | api | 194.105.5.37 | 300 |
| A | dev | 194.105.5.37 | 300 |
| CNAME | * | playvalorantguides.com | 300 |

---

## 🔍 **9. Log Takibi**

### **Caddy Logları:**
```bash
# Real-time log
journalctl -u caddy -f

# Access logs
tail -f /var/log/caddy/playvalorantguides.log
```

### **PM2 Logları:**
```bash
# Frontend logs
pm2 logs valoclass-frontend

# Backend logs
pm2 logs valoclass-backend

# Tüm loglar
pm2 logs
```

---

## 🚀 **10. Deployment Test**

### **GitHub Actions Trigger:**
1. Repository'de küçük değişiklik yap
2. Git commit ve push yap
3. GitHub Actions'da logs takip et
4. Deployment sonrası test et

### **Manuel Test:**
```bash
echo "=== PlayValorantGuides System Test ==="

echo "1. PM2 Status:"
pm2 status

echo -e "\n2. Service Ports:"
ss -tulpn | grep -E ':(3000|8000|80|443)'

echo -e "\n3. Health Checks:"
curl -s http://localhost:8080/health
curl -s http://localhost:8080/status | jq .

echo -e "\n4. Domain Test:"
curl -I https://playvalorantguides.com

echo -e "\n=== Test Complete ==="
```

---

## 🔧 **11. Maintenance Komutları**

### **Caddy Yönetimi:**
```bash
# Restart
systemctl restart caddy

# Reload (config değişikliği)
systemctl reload caddy

# Status
systemctl status caddy

# Logs
journalctl -u caddy --since "1 hour ago"
```

### **PM2 Yönetimi:**
```bash
# Tüm process'leri restart
pm2 restart all

# Belirli process restart
pm2 restart valoclass-frontend
pm2 restart valoclass-backend

# Process durumlarını kaydet
pm2 save

# Startup script güncelle
pm2 startup
```

### **System Monitoring:**
```bash
# Disk kullanımı
df -h

# Memory kullanımı
free -h

# CPU ve process'ler
htop

# Network connections
ss -tulpn
```

---

## 🆘 **12. Troubleshooting**

### **Caddy Çalışmıyor:**
```bash
# Config syntax check
caddy validate --config /etc/caddy/Caddyfile

# Permission check
chown -R caddy:caddy /var/log/caddy

# Port conflict check
ss -tulpn | grep :80
```

### **PM2 Process'ler Çalışmıyor:**
```bash
# Process yeniden başlat
cd /root/valoclass
pm2 restart all

# Log kontrol
pm2 logs --lines 50

# Manual başlatma test
cd /root/valoclass && npm start
cd /root/valoclass/backend && npm start
```

### **SSL Sertifika Sorunu:**
```bash
# Let's Encrypt logs
journalctl -u caddy | grep -i "certificate"

# DNS propagation kontrol
nslookup playvalorantguides.com 8.8.8.8

# Sertifika yenileme
systemctl reload caddy
```

---

## 📞 **Support & Contacts**

- **Domain**: playvalorantguides.com
- **Health Check**: http://194.105.5.37:8080/health
- **Admin Panel**: https://playvalorantguides.com/admin
- **Dev Environment**: https://dev.playvalorantguides.com

---

**🎯 Bu rehberi takip ederek PlayValorantGuides.com'u başarıyla deploy edebilirsiniz!**
