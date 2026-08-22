# 🚀 whoisatoshi.net - Deployment Guide

## Quick Start

### ✅ Gereken Şeyler:
- GitHub Hesabı (code storage)
- Vercel veya Netlify Hesabı (deployment)
- Google Analytics Hesabı
- Google AdSense Hesabı
- Domain: whoisatoshi.net (GoDaddy'den aldığınız)

---

## 1️⃣ LOKAL KURULUM (Geliştirme Ortamı)

### 1.1 Repository Başlat
```bash
# Proje klasörü oluştur
mkdir whoisatoshi-net
cd whoisatoshi-net

# Git başlat
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 1.2 Dosyaları Kopyala
```bash
# Tüm dosyaları buraya kopyala:
# - index.html
# - admin.html
# - server.js
# - package.json
# - vercel.json
# - .env.example
```

### 1.3 Dependencies Yükle
```bash
npm install
# Yüklenen paketler:
# - express
# - cors
# - body-parser
# - dotenv
# - express-rate-limit
```

### 1.4 Environment Variables
```bash
# .env dosyası oluştur
cp .env.example .env

# Dosyayı düzenle:
NODE_ENV=development
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
IP_SALT=your-random-salt-here
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
ADMIN_PASSWORD=secure-password-123
```

### 1.5 Lokal Sunucuyu Başlat
```bash
# Geliştirme modu (nodemon ile otomatik reload)
npm run dev

# Çıktı:
# 🚀 whoisatoshi.net API running on port 3001
# 📊 Database: ./data/poll-results.json

# Tarayıcıda aç: http://localhost:3001
```

---

## 2️⃣ GITHUB'A PUSH ETME

### 2.1 Repository Oluştur (GitHub.com)
1. github.com'da login yap
2. "New Repository" tıkla
3. İsim: `whoisatoshi-net`
4. Description: "Interactive detective board investigating Satoshi Nakamoto"
5. Public seç
6. Create Repository

### 2.2 Local'den Push Et
```bash
git add .
git commit -m "Initial commit: whoisatoshi.net setup"
git branch -M main
git remote add origin https://github.com/yourusername/whoisatoshi-net.git
git push -u origin main
```

### 2.3 .gitignore Ekle
```bash
# .gitignore dosyası oluştur
echo "
node_modules/
.env
.env.local
.DS_Store
data/poll-results.json
data/analytics.log
data/ip-logs.json
" > .gitignore

git add .gitignore
git commit -m "Add gitignore"
git push
```

---

## 3️⃣ VERCEL'E DEPLOY ETME (ÖNERİLEN)

### 3.1 Vercel Hesabı Oluştur
1. vercel.com'a git
2. GitHub ile signup yap
3. "Import Project" tıkla
4. GitHub repository'i seç (`whoisatoshi-net`)

### 3.2 Vercel Ayarları
```
Project Settings:
├─ Root Directory: ./ (default)
├─ Build Command: npm run build
├─ Install Command: npm install
├─ Output Directory: ./ (static files)
└─ Environment Variables:
   ├─ NODE_ENV = production
   ├─ ALLOWED_ORIGINS = https://whoisatoshi.net
   ├─ IP_SALT = (güvenli rastgele değer)
   ├─ GOOGLE_ANALYTICS_ID = G-XXXXXXXXXX
   └─ ADMIN_PASSWORD = (güvenli şifre)
```

### 3.3 Custom Domain Bağla
1. Vercel Dashboard → Settings → Domains
2. "Add" tıkla
3. `whoisatoshi.net` gir
4. GoDaddy'deki nameservers'ı Vercel'in nameservers'ı ile değiştir:
   - dns1.vercel-dns.com
   - dns2.vercel-dns.com

### 3.4 Deploy Etme
```bash
# Vercel CLI ile deploy (isteğe bağlı)
npm i -g vercel
vercel

# Sorular:
# Set up and deploy "~/path"? [Y/n] → Y
# Which scope? → Personal
# Link to existing project? → N
# What's your project's name? → whoisatoshi-net
# In which directory is your code? → ./
```

### 3.5 CI/CD Pipeline (Otomatik Deploy)
GitHub'a push ettikten sonra Vercel otomatik olarak build ve deploy eder:
```
push to main → GitHub → Vercel → Auto Deploy → whoisatoshi.net live
```

---

## 4️⃣ ALTERNATIVE: NETLIFY DEPLOY

### 4.1 Netlify Kurulumu
```bash
# Netlify CLI yükle
npm i -g netlify-cli

# Login yap
netlify login

# Site oluştur
netlify init

# İlk deploy
netlify deploy --prod
```

### 4.2 netlify.toml Oluştur
```toml
[build]
command = "npm run build"
functions = "api"
publish = "."

[functions]
node-bundler = "esbuild"

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/api"
status = 200

[[headers]]
for = "/api/*"
[headers.values]
Access-Control-Allow-Origin = "*"
Cache-Control = "no-cache"
```

---

## 5️⃣ GOOGLE ANALYTICS KURULUMU

### 5.1 GA4 Hesabı
1. analytics.google.com'a git
2. "Create Account" tıkla
3. Property oluştur:
   - Property Name: "whoisatoshi.net"
   - Timezone: Turkey (UTC+3)
   - Currency: TRY (Türk Lirası)

### 5.2 Measurement ID
1. Admin → Property Settings → Tracking Info
2. Google Tag'ı kopyala:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
3. `index.html`'de `G-XXXXXXXXXX` yerine koyabileceğin ID'yi kopyala

### 5.3 Custom Events Ayarla
Analytics → Events → Custom Events:
- `poll_vote` - When user votes
- `ad_click` - When ad is clicked
- `page_view` - Default tracking

---

## 6️⃣ GOOGLE ADSENSE KURULUMU

### 6.1 AdSense Hesabı
1. adsense.google.com'a git
2. "Sign up now"
3. whoisatoshi.net domain'i gir
4. Siteye AdSense kodu ekle (verilen koddaki placeholder'ları değiştir)

### 6.2 Ad Units Oluştur
```
AdSense Hesabı → Ads → Ad Units → Create

Ad Unit 1 (Left Sidebar):
└─ Name: "Left Sidebar Banner"
└─ Size: 300x600
└─ Type: Display Ad

Ad Unit 2 (Right Sidebar):
└─ Name: "Right Sidebar Banner"
└─ Size: 300x600
└─ Type: Display Ad

Ad Unit 3 (Footer):
└─ Name: "Footer Leaderboard"
└─ Size: 728x90
└─ Type: Display Ad
```

### 6.3 Kodları Yerleştir
`index.html`'de her sidebar-section'ın içine:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXX"
     data-ad-slot="XXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

## 7️⃣ AFFILIATE PROGRAMS KURULUMU

### 7.1 Binance Affiliate
1. binance.com → Account → Referral
2. Referral ID kopyala
3. `index.html`'de şu link'i değiştir:
```html
<a href="https://www.binance.com/en/register?ref=YOUR_BINANCE_ID">
```

### 7.2 Gate.io Affiliate
1. gate.io → Account → Referral Program
2. Referral Code kopyala
3. Link'i güncelle:
```html
<a href="https://www.gate.io/signup/GATECODE?ref_code=GATECODE">
```

### 7.3 Peperstone Affiliate
1. Peperstone → Affiliate Program
2. Apply for program
3. Affiliate link al
4. Sağ sidebar'da güncelle

**Diğer borsalar (Bybit, OKX, Exness, OctaFX) için aynı işlemi tekrar et**

---

## 8️⃣ ADMIN PANEL GÜVENLIĞI

### 8.1 Password Koruması
`server.js`'e authentication middleware ekle:
```javascript
// auth.js oluştur
const adminPassword = process.env.ADMIN_PASSWORD;

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === adminPassword) {
        // JWT token ver
        res.json({ token: 'xxx', expires: '24h' });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});
