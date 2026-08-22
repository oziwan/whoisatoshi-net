# whoisatoshi.net - Web Sitesi Proje Planı

## 1. PROJE YAPISI

```
whoisatoshi.net/
├── index.html                 # Ana sayfa (dedektif tahtası)
├── assets/
│   ├── css/
│   │   ├── main.css           # Ana tasarım
│   │   ├── detective-board.css # Tahtaya özgü stiller
│   │   ├── sidebar.css        # Reklam panelleri
│   │   └── responsive.css     # Mobile uyumlu
│   ├── js/
│   │   ├── app.js             # Ana uygulama mantığı
│   │   ├── detective-board.js # Tahtanın interaktif özellikleri
│   │   ├── poll.js            # Anket sistemi
│   │   ├── ads-manager.js     # Reklam yönetimi
│   │   └── analytics.js       # Veri toplama
│   └── images/
│       ├── candidates/        # Şüpheli fotoğrafları
│       └── evidence/          # Delil görselleri
├── data/
│   ├── candidates.json        # Şüpheliler (150+ veri)
│   ├── poll-results.json      # Anket sonuçları (gerçek zaman)
│   └── ads-config.json        # Reklam ayarları
└── server/
    ├── api.js                 # Backend (Node.js)
    ├── db.json                # Anket verileri
    └── config.js              # API konfigürasyonu
```

---

## 2. SAYFA LAYOUT (3-COLUMN DESIGN)

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER + NAV                         │
├──────────────┬──────────────────────────┬──────────────┤
│              │                          │              │
│   LEFT       │    MAIN CONTENT          │    RIGHT     │
│   SIDEBAR    │  (DETECTIVE BOARD)       │   SIDEBAR    │
│   880px      │                          │   880px      │
│              │  TAB 1: Tahtası          │              │
│ KRIPTO       │  TAB 2: Anket            │  FOREX       │
│ BORSALARI    │  TAB 3: Results          │  ŞİRKETLERİ  │
│              │                          │              │
│ • Binance    │                          │ • Peperstone │
│ • Gate.io    │                          │ • OctaFX     │
│ • Bybit      │                          │ • Exness     │
│ • OKX        │                          │              │
│              │                          │              │
│ + AD SPACE   │                          │ + AD SPACE   │
│              │                          │              │
└──────────────┴──────────────────────────┴──────────────┘
│                    FOOTER + GOOGLE ADS                  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. KRİPTO TARAFLARI (TAB 1 - DEDEKTIF TAHTASI)

### Ana Özellikler:
- **İnteraktif Kartlar**: Her şüpheli için genişletilebilir kartlar
- **Bağlantı Ağı**: Şüpheliler arasında ilişkiler gösterilecek
- **Kanıt Sistemi**: Tıklanabilir kanıtlar, detay gösterir
- **Filtreleme**: Kategori bazında (Teknik Yetenek, Yazı Stili, vb.)
- **Zoom/Pan**: Kullanıcı tahtayı inceleyebilsin

### Şüpheli Kartı Yapısı:
```json
{
  "id": "hal-finney",
  "name": "Hal Finney",
  "birth_year": 1956,
  "death_year": 2014,
  "role": "First Bitcoin TX receiver",
  "evidence": [
    {
      "type": "writing_style",
      "confidence": 5,
      "description": "NYT analysis: closest match",
      "sources": ["NYT", "2014"]
    }
  ],
  "against": [
    "ALS patient since 2009",
    "Cryopreservation in 2014"
  ],
  "connections": ["nick-szabo", "adam-back"],
  "score": 8.5
}
```

---

## 4. ANKET SİSTEMİ (TAB 2)

### Anket Sorusu:
**"Satoshi Nakamoto kim?"**

- Hal Finney
- Nick Szabo
- Adam Back
- Len Sassaman
- Bir grup (Collective)
- Henüz belli değil

### Teknik Detaylar:
- LocalStorage + Backend'e POST gönder
- Aynı IP'den 1 oy (cookie/sessionStorage kontrol)
- Gerçek zaman sonuçları (Socket.io veya Polling)
- Grafikler (Chart.js): Pasta/Bar Chart
- Cevap sonrası anında sonuçlar göster

```javascript
// Anket POST örneği
POST /api/poll/vote
{
  "candidate": "hal-finney",
  "timestamp": 1692345600,
  "ip_hash": "sha256(ip)",
  "user_agent": "Mozilla/5.0..."
}

RESPONSE:
{
  "voted": true,
  "results": {
    "hal-finney": 2450,
    "nick-szabo": 2100,
    "adam-back": 1950,
    ...
  },
  "chart_data": {...}
}
```

---

## 5. YANLIK AD SISTEMI

### Sol Sidebar (Kripto Borsaları)
```
┌─────────────┐
│  BINANCE    │
│   BANNER    │
│  (300x600)  │ → https://binance.com?ref=XXXXX
└─────────────┘
│             │
│  GATE.IO    │
│   BANNER    │
│  (300x600)  │ → https://gate.io?ref=XXXXX
└─────────────┘
│             │
│  Buraya     │
│  Reklam     │
│  Girebil.   │
│  (300x600)  │ → admin panel
└─────────────┘
```

