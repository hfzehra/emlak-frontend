# 🚀 Deployment Özet Rehberi

Frontend ve Backend'i ayrı repo'lara taşıyıp production'a alama rehberi.

---

## 📦 Repository Yapısı

### Frontend Repository
- **URL:** https://github.com/hfzehra/emlak-project
- **Deploy:** Vercel
- **Branch:** `main`

### Backend Repository  
- **URL:** https://github.com/hfzehra/emlak-backend
- **Deploy:** Railway
- **Branch:** `main`

---

## 🔧 Adım 1: Backend Repo Hazırlama

### 1.1. Backend Klasörünü Kopyala
```powershell
# Backend klasörünü ayrı bir yere kopyala
Copy-Item -Path "C:\Users\pc\Desktop\emlak\emlakProject\Backend" -Destination "C:\Users\pc\Desktop\emlak-backend" -Recurse
cd C:\Users\pc\Desktop\emlak-backend
```

### 1.2. Git Initialize
```bash
git init
git add .
git commit -m "Initial commit: Backend API"
```

### 1.3. GitHub Remote Ekle
```bash
git remote add origin https://github.com/hfzehra/emlak-backend.git
git branch -M main
git push -u origin main
```

---

## 🎨 Adım 2: Frontend Repo Hazırlama

### 2.1. Backend Klasörünü Sil
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject
Remove-Item -Path "Backend" -Recurse -Force
```

### 2.2. Git Initialize (Eğer yoksa)
```bash
git init
git add .
git commit -m "Initial commit: Frontend"
```

### 2.3. GitHub Remote Ekle
```bash
git remote add origin https://github.com/hfzehra/emlak-project.git
git branch -M main
git push -u origin main
```

---

## 🚂 Adım 3: Backend Railway Deployment

### 3.1. Railway CLI Kurulum
```bash
npm install -g @railway/cli
railway login
```

### 3.2. Project Oluştur
```bash
cd C:\Users\pc\Desktop\emlak-backend
railway init
railway link
```

### 3.3. Environment Variables (Railway Dashboard)
```env
ConnectionStrings__DefaultConnection=Host=db.vwwtmbufvvrxsnqnllrh.supabase.co;Database=postgres;Username=postgres.vwwtmbufvvrxsnqnllrh;Password=webtechsin.emlak;Port=5432;SSL Mode=Require;Trust Server Certificate=true

JwtSettings__Secret=emlak-saas-super-secret-jwt-key-minimum-32-characters-long-2026
JwtSettings__Issuer=EmlakSaaS
JwtSettings__Audience=EmlakSaaS
JwtSettings__ExpiryHours=24

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

CORS__AllowedOrigins=https://emlak-project.vercel.app
```

### 3.4. Deploy
```bash
railway up
```

### 3.5. Migration
Railway Console'da:
```bash
cd API
dotnet ef database update
```

**Railway URL örnek:** `https://emlak-backend-production.up.railway.app`

---

## ▲ Adım 4: Frontend Vercel Deployment

### 4.1. Vercel CLI Kurulum (Opsiyonel)
```bash
npm install -g vercel
vercel login
```

### 4.2. Vercel Dashboard İle Deploy

1. https://vercel.com/new adresine git
2. GitHub'dan `emlak-project` seç
3. Framework: **Vite**
4. Root Directory: **Frontend**
5. Environment Variables ekle:

```env
VITE_API_URL=https://emlak-backend-production.up.railway.app
```

6. **Deploy** tıkla

**Vercel URL örnek:** `https://emlak-project.vercel.app`

---

## 🔄 Adım 5: CORS Güncelleme

Backend Railway Environment Variables'a frontend URL'ini ekle:

```env
CORS__AllowedOrigins=https://emlak-project.vercel.app
```

Railway'i redeploy et veya otomatik restart bekle.

---

## ✅ Adım 6: Test

