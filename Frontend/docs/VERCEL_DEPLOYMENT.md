# ▲ Vercel Deployment Rehberi

Frontend'i Vercel'e deploy etmek için adım adım rehber.

---

## 📋 Gereksinimler

- Vercel hesabı (https://vercel.com)
- GitHub hesabı
- Backend Railway'de deploy edilmiş olmalı

---

## 🔧 Adım 1: Vercel Projesi Oluşturma

### 1.1. Vercel'e Giriş
1. https://vercel.com/login adresine git
2. GitHub ile giriş yap

### 1.2. Import Project
1. Dashboard → "Add New" → "Project"
2. GitHub'dan `emlak-project` repository'sini seç
3. "Import" tıkla

---

## ⚙️ Adım 2: Build & Development Settings

### Framework Preset
```
Vite
```

### Build Command
```
npm run build
```

### Output Directory
```
dist
```

### Install Command
```
npm install
```

---

## 🌍 Adım 3: Environment Variables

Vercel Dashboard → "Settings" → "Environment Variables":

### Production Environment
```env
VITE_API_URL=https://your-backend.railway.app
```

**Önemli:** Backend Railway URL'ini buraya yaz!

### Preview & Development (Opsiyonel)
```env
# Preview branches için
VITE_API_URL=https://your-backend-staging.railway.app

# Local development için
VITE_API_URL=http://localhost:5000
```

---

## 📦 Adım 4: vercel.json Yapılandırması

Proje kök dizininde `vercel.json` oluştur:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

---

## 🔗 Adım 5: API Client Yapılandırması

`Frontend/src/services/apiClient.ts` kontrol et:

```typescript
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🚀 Adım 6: Deploy

### İlk Deploy
Vercel otomatik deploy eder:
1. "Deploy" butonuna tıkla
2. Build loglarını izle
3. Deployment tamamlandığında URL verilir

### URL Örneği
```
https://emlak-project.vercel.app
```

---

## 🔄 Adım 7: Backend CORS Güncelleme

Backend Railway Environment Variables'a frontend URL'ini ekle:

```env
CORS__AllowedOrigins=https://emlak-project.vercel.app
```

Railway'i yeniden deploy et.

---

## ✅ Adım 8: Test

### 8.1. Ana Sayfa
```
https://emlak-project.vercel.app
```

### 8.2. Login
```
https://emlak-project.vercel.app/login
```

### 8.3. Register
```
https://emlak-project.vercel.app/register
```

### 8.4. API Bağlantısı Test
Browser Console'da:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

---

## 🐛 Sorun Giderme

### Build Hatası
```bash
# Lokal test
cd Frontend
npm install
npm run build
```

### API Bağlantı Hatası
- `VITE_API_URL` doğru mu?
- Backend Railway'de çalışıyor mu?
- CORS ayarları doğru mu?

### 404 Not Found (Routing Sorunu)
- `vercel.json` var mı?
- Rewrite kuralları doğru mu?

### Environment Variable Görünmüyor
- Vercel Dashboard'da eklendi mi?
- Redeploy yapıldı mı?
- `VITE_` prefix'i var mı?

---

## 📱 Adım 9: Custom Domain (Opsiyonel)

Vercel Settings → "Domains":

1. "Add Domain"
2. Domain adını gir (örn: emlak.example.com)
3. DNS kayıtlarını ayarla:
   - CNAME: `cname.vercel-dns.com`
4. SSL otomatik sağlanır

---

## 🔒 Güvenlik Kontrol Listesi

- [ ] `VITE_API_URL` production URL'i kullanıyor
- [ ] Backend CORS frontend URL'ine izin veriyor
- [ ] `.env` dosyası commit edilmemiş
- [ ] API token localStorage'da güvenli
- [ ] HTTPS zorunlu (Vercel otomatik)

---

## 📊 Performance Optimization

### 1. Vercel Analytics Aktif Et
```bash
npm install @vercel/analytics
```

`main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

### 2. Image Optimization
```typescript
import { ImageResponse } from '@vercel/og';
```

### 3. Edge Functions (İleri Seviye)
API proxy için edge functions kullan.

---

## 🔄 Continuous Deployment

### Otomatik Deploy
- `main` branch'e push → Production deploy
- Diğer branch'lere push → Preview deploy

### Manual Deploy
```bash
# Vercel CLI ile
npm install -g vercel
vercel login
vercel --prod
```

---

## 📝 Deployment Checklist

- [ ] Vercel projesi oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] `vercel.json` oluşturuldu
- [ ] Build başarılı
- [ ] Ana sayfa açılıyor
- [ ] Login/Register çalışıyor
- [ ] API istekleri başarılı
- [ ] Backend CORS güncellendi

---

## 🔗 İlgili Linkler

- **Frontend URL:** https://emlak-project.vercel.app
- **Backend URL:** https://your-backend.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev

---

## 📞 Frontend Environment Variables Özeti

```env
# Production (.env.production)
VITE_API_URL=https://your-backend.railway.app

# Development (.env.development)
VITE_API_URL=http://localhost:5000

# Staging (opsiyonel)
VITE_API_URL=https://your-backend-staging.railway.app
```

---

✅ **Deploy tamamlandı!**

**Son Adım:** Backend Railway CORS'a frontend URL'ini ekle!