```

### 8.2 Admin Panel'e Erişim
```
https://whoisatoshi.net/admin
Şifre: process.env.ADMIN_PASSWORD
```

---

## 9️⃣ DNS & EMAIL KURULUMU (GoDaddy)

### 9.1 Vercel Nameservers
GoDaddy Dashboard → Domains → whoisatoshi.net → DNS Management
```
Nameservers:
- dns1.vercel-dns.com
- dns2.vercel-dns.com
```

### 9.2 Email Kurulumu (isteğe bağlı)
```
GoDaddy → Email hosting:
- ads@whoisatoshi.net (reklam sorguları)
- contact@whoisatoshi.net (iletişim)
- info@whoisatoshi.net (genel)
```

---

## 🔟 LAUNCH CHECKLIST

### Pre-Launch:
- [ ] GitHub'a tüm kod push edildi
- [ ] Vercel'de live ve çalışıyor
- [ ] Domain nameservers Vercel'e işaret ediyor
- [ ] SSL/TLS sertifikası kurulu (Vercel otomatik)
- [ ] Google Analytics kurulu
- [ ] Google AdSense kodu eklendi
- [ ] Tüm affiliate linkler test edildi
- [ ] Admin paneli password protected
- [ ] .env dosyası production values'lar ile güncellendi
- [ ] Lighthouse score 90+
- [ ] Mobile responsive test edildi

### Launch Day:
```bash
# GitHub Actions (isteğe bağlı) - auto-deploy
# Vercel CI/CD enable: Settings → Git → Deploy on Push

