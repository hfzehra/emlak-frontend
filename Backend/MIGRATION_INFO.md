# Migration ve Veritabanı Bilgileri

## ✅ Tamamlanan İşlemler

### 1. Migration Oluşturuldu
```bash
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project API
```

### 2. Veritabanı Oluşturuldu ve Güncellendi
```bash
dotnet ef database update --project Infrastructure --startup-project API
```
- Veritabanı: **EmlakYonetimDB**
- Server: **localhost**
- Connection: **Trusted_Connection (Windows Authentication)**

### 3. Test Verileri Eklendi
```bash
sqlcmd -S localhost -d EmlakYonetimDB -E -i SeedData.sql
```

## 📋 Test Şirketi Bilgileri

**Company ID:** `3ACCF42C-4233-4930-B4B5-D78511C545D8`

**Şirket Bilgileri:**
- İsim: Test Emlak Ltd. Şti.
- Email: info@testemlak.com
- Telefon: 05551234567
- Adres: Maslak, İstanbul, Türkiye

## 🏠 Eklenen Test Mülkleri (5 adet)

1. **Maslak'ta Lüks Daire** - 8.500.000 TL - 150 m² - Daire
2. **Kadıköy'de Satılık İşyeri** - 4.200.000 TL - 80 m² - İşyeri
3. **Beykoz'da Müstakil Villa** - 15.000.000 TL - 350 m² - Villa
4. **Ataşehir'de 2+1 Daire** - 3.500.000 TL - 95 m² - Daire
5. **Şile'de Arsa** - 2.800.000 TL - 1000 m² - Arsa

## 🔧 Frontend İçin Gerekli Ayar

Frontend'de test verilerini görebilmek için browser console'da şu komutu çalıştırın:

```javascript
localStorage.setItem('companyId', '3ACCF42C-4233-4930-B4B5-D78511C545D8');
```

## 📦 Veritabanı Yapısı

### Companies Tablosu
- Id (uniqueidentifier, PK)
- Name (nvarchar(200), NOT NULL)
- Email (nvarchar(100), NOT NULL)
- Phone (nvarchar(max))
- Address (nvarchar(max))
- CreatedAt (datetime2)
- IsActive (bit)

### Properties Tablosu
- Id (uniqueidentifier, PK)
- Title (nvarchar(200), NOT NULL)
- Description (nvarchar(max))
- Address (nvarchar(max))
- Price (decimal(18,2))
- RoomCount (int)
- Area (int)
- PropertyType (nvarchar(max))
- Status (nvarchar(max))
- CreatedAt (datetime2)
- UpdatedAt (datetime2, nullable)
- CompanyId (uniqueidentifier, FK)
- IsDeleted (bit)

## 🚀 Gelecek Migration İçin Komutlar

### Yeni Migration Ekleme
```bash
cd C:\Users\pc\Desktop\emlakProject\Backend
dotnet ef migrations add [MigrationName] --project Infrastructure --startup-project API
```

### Veritabanını Güncelleme
```bash
cd C:\Users\pc\Desktop\emlakProject\Backend
dotnet ef database update --project Infrastructure --startup-project API
```

### Son Migration'ı Geri Alma
```bash
cd C:\Users\pc\Desktop\emlakProject\Backend
dotnet ef migrations remove --project Infrastructure --startup-project API
```

### Migration Listesini Görme
```bash
cd C:\Users\pc\Desktop\emlakProject\Backend
dotnet ef migrations list --project Infrastructure --startup-project API
```

## 📝 Notlar

- Entity Framework Core 8.0.0 kullanılıyor
- Multi-tenancy yapısı aktif (CompanyId bazlı filtering)
- Soft delete aktif (IsDeleted field)
- Global query filters AppDbContext'te tanımlı
- Migration assembly: Infrastructure projesi

