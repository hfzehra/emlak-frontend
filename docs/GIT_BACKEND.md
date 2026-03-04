# 🚀 Git Komutları - Backend Repo

## Backend'i Ayrı Repo'ya Taşıma

### 1. Backend Klasörünü Kopyala
```powershell
# Backend klasörünü ayrı bir yere kopyala
Copy-Item -Path "C:\Users\pc\Desktop\emlak\emlakProject\Backend" -Destination "C:\Users\pc\Desktop\emlak-backend" -Recurse
cd C:\Users\pc\Desktop\emlak-backend
```

### 2. Git Initialize
```bash
git init
git add .
git commit -m "Initial commit: Backend API with Clean Architecture + CQRS"
```

### 3. GitHub Remote Ekle ve Push
```bash
git remote add origin https://github.com/hfzehra/emlak-backend.git
git branch -M main
git push -u origin main
```

### 4. Railway Deploy
```bash
# Railway CLI kurulu değilse
npm install -g @railway/cli

# Railway'e login
railway login

# Proje oluştur ve bağla
railway init
railway link

# Deploy
railway up
```

### 5. Railway Environment Variables

Railway Dashboard'da şunları ekle:

```env
ConnectionStrings__DefaultConnection=Host=db.vwwtmbufvvrxsnqnllrh.supabase.co;Database=postgres;Username=postgres.vwwtmbufvvrxsnqnllrh;Password=webtechsin.emlak;Port=5432;SSL Mode=Require;Trust Server Certificate=true

JwtSettings__Secret=emlak-saas-super-secret-jwt-key-minimum-32-characters-long-2026
JwtSettings__Issuer=EmlakSaaS
JwtSettings__Audience=EmlakSaaSClients
JwtSettings__ExpiryHours=24

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

Cors__AllowedOrigins__0=https://emlak-project.vercel.app
```

**Not:** CORS için birden fazla origin eklemek istersen:
```env
Cors__AllowedOrigins__0=https://emlak-project.vercel.app
Cors__AllowedOrigins__1=https://your-custom-domain.com
```

### 6. Migration Çalıştır (Railway Console)
```bash
cd API
dotnet ef database update
```

---

## 🔄 Güncellemeler İçin

```bash
cd C:\Users\pc\Desktop\emlak-backend
git add .
git commit -m "feat: description of changes"
git push origin main
```

Railway otomatik deploy edecek.

---

## ✅ Backend Deploy Checklist

- [ ] Backend klasörü kopyalandı
- [ ] Git init yapıldı
- [ ] GitHub'a push edildi
- [ ] Railway projesi oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deploy tamamlandı
- [ ] Migration uygulandı
- [ ] Health check başarılı

**Railway URL:** https://emlak-backend-production.up.railway.app

