# 🏠 Emlak SaaS - Frontend

**Multi-Tenant Emlak Yönetim Sistemi - React Frontend**

[![Status](https://img.shields.io/badge/status-production%20ready-success)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)]()
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)]()

> **Backend Repository:** https://github.com/hfzehra/emlak-backend

---

## 📌 Özellikler

✅ **Multi-Tenant Mimari** - Her şirket kendi verilerini görür  
✅ **Adım Adım Mülk Ekleme** - 4 adımlı wizard  
✅ **Şehir/İlçe API** - Otomatik şehir ve ilçe seçimi  
✅ **Dashboard** - Gerçek zamanlı istatistikler  
✅ **Responsive Design** - Mobil uyumlu

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### 1. Kurulum

```bash
git clone https://github.com/hfzehra/emlak-project.git
cd emlak-project/Frontend
npm install
```

### 2. Environment Ayarları

`.env.development` oluştur:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Çalıştır

```bash
npm run dev
```

Frontend: http://localhost:5173

---

## 🌐 Vercel Deployment

### Hızlı Deploy
1. Vercel'e giriş yap: https://vercel.com
2. "Import Project" → GitHub repo seç
3. Environment Variable ekle:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. "Deploy" tıkla

Detaylı rehber: `Frontend/docs/VERCEL_DEPLOYMENT.md`

---

## 🏗️ Teknolojiler

### Core
- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing

### UI & Styling
- Custom CSS
- Responsive Design

### API & Data
- **Axios** - HTTP client
- **React Hook Form** - Form yönetimi

