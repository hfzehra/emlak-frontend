# 🚂 Railway Deployment - Hata Çözümü

## ❌ Karşılaşılan Hata

```
Error creating build plan with Railpack
```

**Sebep:** Railway, .NET projesini otomatik tespit edemiyor çünkü `.csproj` dosyası root'ta değil, `API/` klasöründe.

---

## ✅ Çözüm: Dockerfile Kullan

### Adım 1: Dosyaların Kontrolü

Backend klasöründe şu dosyalar olmalı:
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `nixpacks.toml` (alternatif)
- ✅ `railway.json` (alternatif)

**Bu dosyalar hazır! GitHub'a push etmek yeterli.**

---

## 🚀 Railway Deployment Adımları

### 1. GitHub'a Push
```bash
cd C:\Users\pc\Desktop\emlak-backend
git add .
git commit -m "fix: Add Dockerfile for Railway deployment"
git push origin main
```

### 2. Railway Dashboard

1. Railway Dashboard'a git: https://railway.app
2. Projeyi seç: `emlak-backend`
3. Settings → Deploy → **Redeploy**

Railway otomatik Dockerfile'ı tespit edecek ve kullanacak.

---

## ⚙️ Railway Environment Variables

Settings → Variables → Add Variable:

```env
ConnectionStrings__DefaultConnection=Host=db.vwwtmbufvvrxsnqnllrh.supabase.co;Database=postgres;Username=postgres.vwwtmbufvvrxsnqnllrh;Password=webtechsin.emlak;Port=5432;SSL Mode=Require;Trust Server Certificate=true

JwtSettings__Secret=emlak-saas-super-secret-jwt-key-minimum-32-characters-long-2026
JwtSettings__Issuer=EmlakSaaS
JwtSettings__Audience=EmlakSaaSClients
JwtSettings__ExpiryHours=24

ASPNETCORE_ENVIRONMENT=Production

Cors__AllowedOrigins__0=http://localhost:5173
```

**Not:** `ASPNETCORE_URLS` environment variable'ı ARTIK GEREKMİYOR! Dockerfile içinde `$PORT` kullanıyoruz.

---

## 🔍 Build Loglarını İzle

Railway Dashboard → Deployments → Son deployment → "View Logs"

Başarılı build şöyle görünmeli:
```
✓ Building Docker image
✓ Pushing image
✓ Starting deployment
✓ Deployment live
```

---

## 🧪 Deployment Test

### 1. Railway URL'i Al
Railway Dashboard → Settings → Domains → Copy URL

Örnek: `https://emlak-backend-production.up.railway.app`

### 2. Health Check (Eğer endpoint varsa)
```bash
curl https://your-backend.railway.app/api/health
```

### 3. Swagger Test
```
https://your-backend.railway.app/swagger
```

### 4. Register Test
```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Emlak",
    "email": "test@railway.com",
    "password": "Test123!",
    "fullName": "Test User",
    "phone": "05321234567"
  }'
```

Başarılı yanıt:
```json
{
  "token": "eyJ...",
  "userId": "...",
  "email": "test@railway.com",
  ...
}
```

---

## 🐛 Sorun Giderme

### Build Hala Başarısız Olursa

#### Option 1: Railway CLI ile Deploy
```bash
railway login
railway link
railway up
```

#### Option 2: Dockerfile'ı Kontrol Et
```bash
# Lokal test
cd C:\Users\pc\Desktop\emlak-backend
docker build -t emlak-backend .
docker run -p 5000:5000 -e PORT=5000 emlak-backend
```

#### Option 3: Settings'ten Builder Değiştir
Railway Dashboard → Settings → Builder:
- **Dockerfile** seçili olmalı
- Eğer yoksa "Detect" tıkla

---

## 📊 Migration Çalıştırma

### Railway Console Üzerinden
1. Railway Dashboard → Service → Console
2. Şu komutları çalıştır:

```bash
cd API
dotnet ef database update --verbose
```

### Alternatif: Lokal Makineden
```bash
# Connection string'i environment variable olarak set et
$env:ConnectionStrings__DefaultConnection="Host=db.vwwtmbufvvrxsnqnllrh.supabase.co;Database=postgres;Username=postgres.vwwtmbufvvrxsnqnllrh;Password=webtechsin.emlak;Port=5432;SSL Mode=Require;Trust Server Certificate=true"

cd Backend/API
dotnet ef database update
```

---

## ✅ Başarı Kontrol Listesi

- [ ] `Dockerfile` oluşturuldu
- [ ] `.dockerignore` oluşturuldu
- [ ] GitHub'a push edildi
- [ ] Railway'de redeploy yapıldı
- [ ] Environment variables eklendi
- [ ] Build başarılı (loglar yeşil)
- [ ] Deployment live
- [ ] Swagger açılıyor
- [ ] Register/Login test edildi
- [ ] Migration uygulandı

---

## 🔗 Railway URL'i Kaydet

Deployment başarılı olunca URL'i buraya yaz:

**Railway Backend URL:** _________________________________

Bu URL'i:
1. Frontend `.env.production` dosyasında kullan
2. Vercel Environment Variables'a ekle

---

## 📝 Sonraki Adım: Frontend Deployment

Backend başarılı deploy edildikten sonra:

1. Railway URL'i al
2. Frontend'e git
3. Vercel'e deploy et
4. `VITE_API_URL=https://your-backend.railway.app`
5. Backend CORS'a frontend URL'ini ekle

Detaylar: `Frontend/docs/VERCEL_DEPLOYMENT.md`

---

**✅ Railway deployment artık çalışmalı!**

