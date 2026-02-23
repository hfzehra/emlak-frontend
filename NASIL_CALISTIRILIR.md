# Emlak Yönetim Sistemi - Nasıl Çalıştırılır? 🚀

## ✅ Sistem Hazır!

Veritabanı ve test verileri hazır durumda:
- ✅ Database: **EmlakYonetimDB** oluşturuldu
- ✅ Migration'lar uygulandı
- ✅ Test şirketi eklendi
- ✅ 5 test mülkü eklendi

## 🔑 Önemli Bilgiler

### Test Şirket CompanyId:
```
3ACCF42C-4233-4930-B4B5-D78511C545D8
```

### Test Mülkleri:
1. Beykoz'da Müstakil Villa - 15.000.000 TL (5 oda, 350 m²)
2. Kadıköy'de Satılık İşyeri - 4.200.000 TL (80 m²)
3. Ataşehir'de 2+1 Daire - 3.500.000 TL (2 oda, 95 m²)
4. Şile'de Arsa - 2.800.000 TL (1000 m²)
5. Maslak'ta Lüks Daire - 8.500.000 TL (3 oda, 150 m²)

## 🚀 Başlatma Adımları

### Yöntem 1: Otomatik Başlatma (Önerilen)
```powershell
cd C:\Users\pc\Desktop\emlakProject
.\start.ps1
```
- "E" tuşuna basarak migration'ın tamamlandığını onaylayın
- Backend ve Frontend otomatik olarak yeni pencerelerde açılacak

### Yöntem 2: Manuel Başlatma

#### Backend (Terminal 1):
```powershell
cd C:\Users\pc\Desktop\emlakProject\Backend\API
dotnet run
```
Backend şu adreslerde çalışacak:
- HTTP: http://localhost:5038
- HTTPS: https://localhost:7206
- Swagger UI: https://localhost:7206/swagger

#### Frontend (Terminal 2):
```powershell
cd C:\Users\pc\Desktop\emlakProject\Frontend
npm run dev
```
Frontend şu adreste çalışacak:
- http://localhost:5173

## 🌐 Browser'da Kullanım

1. **Frontend'i aç**: http://localhost:5173

2. **CompanyId'yi localStorage'a kaydet**:
   - Browser Console'u aç (F12)
   - Şu komutu çalıştır:
   ```javascript
   localStorage.setItem('companyId', '3ACCF42C-4233-4930-B4B5-D78511C545D8');
   ```
   - Sayfayı yenile (F5)

3. **Mülkleri görüntüle**:
   - Artık 5 test mülkünü görebilirsiniz
   - Yeni mülk ekleyebilir, düzenleyebilir veya silebilirsiniz

## 🔧 API Test Etme

### Swagger UI ile:
1. https://localhost:7206/swagger adresini aç
2. Herhangi bir endpoint'i seç
3. "Try it out" butonuna tıkla
4. Header'a ekle:
   ```
   X-Company-Id: 3ACCF42C-4233-4930-B4B5-D78511C545D8
   ```
5. "Execute" butonuna tıkla

### cURL ile:
```bash
curl -X GET "https://localhost:7206/api/properties" ^
  -H "X-Company-Id: 3ACCF42C-4233-4930-B4B5-D78511C545D8" ^
  -k
```

## 🗄️ Veritabanı Bilgileri

- **Server**: localhost
- **Database**: EmlakYonetimDB
- **Authentication**: Windows Authentication (Trusted_Connection)
- **Connection String**: 
  ```
  Server=localhost;Database=EmlakYonetimDB;Trusted_Connection=True;TrustServerCertificate=True;
  ```

## 📊 Mevcut Tablolar

- **Companies**: Şirket bilgileri
- **Properties**: Mülk bilgileri
- **__EFMigrationsHistory**: Migration geçmişi

## ❓ Sorun Giderme

### Backend başlamıyorsa:
```powershell
# SQL Server çalışıyor mu kontrol et
Get-Service MSSQLSERVER

# Port kullanımda mı kontrol et
netstat -ano | findstr :7206
```

### Frontend başlamıyorsa:
```powershell
# node_modules yeniden yükle
cd Frontend
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### CompanyId hatası alıyorsanız:
- Browser Console'dan localStorage'ı kontrol edin:
  ```javascript
  console.log(localStorage.getItem('companyId'));
  ```
- Doğru CompanyId'yi tekrar kaydedin

## 🎯 Özellikler

✅ Multi-tenant mimari (CompanyId bazlı veri izolasyonu)
✅ Soft delete (IsDeleted flag)
✅ CQRS pattern (MediatR ile)
✅ Clean Architecture
✅ Entity Framework Core
✅ React + Redux Toolkit
✅ TypeScript
✅ RESTful API
✅ Swagger/OpenAPI

## 📝 Notlar

- Her şirket sadece kendi mülklerini görebilir (Multi-tenancy)
- Silinen mülkler soft delete ile işaretlenir
- Backend CORS ayarları frontend için yapılandırıldı
- Test verileri zaten veritabanında mevcut

Başarılar! 🎉

