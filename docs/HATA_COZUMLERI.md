# 🚨 HATA ÇÖZÜMLERİ - ÖZETİ

## 1️⃣ Railway Build Hatası: "Error creating build plan with Railpack"

### ✅ ÇÖZÜM: Dockerfile Eklendi

Backend klasöründe şu dosyalar oluşturuldu:
- ✅ `Dockerfile` - Docker build tanımı
- ✅ `.dockerignore` - Gereksiz dosyaları hariç tut
- ✅ `nixpacks.toml` - Alternatif build yapılandırması
- ✅ `railway.json` - Railway yapılandırması

### 📦 Yapman Gerekenler:

#### A. Backend Klasörünü Kopyala ve Güncelle
```powershell
# Backend'i kopyala (eğer henüz yapmadıysan)
Copy-Item -Path "C:\Users\pc\Desktop\emlak\emlakProject\Backend" -Destination "C:\Users\pc\Desktop\emlak-backend" -Recurse

cd C:\Users\pc\Desktop\emlak-backend
```

#### B. Yeni Dosyaları Backend'e Kopyala
```powershell
# Dockerfile ve diğer dosyaları kopyala
Copy-Item "C:\Users\pc\Desktop\emlak\emlakProject\Backend\Dockerfile" -Destination "C:\Users\pc\Desktop\emlak-backend\" -Force
Copy-Item "C:\Users\pc\Desktop\emlak\emlakProject\Backend\.dockerignore" -Destination "C:\Users\pc\Desktop\emlak-backend\" -Force
Copy-Item "C:\Users\pc\Desktop\emlak\emlakProject\Backend\nixpacks.toml" -Destination "C:\Users\pc\Desktop\emlak-backend\" -Force
Copy-Item "C:\Users\pc\Desktop\emlak\emlakProject\Backend\railway.json" -Destination "C:\Users\pc\Desktop\emlak-backend\" -Force
```

#### C. Git Push
```bash
cd C:\Users\pc\Desktop\emlak-backend
git add Dockerfile .dockerignore nixpacks.toml railway.json
git commit -m "fix: Add Dockerfile for Railway deployment"
git push origin main
```

#### D. Railway'de Redeploy
1. Railway Dashboard: https://railway.app
2. `emlak-backend` projesini seç
3. Settings → Deploy → **Redeploy**

**✅ Build başarılı olmalı!**

---

## 2️⃣ Mülk Ekleme Hatası: "An error occurred while saving the entity changes"

### 🔍 Olası Sebepler:
1. Database bağlantısı yok
2. Kiracı bilgileri eksik (validation)
3. Foreign key constraint hatası
4. TenantId problemi

### ✅ ÇÖZÜM:

#### A. Lokal Test Yap
```bash
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API
dotnet run
```

#### B. Browser Console Kontrol Et
F12 → Network → `/properties/wizard` isteğine bak:
- Status Code: 400 → Validation hatası
- Status Code: 500 → Server hatası

#### C. Validation Kontrolü

Kiracı ekleme için **zorunlu alanlar**:
- Kiracı Adı ✅
- Kiracı Soyadı ✅
- Kiracı Telefon ✅
- Sözleşme Başlangıç Tarihi ✅
- Sözleşme Bitiş Tarihi ✅
- Kira Tutarı ✅ (Step 4'te)

**Request Payload Kontrol Et:**
```json
{
  "ownerFirstName": "Elif",
  "ownerLastName": "UYSAL",
  "ownerPhone": "05550725061",
  "isRented": true,
  "tenantFirstName": "Zehra",  // ✅ VAR MI?
  "tenantLastName": "UYSAL",   // ✅ VAR MI?
  "tenantPhone": "05550725061", // ✅ VAR MI?
  "contractStartDate": "2026-03-05",
  "contractEndDate": "2026-03-04",
  "city": "Mersin",
  "district": "Seçiniz",
  "shortAddress": "Menteş mahallesi...",
  "propertyType": 0,
  "monthlyRent": 17000,
  "rentDueDay": 1
}
```

#### D. İlçe Kontrol Et
Eğer "Seçiniz" gibi bir değer gidiyorsa SORUN VAR!

**Çözüm:** İlçe dropdown'ından gerçek bir ilçe seç.

---

## 3️⃣ Hızlı Test Komutları

### Backend Health Check (Lokal)
```bash
curl http://localhost:5000/api/health
```

### Register Test (Lokal)
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"companyName\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Test123!\",\"fullName\":\"Test\",\"phone\":\"05321234567\"}"
```

### Mülk Ekleme Test
Frontend'de:
1. Mülk sahibi bilgilerini doldur
2. Kiralık seç
3. **Tüm kiracı bilgilerini doldur**
4. Şehir: Gerçek şehir seç
5. İlçe: Gerçek ilçe seç
6. Kira tutarı gir

---

## 📋 Deployment Checklist (Güncel)

### Backend (Railway)
- [x] Dockerfile oluşturuldu
- [x] .dockerignore oluşturuldu
- [ ] Backend klasörü kopyalandı (`C:\Users\pc\Desktop\emlak-backend`)
- [ ] Yeni dosyalar kopyalandı
- [ ] Git commit ve push yapıldı
- [ ] Railway redeploy edildi
- [ ] Build başarılı (loglar yeşil)
- [ ] Environment variables eklendi
- [ ] Migration uygulandı

### Frontend (Vercel)
- [ ] Backend klasörü silindi
- [ ] Git push yapıldı
- [ ] Vercel'e deploy edildi
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] Backend CORS güncellendi

### Test
- [ ] Lokal backend çalışıyor
- [ ] Login/Register çalışıyor
- [ ] Mülk ekleme çalışıyor (tüm validasyonlar doğru)
- [ ] Dashboard verileri geliyor

---

## 🚀 ADIMLAR SIRASI

### 1. Railway Hatası Çözümü
```powershell
# Backend'i kopyala
Copy-Item -Path "C:\Users\pc\Desktop\emlak\emlakProject\Backend" -Destination "C:\Users\pc\Desktop\emlak-backend" -Recurse

cd C:\Users\pc\Desktop\emlak-backend

# Git push
git add .
git commit -m "fix: Add Dockerfile for Railway deployment"
git push origin main
```

Railway'de redeploy yap → Build başarılı olmalı ✅

### 2. Mülk Ekleme Testi (Lokal)
```bash
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API
dotnet run
```

Frontend'de test et:
- Tüm alanları doldur
- Şehir/İlçe gerçek değerler seç
- Console'da hata var mı kontrol et

### 3. Railway Migration
Railway Console'da:
```bash
cd API
dotnet ef database update
```

### 4. Frontend Deployment
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject
Remove-Item -Path "Backend" -Recurse -Force
git add .
git commit -m "chore: Remove Backend folder for separate repo"
git push origin main
```

Vercel'e deploy et → `VITE_API_URL` ekle

### 5. CORS Güncelle
Railway Environment Variables:
```env
Cors__AllowedOrigins__0=https://emlak-project.vercel.app
```

---

## 📞 Hala Sorun Varsa

### Railway Build Hatası
- `Backend/docs/RAILWAY_FIX.md` oku
- Railway logs kontrol et
- Dockerfile var mı kontrol et

### Mülk Ekleme Hatası
- Backend lokal çalıştır
- F12 → Network → Request Payload kontrol et
- Console'da validation hatası var mı bak

### CORS Hatası
- Backend CORS environment variable doğru mu?
- Frontend URL doğru yazılmış mı?

---

**✅ Bu adımları takip et, sorunlar çözülecek!**

