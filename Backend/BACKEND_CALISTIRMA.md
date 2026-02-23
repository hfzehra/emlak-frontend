# 🚀 Backend API Çalıştırma Kılavuzu

## ✅ Backend Başlatıldı!

Yeni bir PowerShell penceresi açıldı ve backend API başlatılıyor.

## 📍 Backend Erişim Adresleri

Backend başladıktan sonra şu adreslerden erişebilirsiniz:

### Swagger UI (API Dokümantasyonu ve Test)
- **HTTP:**  http://localhost:5038/swagger
- **HTTPS:** https://localhost:7206/swagger

### API Base URL'leri
- **HTTP:**  http://localhost:5038
- **HTTPS:** https://localhost:7206

## 🔍 Backend Durumunu Kontrol Etme

### 1. PowerShell Penceresini Kontrol Edin
Açılan PowerShell penceresinde şu mesajları görmelisiniz:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5038
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7206
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 2. Tarayıcıdan Test Edin
Tarayıcınızda şu adresi açın:
```
http://localhost:5038/swagger
```

## 🛠️ Backend Komutları

### Manuel Başlatma (Eğer Gerekirse)
```powershell
cd C:\Users\pc\Desktop\emlakProject\Backend\API
dotnet run
```

### Build
```powershell
cd C:\Users\pc\Desktop\emlakProject\Backend\API
dotnet build
```

### Durdurma
PowerShell penceresinde `Ctrl+C` tuşlarına basın.

## 📋 Mevcut Endpoints

Backend başladıktan sonra Swagger UI'da şu endpoint'leri göreceksiniz:

### Properties (Mülkler)
- `GET /api/properties` - Tüm mülkleri listele
- `GET /api/properties/{id}` - Tek bir mülk getir
- `POST /api/properties` - Yeni mülk ekle
- `PUT /api/properties/{id}` - Mülk güncelle
- `DELETE /api/properties/{id}` - Mülk sil (soft delete)

## 🔑 Önemli: Company ID (Multi-Tenancy)

Backend multi-tenancy yapısı kullanıyor. Her istek için **X-Company-Id** header'ı gereklidir.

### Test Company ID
```
3ACCF42C-4233-4930-B4B5-D78511C545D8
```

### Swagger'da Kullanım
1. Swagger UI'ı açın
2. Endpoint'e tıklayın
3. "Try it out" butonuna basın
4. Headers bölümünde `X-Company-Id` ekleyin
5. Değer olarak yukarıdaki Company ID'yi girin

### Frontend'den Kullanım
Frontend'de bu ID localStorage'da saklanıyor:
```javascript
localStorage.setItem('companyId', '3ACCF42C-4233-4930-B4B5-D78511C545D8');
```

## 🗄️ Veritabanı Bilgileri

- **Veritabanı:** EmlakYonetimDB
- **Server:** localhost
- **Connection:** Windows Authentication (Trusted_Connection)

### Test Verileri
Veritabanında 5 test mülkü mevcut:
1. Maslak'ta Lüks Daire - 8.500.000 TL
2. Kadıköy'de Satılık İşyeri - 4.200.000 TL
3. Beykoz'da Müstakil Villa - 15.000.000 TL
4. Ataşehir'de 2+1 Daire - 3.500.000 TL
5. Şile'de Arsa - 2.800.000 TL

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyor
Eğer portlar zaten kullanılıyorsa:
```powershell
# Port kullanan process'i bulun
netstat -ano | findstr :5038
netstat -ano | findstr :7206

# Process'i sonlandırın (PID ile)
taskkill /PID [process_id] /F
```

### Veritabanı Bağlantı Hatası
Connection string'i kontrol edin:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EmlakYonetimDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

SQL Server'ın çalıştığından emin olun:
```powershell
# SQL Server servisini kontrol et
Get-Service -Name "MSSQL*"
```

### HTTPS Sertifika Hatası
Development sertifikasını trust edin:
```powershell
dotnet dev-certs https --trust
```

## 📚 Daha Fazla Bilgi

- Migration detayları: `MIGRATION_INFO.md`
- Proje yapısı: `README.md`
- API test istekleri: `API.http`

## 🎯 Sonraki Adımlar

1. ✅ Backend başlatıldı
2. 🔍 Swagger UI'ı açın ve endpoint'leri inceleyin
3. 🧪 Test istekleri gönderin
4. 🎨 Frontend'i başlatın ve bağlantıyı test edin

---

**Not:** Backend'i durdurmak için açık PowerShell penceresinde `Ctrl+C` tuşlarına basın.