### 6.1. Backend Health Check
```bash
curl https://emlak-backend-production.up.railway.app/api/health
```

### 6.2. Frontend Ana Sayfa
```
https://emlak-project.vercel.app
```

### 6.3. Login Test
1. https://emlak-project.vercel.app/login
2. Test kullanıcısı ile giriş yap
3. Dashboard açılmalı

### 6.4. API Bağlantı Test
Browser Console (F12):
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

---

## 📋 Git Komutları Özet

### Backend (emlak-backend)
```bash
cd C:\Users\pc\Desktop\emlak-backend
git add .
git commit -m "feat: backend updates"
git push origin main
```

### Frontend (emlak-project)
```bash
cd C:\Users\pc\Desktop\emlak\emlakProject
git add .
git commit -m "feat: frontend updates"
git push origin main
```

---

## 🐛 Sorun Giderme

### Backend Deploy Hatası
- Railway logs kontrol et: `railway logs`
- Build command doğru mu?
- Environment variables tamam mı?

### Frontend Build Hatası
- Vercel deployment logs kontrol et
- `VITE_API_URL` doğru mu?
- `vercel.json` var mı?

### CORS Hatası
- Backend `CORS__AllowedOrigins` environment variable'ı kontrol et
- Frontend URL'i doğru yazılmış mı? (https:// ile başlamalı)
- Sondaki / olmamalı

### API Bağlantı Hatası
- Backend Railway'de çalışıyor mu?
- Frontend `VITE_API_URL` doğru mu?
- Browser Network tab'da 401/403 var mı?

---

## 📊 Monitoring

### Railway (Backend)
- Dashboard → Deployments → Logs
- Metrics: CPU, Memory, Network

### Vercel (Frontend)
- Dashboard → Analytics
- Performance metrics
- Error tracking

---

## 🔒 Güvenlik Checklist

- [ ] JWT Secret production-ready (min 32 karakter)
- [ ] Supabase password güvenli
- [ ] CORS sadece frontend URL'ine izin veriyor
- [ ] `.env` dosyaları commit edilmemiş
- [ ] `appsettings.Development.json` commit edilmemiş
- [ ] HTTPS zorunlu (Railway ve Vercel otomatik)

---

## 🚀 Deployment Sonrası

### 1. SuperAdmin Oluştur (İlk Defa)
Backend'de seed data script çalıştır veya manuel register yap.

### 2. Test Kullanıcısı Oluştur
```bash
curl -X POST https://emlak-backend-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Emlak",
    "email": "test@emlak.com",
    "password": "Test123!",
    "fullName": "Test User",
    "phone": "05321234567"
  }'
```

### 3. İlk Mülk Ekle
Frontend'den test et:
1. Login
2. Mülkler → Yeni Mülk
3. 4 adımı tamamla
4. Kaydet

---

## 📝 Final Checklist

- [ ] Backend GitHub repo oluşturuldu
- [ ] Frontend GitHub repo oluşturuldu
- [ ] Backend Railway'de deploy edildi
- [ ] Frontend Vercel'de deploy edildi
- [ ] Environment variables eklendi
- [ ] CORS yapılandırıldı
- [ ] Database migration uygulandı
- [ ] Test kullanıcısı oluşturuldu
- [ ] Login/Register çalışıyor
- [ ] Mülk ekleme çalışıyor
- [ ] Dashboard verileri görünüyor

---

## 🔗 Production URLs

- **Frontend:** https://emlak-project.vercel.app
- **Backend:** https://emlak-backend-production.up.railway.app
- **API Docs:** https://emlak-backend-production.up.railway.app/swagger

---

## 📞 Destek

Sorun yaşarsan:
1. Railway/Vercel deployment logs kontrol et
2. Browser Console hataları kontrol et
3. Backend logs kontrol et
4. `docs/` klasöründeki detaylı rehberleri oku

---

✅ **Deployment tamamlandı! Production'a hazırsın!**