### External APIs
- **Türkiye API** (https://turkiyeapi.dev) - Şehir/İlçe listesi

---

## 📁 Proje Yapısı

```
Frontend/
├── src/
│   ├── app/              # Redux store
│   ├── assets/           # Görseller
│   ├── components/       # Ortak bileşenler
│   ├── features/         # Feature modülleri
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Dashboard/
│   │   ├── Properties/
│   │   │   └── Wizard/   # 4 adımlı mülk ekleme
│   │   └── ...
│   └── services/         # API servisleri
│       ├── apiClient.ts
│       ├── authApi.ts
│       └── turkeyApi.ts  # Şehir/İlçe API
└── docs/
    └── VERCEL_DEPLOYMENT.md
```

---

## 🎯 Kullanım

### 1. Kayıt Ol
```
http://localhost:5173/register
```
- Şirket adı, email, şifre gir
- Otomatik admin hesabı oluşturulur

### 2. Giriş Yap
```
http://localhost:5173/login
```

### 3. Dashboard
```
http://localhost:5173/
```
- Toplam mülk sayısı
- Kirada/Boş durumu
- Aylık kira istatistikleri

### 4. Mülk Ekle
```
http://localhost:5173/mulkler/yeni
```

**4 Adım:**
1. Mülk Sahibi (yeni ekle veya mevcut seç)
2. Kiralık Mı? (kiracı bilgileri)
3. Mülk Bilgisi (şehir/ilçe dropdown)
4. Finansal (kira tutarı)

---

## 🌍 API Entegrasyonu

### apiClient.ts
```typescript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variables
```env
# Development
VITE_API_URL=http://localhost:5000

# Production (Vercel)
VITE_API_URL=https://your-backend.railway.app
```

---

## 🧪 Build & Test

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## 📝 Deployment Checklist

- [ ] Backend Railway'de deploy edildi
- [ ] `VITE_API_URL` environment variable Vercel'e eklendi
- [ ] `vercel.json` oluşturuldu
- [ ] Build başarılı
- [ ] API bağlantısı test edildi
- [ ] Login/Register çalışıyor
- [ ] Mülk ekleme çalışıyor
- [ ] Backend CORS'a frontend URL eklendi

---

## 🔗 İlgili Linkler

- **Backend Repo:** https://github.com/hfzehra/emlak-backend
- **Frontend Demo:** https://emlak-project.vercel.app (yakında)
- **Backend API:** https://your-backend.railway.app (yakında)

---

## 📞 İletişim

**Geliştirici:** H.F. Zehra Uysal  
**GitHub:** [@hfzehra](https://github.com/hfzehra)

---

## 📄 Lisans

Bu proje özel bir projedir.

---

**Version:** 1.1.0  
**Son Güncelleme:** 2026-03-04  
**Durum:** ✅ Production Ready

---

## 📖 Dokümantasyon

- **[QUICKSTART_GUNCEL.md](docs/QUICKSTART_GUNCEL.md)** - Hızlı başlangıç
- **[DUZELTMELER.md](docs/DUZELTMELER.md)** - Son düzeltmeler
- **[TEST_KOMUTLARI.md](docs/TEST_KOMUTLARI.md)** - Test senaryoları
- **[FINAL_RAPOR.md](docs/FINAL_RAPOR.md)** - Final durum raporu
- **[Backend/docs/](Backend/docs/)** - Backend dokümantasyonu

---

## 🏗️ Mimari

### Backend
- **Clean Architecture** + **CQRS**
- **MediatR** - Command/Query separation
- **FluentValidation** - Doğrulama
- **EF Core** - ORM
- **JWT** - Authentication

### Frontend
- **React 19** + **TypeScript**
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

### Database
- **PostgreSQL** (Supabase)
- Multi-tenant with TenantId
- Query filters

---

## 📊 Veritabanı Şeması

```
Company (Şirket)
  ├─ User (Kullanıcılar)
  ├─ Property (Mülkler)
  │   ├─ Person (Sahip/Kiracı)
  │   ├─ RentalContract (Kira Sözleşmeleri)
  │   │   └─ RentPayment (Kira Ödemeleri)
  │   └─ Notification (Bildirimler)
  └─ CalendarEvent (Takvim)
```

---

## 🎯 Kullanım

### 1. Şirket Kaydı
- http://localhost:5173/register
- Şirket bilgilerini gir
- Otomatik admin hesabı oluşturulur

### 2. Mülk Ekleme

**Adım 1: Mülk Sahibi**
- Yeni sahip ekle veya mevcut seç

**Adım 2: Kiralık Mı?**
- Boş → Sadece mülk bilgileri
- Kirada → Kiracı + sözleşme bilgileri

**Adım 3: Mülk Bilgisi**
- Şehir/İlçe dropdown'dan seç
- Adres, mülk tipi, oda sayısı

**Adım 4: Finansal**
- Aylık kira tutarı (tek sefer)
- Vade günü
- Komisyon (opsiyonel)

### 3. Dashboard
- Toplam mülk sayısı
- Kirada/Boş durumu
- Bu ay tahsil edilen kira
- Son eklenen mülkler

---

## 🔐 Roller

- **SuperAdmin** - Tüm şirketleri görebilir
- **CompanyAdmin** - Şirket yöneticisi
- **CompanyUser** - Şirket kullanıcısı

---

## 🌍 Şehir/İlçe API

Türkiye API kullanılıyor: https://turkiyeapi.dev

**Özellikler:**
- 81 il
- Tüm ilçeler
- Türkçe sıralama
- Otomatik yükleme

**Not:** İnternet bağlantısı gereklidir.

---

## 🧪 Test

### Backend Test
```powershell
cd Backend
dotnet test
```

### Frontend Test
```powershell
cd Frontend
npm run build
```

### Manuel Test
`docs/TEST_KOMUTLARI.md` dosyasına bakın.

---

## 📝 Yapılan Son Değişiklikler (2026-03-04)

✅ Login hata mesajları düzeltildi  
✅ Çift kira girişi sorunu çözüldü  
✅ Şehir/İlçe API entegre edildi  
✅ Kiracı validasyonu güçlendirildi  
✅ Eski dosyalar temizlendi  
✅ Build hataları giderildi  

Detaylar için: `docs/FINAL_RAPOR.md`

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'feat: amazing feature'`)
4. Push yapın (`git push origin feature/amazing`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje özel bir projedir.

---

## 📞 İletişim

**Proje Sahibi:** [Your Name]  
**Email:** [your-email]  
**GitHub:** [your-github]

---

## ⭐ Yıldız Vermeyi Unutmayın!

Eğer bu proje işinize yaradıysa, lütfen ⭐ verin!

---

**Version:** 1.1.0  
**Son Güncelleme:** 2026-03-04  
**Durum:** ✅ Production Ready