### Sağ Sidebar (Forex)
```
┌─────────────┐
│ PEPERSTONE  │
│   BANNER    │
│  (300x600)  │ → https://peperstone.com?ref=XXXXX
└─────────────┘
│             │
│  OCTAFX     │
│   BANNER    │
│  (300x600)  │ → https://octafx.com?ref=XXXXX
└─────────────┘
│             │
│  EXNESS     │
│   BANNER    │
│  (300x600)  │ → https://exness.com?ref=XXXXX
└─────────────┘
```

---

## 6. AD SPACE YÖNETİMİ

### Admin Panel:
```
/admin/ads

Formlar:
1. Ad Yükleme
   - Başlık
   - Resim (300x600, optimized)
   - Link (affiliate URL)
   - Kategorya (Kripto/Forex)
   - Konumu (Sol/Sağ)
   - Aktif/Pasif

2. Performans Takibi
   - Görüntülenme sayısı
   - Tıklama sayısı
   - CTR (Click Through Rate)
   - Revenue (para kazanç)

3. Google Ads Entegrasyonu
   - AdSense kodu yerleştirme
   - Reklam formatı seçimi
   - Responsive banner ayarları
```

---

## 7. GOOGLE ADS İNTEGRASYONU

### AdSense Yerleştirme:
```html
<!-- Header içinde -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"></script>

<!-- Main content alt tarafında (728x90 Leaderboard) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXX"
     data-ad-slot="XXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>

<!-- Footer'da (300x250 Medium Rectangle) -->
<ins class="adsbygoogle"
     style="display:inline-block;width:300px;height:250px"
     data-ad-client="ca-pub-XXXXX"
     data-ad-slot="XXXXX"></ins>

<!-- In-article ads -->
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

---

## 8. TEKNİK STACK ÖNERİLERİ

### Frontend:
- **HTML5** + **CSS3** (SCSS ile)
- **Vanilla JavaScript** veya **Vue.js** (hafif)
- **Chart.js** (anket grafikleri)
- **Axios** (API çağrıları)

### Backend:
- **Node.js** + **Express.js**
- **SQLite** veya **MongoDB** (anket verileri)
- **dotenv** (config)
- **CORS** (cross-origin requests)

### Hosting:
- **Vercel** (Frontend + Serverless API)
- **Netlify** (Static + Functions)
- **Railway** / **Render** (Node.js + DB)

### Analytics:
- **Google Analytics 4** (traffic)
- **Hotjar** (user behavior)
- **Google Search Console** (SEO)

---

## 9. MOBIL OPTİMİZASYON

### Responsive Breakpoints:
```css
/* Desktop */
@media (min-width: 1024px) {
  3-column layout (left, center, right)
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  2-column layout (sidebar + center, reklams hidden)
}

/* Mobile */
@media (max-width: 767px) {
  1-column layout
  Ads collapsible atau horizontal
  Tabs → Hamburger menu
}
```

---

## 10. SEO + PERFORMANCE

### SEO:
- Meta tags (Open Graph, Twitter Card)
- Sitemap.xml
- robots.txt
- Schema.org (JSON-LD) "Investigation" markup
- H1-H6 hierarchy

### Performance:
- Image optimization (WebP format)
- Code splitting
- Lazy loading
- CDN (Cloudflare)
- Caching (Cache-Control headers)
- Lighthouse score: 90+

---

## 11. DATASEKÜRİTESİ & PRIVACY

- **GDPR Uyumlu**: Gizlilik politikası
- **CCPA**: US users için banner
- **IP Hashing**: Anket oy kontrol (tampon koşulması)
- **HTTPS Only**: SSL sertifikası
- **Rate Limiting**: API abuse prevention
- **CAPTCHA**: (Optional) Anketler için

---

## 12. MONETIZATION STRATEJISI

```
Gelir Kaynakları:
├─ Affiliate Links (Binance, Gate.io, Peperstone)
│  └─ Tahmini: 1-3% conversion
│     €1000/ay (başlangıçta)
│
├─ Google AdSense
│  └─ CPM: €2-5
│     Tahmini: €500-1000/ay
│
├─ Premium Ad Slots (Sol/Sağ Sidebar)
│  └─ €50-200/ay per slot
│     Tahmini: €500-1000/ay
│
└─ Newsletter Signup (Future)
   └─ Email marketing campaigns
      Tahmini: €200-500/ay

TOPLAM: €2000-3500/ay (stabil trafik ile)
```

---

## 13. BAŞLANGIÇ ROADMAP

### Faz 1 (Hafta 1-2):
- [ ] Landing page tasarımı
- [ ] Dedektif tahtası UI mockup
- [ ] Veritabanı şeması oluştur

### Faz 2 (Hafta 2-3):
- [ ] Frontend geliştir
- [ ] Backend API'ları yaz
- [ ] Anket sistemi entegre et

### Faz 3 (Hafta 3-4):
- [ ] Affiliate linklarını ekle
- [ ] Google Ads entegrasyonu
- [ ] Admin panel geliştir

### Faz 4 (Hafta 4):
- [ ] Testing + debug
- [ ] SEO setup
- [ ] Deployment

---

## 14. İLK TRAFIK STRATEJİSİ

1. **Social Media**: Twitter, Reddit (r/Bitcoin), LinkedIn
2. **Reddit**: r/Bitcoin, r/cryptocurrency, r/satoshi
3. **YouTube**: Bitcoin history videos (pinned comment)
4. **Backlinks**: Bitcoin forums, cryptocurrency blogs
5. **Ads**: Google Ads campaign (keyword: "Satoshi Nakamoto")
