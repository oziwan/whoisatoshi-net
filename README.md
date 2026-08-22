# 🔍 whoisatoshi.net

## Who is Satoshi Nakamoto? Interactive Detective Board

Bir interaktif araştırma sitesi: Bitcoin'in yaratıcısı Satoshi Nakamoto'nun kimliğini bulmaya çalışan bir dedektif tahtası.

---

## 🎯 Proje Özeti

**whoisatoshi.net**, aşağıdaki özelliklerle tam fonksiyonel bir web uygulaması:

✅ **Ana Özellikler:**
- 📋 Şüpheliler için interaktif kartlar (Hal Finney, Nick Szabo, Adam Back, vb.)
- 🗳️ Canlı anket sistemi (kullanıcılar kim olduğunu tahmin ediyor)
- 📊 Gerçek zamanlı sonuçlar (Chart.js grafikleri)
- 💰 Affiliate marketing sistemi (Binance, Gate.io, Peperstone, vb.)
- 📢 Özel reklam alanları (sol/sağ sidebar + footer)
- 🎨 Google Ads entegrasyonu
- 🛡️ Admin panel (istatistikler + reklam yönetimi)
- 📱 Responsive design (mobile/tablet/desktop)

---

## 📁 Proje Yapısı

```
whoisatoshi-project/
├── index.html                    # Ana sayfa (dedektif tahtası)
├── admin.html                    # Admin panel (istatistikler)
├── server.js                     # Node.js backend API
├── package.json                  # npm dependencies
├── vercel.json                   # Vercel deployment config
├── .env.example                  # Environment variables template
├── DEPLOYMENT_GUIDE.md           # Adım-adım deployment rehberi
├── README.md                     # Bu dosya
└── satoshi_project_blueprint.md  # Teknik mimari detayları
```

---

## 🚀 HIZLI BAŞLANGIÇ (5 Dakika)

### 1. Lokal Kurulum
```bash
cd whoisatoshi-project
npm install
cp .env.example .env
npm run dev
```
→ **Açıl:** http://localhost:3001

### 2. Deploy (Vercel)
```bash
vercel login
vercel --prod
```

### 3. Domain Bağla (GoDaddy)
DNS nameservers'ı Vercel'in nameservers'ı ile değiştir:
- `dns1.vercel-dns.com`
- `dns2.vercel-dns.com`

---

## 🎨 SAYFA LAYOUT

```
┌─────────────────────────────────────────────────────┐
│           HEADER (Logo + Navigation)                │
├─────────────┬──────────────────┬───────────────────┤
│  LEFT SIDE  │   MAIN CONTENT   │   RIGHT SIDE      │
│   ADS       │  3 TABS:         │   ADS             │
│             │  1. Board        │                   │
│  Kripto     │  2. Poll         │   Forex           │
│  Borsaları: │  3. Results      │   Şirketleri:     │
│             │                  │                   │
│ • Binance   │  Dedektif Board  │ • Peperstone      │
│ • Gate.io   │  Şüpheliler      │ • OctaFX          │
│ • Bybit     │  Kartlar         │ • Exness          │
│             │                  │                   │
│ + AD SPACE  │                  │ + AD SPACE        │
└─────────────┴──────────────────┴───────────────────┘
│                    FOOTER                          │
│              Google Ads Leaderboard                │
└─────────────────────────────────────────────────────┘
```

---

## 📊 SAYFA İÇERİĞİ

### TAB 1: Dedektif Tahtası (Detective Board)
- **4 Ana Şüpheli:**
  1. Hal Finney (Score: 9.2/10)
  2. Nick Szabo (Score: 8.8/10)
  3. Adam Back (Score: 8.5/10)
  4. Len Sassaman (Score: 7.3/10)

- **Her Kart İçeriyor:**
  - Fotoğraf + İsim
  - Kanıtlar (yıldız sistemi)
  - Karşı argümanlar
  - Bağlantı ağı

### TAB 2: Anket (Poll)
```
Soru: "Kim olduğunu düşünüyorsun?"
└─ Seçenekler: Hal Finney / Nick Szabo / Adam Back / ...
└─ 1 Oy / IP / Gün
└─ Cevaptan sonra sonuçlar göster
```

### TAB 3: Sonuçlar (Results)
- Pasta grafik (Doughnut chart)
- Tablo (Aday, Oy, Yüzde)
- Otomatik güncelleme (10 saniye)

---

## 💰 PARA KAZANÇ KAYNEKLARI

### 1. Affiliate Marketing
```
Kripto (Sol Sidebar):
├─ Binance → 0.25-0.5% commission
├─ Gate.io → 0.2-0.4% commission
├─ Bybit → 0.1-0.3% commission
└─ OKX → 0.15-0.35% commission

Forex (Sağ Sidebar):
├─ Peperstone → 2-3% rebate
├─ OctaFX → 1-2% rebate
└─ Exness → 1.5-2.5% rebate

Tahmini: €500-1000/ay (stabil trafik ile)
```

### 2. Google AdSense
```
RPM: €2-5 (Tech/Finance niche)
Tahmini: €500-1000/ay
```

