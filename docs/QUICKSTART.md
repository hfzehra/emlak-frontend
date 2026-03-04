# 🚀 HIZLI BAŞLANGIÇ KILAVUZU

## ⚡ 3 Adımda Başlayın

### 1️⃣ Database Kurulumu (2 dakika)

```bash
# Backend/Infrastructure klasörüne git
cd Backend\Infrastructure

# Migration oluştur
dotnet ef migrations add InitialCreate --startup-project ..\API

# Database'i oluştur
dotnet ef database update --startup-project ..\API
```

### 2️⃣ Sunucuları Başlat (1 dakika)

**Otomatik (Önerilen):**
```powershell
.\start.ps1
```

**Manuel:**
```bash
# Terminal 1 - Backend
cd Backend\API
dotnet run

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### 3️⃣ Test Verisi Ekle (1 dakika)

**SQL Server Management Studio veya Azure Data Studio'da:**
```bash
# SeedData.sql dosyasını çalıştır
Backend\SeedData.sql
```

Script çalıştıktan sonra CompanyId'yi kopyalayın ve browser console'da:
```javascript
localStorage.setItem('companyId', 'BURAYA-COMPANY-ID-YAPIŞTIRIN');
```

## 🎉 Hazır!

- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger
- **Frontend:** http://localhost:5173

---

## 📋 Checklist

- [ ] .NET 8 SDK yüklü
- [ ] Node.js 18+ yüklü
- [ ] SQL Server çalışıyor
- [ ] Backend bağımlılıkları yüklendi (`dotnet restore`)
- [ ] Frontend bağımlılıkları yüklendi (`npm install`)
- [ ] Migration oluşturuldu ve uygulandı
- [ ] Test şirketi ve verileri eklendi
- [ ] CompanyId localStorage'a eklendi
- [ ] Her iki sunucu da çalışıyor

## 🆘 Sorun Giderme

### Backend çalışmıyor
```bash
cd Backend
dotnet build
# Hataları kontrol edin
```

### Frontend çalışmıyor
```bash
cd Frontend
npm install
npm run dev
```

### Database hatası
- SQL Server'ın çalıştığından emin olun
- Connection string'i kontrol edin (`API/appsettings.json`)
- Migration'ı tekrar çalıştırın

### CORS hatası
- Backend'de CORS ayarları yapıldı
- Frontend URL'i: `http://localhost:5173`
- Backend URL'i: `http://localhost:5000`

## 📚 Daha Fazla Bilgi

- [Ana README](./README.md)
- [Backend Dokümantasyon](./Backend/README.md)
- [Frontend Dokümantasyon](./Frontend/README.md)

## 💡 İlk Adımlar

1. **Swagger UI'da API'yi keşfedin:** http://localhost:5000/swagger
2. **Frontend'de yeni mülk ekleyin**
3. **Code'u inceleyin ve öğrenin**

## 🎯 Sonraki Adımlar

- [ ] Authentication/JWT ekle
- [ ] Validation (FluentValidation) ekle
- [ ] Logging ekle
- [ ] Unit testler yaz
- [ ] Docker support ekle
- [ ] CI/CD pipeline kur

---

**Mutlu Kodlamalar! 🚀**