# Sosyal medya'da duyur:
# 1. Twitter: @whoisatoshi_net
# 2. Reddit: r/Bitcoin, r/cryptocurrency
# 3. LinkedIn: Tech article
# 4. YouTube: Link in description
```

### Post-Launch:
- [ ] Trafik monitoring (GA4)
- [ ] Hatalı linkler kontrol
- [ ] Affiliate link performance tracking
- [ ] Ad revenue monitoring
- [ ] User feedback collection
- [ ] SEO optimization
- [ ] Sosyal medya engagement

---

## 🔐 SECURITY BEST PRACTICES

### Vercel:
- [ ] Environment variables protected
- [ ] HTTPS only enforcement
- [ ] Rate limiting aktif
- [ ] CORS properly configured

### Database:
- [ ] Poll data regular backup
- [ ] IP logs encrypted
- [ ] No sensitive data in logs

### Monitoring:
```bash
# Vercel Analytics
# Sentry (error tracking) - optional
# Uptime monitoring: UptimeRobot
```

---

## 📊 MONITORING & MAINTENANCE

### Weekly:
- Traffic trends check
- Ad performance review
- New poll results analysis

### Monthly:
- Revenue report
- User engagement metrics
- Server performance review
- Backup verification

### Quarterly:
- SEO audit
- Conversion rate analysis
- Content updates
- Feature additions

---

## 💡 TIPS & TRICKS

### Performance Optimization:
```bash
# Image optimization
npm i -g imagemin-cli
imagemin assets/images --out-dir=assets/images/optimized

# Minify CSS/JS
npm i -g minify-js minify-css
```

### Traffic Sources:
1. **Organic**: Google SEO (keywords: "Satoshi Nakamoto", "Bitcoin creator")
2. **Referral**: Bitcoin forums, crypto communities
3. **Direct**: Affiliate links from other sites
4. **Social**: Twitter, Reddit, LinkedIn

### Revenue Maximization:
- Ad placement: Above fold for max visibility
- Affiliate CTR: 2-5% is good
- AdSense RPM: $2-8 typical for tech content
- Total Monthly: $500-3000 (realistic for 5K-50K users)

---

## 🆘 TROUBLESHOOTING

### Domain not working?
```
1. DNS propagation 24-48 saat sürer
2. GoDaddy DNS settings kontrol et
3. Vercel custom domain settings kontrol et
```

### Vercel deployment error?
```
1. Logs kontrol: vercel.com → Deployments → Logs
2. package.json dependencies check
3. build command test et: npm run build
```

### API not responding?
```
1. Backend health: GET /api/health
2. CORS settings check
3. Rate limiting aktif mi kontrol et
```

---

## 📞 SUPPORT

- Vercel Docs: https://vercel.com/docs
- Express.js: https://expressjs.com/
- Chart.js: https://www.chartjs.org/
- Google Analytics: https://support.google.com/analytics

---

**Hazır mısın başlatmaya? 🚀**

Next steps:
1. GitHub repository oluştur
2. Vercel'e connect et
3. Domain DNS'i güncelle
4. AdSense & Analytics kur
5. Live git!

Good luck! 🎯