### 3. Premium Ad Slots
```
Sol/Sağ Sidebar (300x600):
├─ Slot başı: €50-200/ay
├─ Toplam 6 slot: €300-1200/ay
└─ "Buraya reklam girebilirsiniz" bölümü
```

**TOPLAM AYLIK TÜV: €1300-3200/ay**

---

## 🔧 TEKNİK STACK

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Charts** | Chart.js |
| **Backend** | Node.js + Express.js |
| **Database** | JSON (SQLite upgrade edilebilir) |
| **Deployment** | Vercel (recommended) / Netlify |
| **Analytics** | Google Analytics 4 |
| **Ads** | Google AdSense |
| **Domain** | GoDaddy (purchased) |

---

## 📋 API ENDPOINTS

### GET Requests:
```
GET /api/health
→ Server health check

GET /api/candidates
→ Tüm şüpheliler + kanıtlar

GET /api/poll/results
→ Anket sonuçları (real-time)

GET /api/stats
→ Dashboard istatistikleri
```

### POST Requests:
```
POST /api/poll/vote
Body: { "candidate": "Hal Finney" }
→ Oy kabul et + sonuçları döndür
```

---

## 🛡️ GÜVENLIK ÖZELLIKLERI

✅ **Rate Limiting:** 100 req/15min per IP
✅ **1 Oy/IP/Gün:** IP hashing + timestamp kontrol
✅ **CORS Protection:** Whitelist domains
✅ **HTTPS Only:** SSL sertifikası
✅ **Admin Password:** Environment variable
✅ **Data Privacy:** No personal data logged

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Desktop  (1024px+)  → 3 column layout
Tablet   (768-1023px) → 2 column layout
Mobile   (<768px)    → 1 column layout + hamburger nav
```

---

## 📈 SEO OPTIMIZASYON

**Meta Tags:**
- Title, Description, OG tags
- Schema.org JSON-LD

**Keywords:**
- "Satoshi Nakamoto"
- "Bitcoin creator"
- "Who is Satoshi"
- "Bitcoin history"
- "Cryptocurrency mystery"

**Linkler:**
- Bitcoin forums
- Crypto communities
- Reddit: r/Bitcoin, r/cryptocurrency
- YouTube descriptions

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Vercel (✅ Recommended)
- Free tier: 12GB RAM, unlimited requests
- Auto-deploy from GitHub
- Custom domain
- Environment variables
- Built-in analytics

### Option 2: Netlify
- Free tier: 300 mins/month builds
- Netlify Functions for backend
- Forms handling built-in
- A/B testing

### Option 3: Self-hosted
- VPS (DigitalOcean, Linode)
- Full control
- Higher cost (~$5-10/month)

---

## 📦 SETUP CHECKLIST

### Pre-Launch:
- [ ] Code push to GitHub
- [ ] Vercel deploy connected
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Google Analytics installed
- [ ] Google AdSense approved
- [ ] Affiliate links added
- [ ] Admin panel secured
- [ ] .env production values set
- [ ] Mobile responsive tested

### Launch:
- [ ] Social media announcement
- [ ] Reddit communities notification
- [ ] Bitcoin forums link
- [ ] YouTube descriptions

### Post-Launch:
- [ ] Daily traffic monitoring
- [ ] Weekly report review
- [ ] Monthly revenue report
- [ ] Quarterly SEO audit

---

## 💡 IMPROVEMENTS & FEATURES

### Phase 2 (Coming Soon):
- [ ] Newsletter signup
- [ ] User accounts + voting history
- [ ] Advanced filters for detective board
- [ ] Email notifications for updates
- [ ] Social sharing buttons
- [ ] Dark/Light theme toggle

### Phase 3 (Future):
- [ ] Mobile app (React Native)
- [ ] Blockchain integration (Ethereum)
- [ ] NFT badges for active voters
- [ ] Multiple language support
- [ ] Community forum
- [ ] Donation system (Crypto)

---

## 📞 SUPPORT & RESOURCES

**Official Docs:**
- https://vercel.com/docs
- https://expressjs.com/
- https://www.chartjs.org/

**Tutorials:**
- YouTube: "Node.js + Express tutorial"
- FreeCodeCamp: "Full Stack JavaScript"

**Community:**
- Stack Overflow: tag `express` `vercel`
- GitHub Discussions
- Reddit: r/learnprogramming

---

## 📄 LICENSE

MIT License - Kaynak kod açık kullanıma açıktır.

---

## 👨‍💻 CREATOR

**Your Name**
- GitHub: @yourusername
- Twitter: @yourhandle
- Email: contact@whoisatoshi.net

---

## 🎯 SUCCESS METRICS (3 Months)

| Metric | Goal |
|--------|------|
| Monthly Users | 10,000+ |
| Total Votes | 50,000+ |
| Affiliate Clicks | 500+ |
| Ad Revenue | $1,000+ |
| Returning Visitors | 30%+ |
| Avg. Session Duration | 3+ min |

---

## 🚀 READY TO LAUNCH?

1. **GitHub:** Repository oluştur ve kod push et
2. **Vercel:** Site'i connect ve deploy et
3. **GoDaddy:** Domain DNS'i güncelle
4. **Google:** Analytics + AdSense kur
5. **Go Live:** Sosyal medya'da duyur

**Let's go! 🎯**
