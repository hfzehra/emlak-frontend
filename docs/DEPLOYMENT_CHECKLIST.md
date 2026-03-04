# ✅ Production Deployment Checklist

Tüm adımları sırayla takip et.

---

## 🎯 Genel Bakış

- **Backend:** Railway (https://github.com/hfzehra/emlak-backend)
- **Frontend:** Vercel (https://github.com/hfzehra/emlak-project)
- **Database:** Supabase PostgreSQL (zaten hazır)

---

## 📦 ADIM 1: Backend Hazırlık

### 1.1. Dosyaları Kontrol Et
- [ ] `Backend/.gitignore` var mı?
- [ ] `Backend/README.md` güncel mi?
- [ ] `Backend/docs/RAILWAY_DEPLOYMENT.md` var mı?
- [ ] `Backend/API/Program.cs` CORS yapılandırması güncel mi?

### 1.2. Backend Klasörünü Kopyala
```powershell
Copy-Item -Path "C:\Users\pc\Desktop\emlak\emlakProject\Backend" -Destination "C:\Users\pc\Desktop\emlak-backend" -Recurse
cd C:\Users\pc\Desktop\emlak-backend
```

### 1.3. Git Push
```bash
git init
git add .
git commit -m "Initial commit: Backend API"
git remote add origin https://github.com/hfzehra/emlak-backend.git
git branch -M main
git push -u origin main
```

**Status:** ⬜ Tamamlanmadı

---

## 🚂 ADIM 2: Railway Deployment

### 2.1. Railway Projesi Oluştur
```bash
npm install -g @railway/cli
railway login
railway init
railway link
```

### 2.2. Environment Variables Ekle (Railway Dashboard)
```env
ConnectionStrings__DefaultConnection=Host=db.vwwtmbufvvrxsnqnllrh.supabase.co;Database=postgres;Username=postgres.vwwtmbufvvrxsnqnllrh;Password=webtechsin.emlak;Port=5432;SSL Mode=Require;Trust Server Certificate=true

JwtSettings__Secret=emlak-saas-super-secret-jwt-key-minimum-32-characters-long-2026
JwtSettings__Issuer=EmlakSaaS
JwtSettings__Audience=EmlakSaaSClients
JwtSettings__ExpiryHours=24

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

Cors__AllowedOrigins__0=http://localhost:5173
```

**Not:** Frontend deploy edildikten sonra bu URL güncellenecek!

### 2.3. Deploy
```bash
railway up
```

### 2.4. Migration
Railway Console'da:
```bash
cd API
dotnet ef database update
```

### 2.5. Test
```bash
curl https://your-backend.railway.app/api/health
```

**Railway URL'ini kaydet:** _______________________________

**Status:** ⬜ Tamamlanmadı

---

## 🎨 ADIM 3: Frontend Hazırlık

### 3.1. Backend Klasörünü Sil
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject
Remove-Item -Path "Backend" -Recurse -Force
```

### 3.2. Dosyaları Kontrol Et
- [ ] `Frontend/.gitignore` var mı?
- [ ] `Frontend/vercel.json` var mı?
- [ ] `Frontend/.env.development` var mı?
- [ ] `Frontend/.env.production.example` var mı?
- [ ] `Frontend/docs/VERCEL_DEPLOYMENT.md` var mı?
- [ ] Ana `README.md` güncel mi?

### 3.3. Git Push
```bash
git init  # Eğer yoksa
git add .
git commit -m "Initial commit: Frontend"
git remote add origin https://github.com/hfzehra/emlak-project.git  # Eğer yoksa
git branch -M main
git push -u origin main
```

**Status:** ⬜ Tamamlanmadı

---

## ▲ ADIM 4: Vercel Deployment

### 4.1. Vercel Projesi Oluştur
1. https://vercel.com/new
2. GitHub → `emlak-project` seç
3. **Root Directory:** `Frontend` (önemli!)
4. Framework: Vite (otomatik)
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 4.2. Environment Variable Ekle
```env
VITE_API_URL=https://your-backend.railway.app
```

**Backend Railway URL'ini buraya yaz!**

### 4.3. Deploy
"Deploy" butonuna tıkla ve bekle.

### 4.4. Test
```
https://emlak-project.vercel.app
```

Ana sayfa açılmalı!

**Vercel URL'ini kaydet:** _______________________________

**Status:** ⬜ Tamamlanmadı

---

## 🔄 ADIM 5: Backend CORS Güncelle

### 5.1. Railway Environment Variables'a Frontend URL Ekle
```env
Cors__AllowedOrigins__0=https://emlak-project.vercel.app
```

### 5.2. Railway Redeploy
Otomatik restart olmazsa manuel redeploy et.

### 5.3. Test
Frontend'den login dene, API isteği gitmeli.

**Status:** ⬜ Tamamlanmadı

---

## ✅ ADIM 6: Final Test

### 6.1. Backend Health Check
```bash
curl https://your-backend.railway.app/api/health
```
**Sonuç:** ⬜ Başarılı ⬜ Hata

### 6.2. Frontend Ana Sayfa
```
https://emlak-project.vercel.app
```
**Sonuç:** ⬜ Başarılı ⬜ Hata

### 6.3. Register Test
1. https://emlak-project.vercel.app/register
2. Şirket bilgilerini doldur
3. Register butonuna tıkla
4. Dashboard'a yönlendirilmeli

**Sonuç:** ⬜ Başarılı ⬜ Hata

### 6.4. Login Test
1. https://emlak-project.vercel.app/login
2. Kayıtlı kullanıcı ile giriş yap
3. Dashboard açılmalı

**Sonuç:** ⬜ Başarılı ⬜ Hata

### 6.5. Mülk Ekleme Test
1. Dashboard → Mülkler → Yeni Mülk
2. 4 adımı tamamla (özellikle Step 3'te şehir/ilçe dropdown test et)
3. Kaydet
4. Mülkler listesinde görünmeli

**Sonuç:** ⬜ Başarılı ⬜ Hata

### 6.6. Dashboard Test
1. Dashboard'a git
2. İstatistikler görünüyor mu?
3. Son eklenen mülkler listesi var mı?

**Sonuç:** ⬜ Başarılı ⬜ Hata

---

## 🐛 Sorun Giderme

### Backend Deploy Hatası
- [ ] Railway logs kontrol edildi
- [ ] Environment variables doğru mu?
- [ ] Connection string doğru mu?
- [ ] Migration uygulandı mı?

### Frontend Build Hatası
- [ ] Vercel deployment logs kontrol edildi
- [ ] `VITE_API_URL` doğru mu?
- [ ] Root Directory: Frontend seçili mi?

### CORS Hatası (En sık karşılaşılan!)
- [ ] Backend `Cors__AllowedOrigins__0` environment variable var mı?
- [ ] Frontend URL doğru yazılmış mı? (https:// ile başlamalı, sondaki / olmamalı)
- [ ] Railway redeploy edildi mi?

### API Bağlantı Hatası
- [ ] Backend Railway'de çalışıyor mu?
- [ ] Frontend `VITE_API_URL` environment variable doğru mu?
- [ ] Browser Network tab'da 401/403/CORS hatası var mı?

---

## 📊 Production URLs

### Backend
- **Repository:** https://github.com/hfzehra/emlak-backend
- **Railway:** ___________________________________
- **Swagger:** ___________________________________ /swagger

### Frontend
- **Repository:** https://github.com/hfzehra/emlak-project
- **Vercel:** ___________________________________

### Database
- **Supabase:** https://supabase.com/dashboard/project/vwwtmbufvvrxsnqnllrh

---

## 📝 Notlar

### Railway Environment Variables Format
```env
# Tek origin
Cors__AllowedOrigins__0=https://frontend.vercel.app

# Birden fazla origin
Cors__AllowedOrigins__0=https://frontend.vercel.app
Cors__AllowedOrigins__1=https://custom-domain.com
Cors__AllowedOrigins__2=http://localhost:5173
```

### Vercel Environment Variables
```env
VITE_API_URL=https://backend.railway.app
```

**Önemli:** `VITE_` prefix'i zorunlu!

---

## 🎉 Tamamlandı!

Tüm adımlar başarılı ise projen production'da çalışıyor demektir!

**Son kontrol:**
- [ ] Backend Railway'de çalışıyor
- [ ] Frontend Vercel'de çalışıyor
- [ ] CORS yapılandırması doğru
- [ ] Login/Register çalışıyor
- [ ] Mülk ekleme çalışıyor
- [ ] Dashboard verileri geliyor

---

**Deployment Tarihi:** _______________
**Backend URL:** _______________
**Frontend URL:** _______________
**Status:** 🟢 Canlı | 🟡 Kısmen Çalışıyor | 🔴 Hata

---

## 📞 Destek

Sorun yaşarsan:
1. `docs/RAILWAY_DEPLOYMENT.md` oku
2. `Frontend/docs/VERCEL_DEPLOYMENT.md` oku
3. `docs/DEPLOYMENT_OZET.md` oku
4. Railway ve Vercel logs kontrol et
5. Browser Console (F12) kontrol et

---

✅ **Deployment tamamlandı! Tebrikler!** 🎉

