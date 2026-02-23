# Emlak Yönetim Sistemi - Backend

## Mimari
Bu proje **Clean Architecture** prensiplerine göre geliştirilmiştir.

### Katmanlar
- **Domain**: Entity'ler ve domain logic
- **Application**: CQRS (MediatR) ve business logic
- **Infrastructure**: Database, external services
- **API**: REST API endpoints

### Özellikler
✅ Clean Architecture  
✅ CQRS Pattern (MediatR)  
✅ Multi-tenancy (CompanyId bazlı)  
✅ Entity Framework Core 8  
✅ SQL Server  

## Kurulum

### 1. Bağımlılıkları Yükle
```bash
cd Backend
dotnet restore
```

### 2. Database Ayarları
`API/appsettings.json` dosyasında connection string'i düzenleyin:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EmlakYonetimDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3. Migration Oluştur ve Veritabanını Güncelle
```bash
cd Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API
dotnet ef database update --startup-project ../API
```

### 4. Test Verisi Ekle (Opsiyonel)
SQL Server Management Studio veya Azure Data Studio kullanarak:
```sql
-- Test company ekle
INSERT INTO Companies (Id, Name, Email, Phone, Address, CreatedAt, IsActive)
VALUES (NEWID(), 'Test Emlak Ltd.', 'info@testemlak.com', '05551234567', 'İstanbul, Türkiye', GETUTCDATE(), 1);

-- CompanyId'yi kopyalayın ve localStorage'a ekleyin (Frontend'de)
```

### 5. Projeyi Çalıştır
```bash
cd API
dotnet run
```

API şu adreste çalışacak: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

## Multi-Tenancy Kullanımı

### Geliştirme Aşaması
Request header'a `X-Company-Id` ekleyin:
```
X-Company-Id: your-company-guid-here
```

### Production
JWT token içinde `CompanyId` claim'i bulunmalıdır.

## API Endpoints

### Properties
- `GET /api/properties` - Tüm mülkleri listele (filtrelenmiş)
- `POST /api/properties` - Yeni mülk ekle

## Proje Yapısı
```
Backend/
├── Domain/
│   ├── Common/
│   │   └── BaseEntity.cs
│   └── Entities/
│       ├── Company.cs
│       └── Property.cs
├── Application/
│   ├── Common/
│   │   └── Interfaces/
│   │       ├── IAppDbContext.cs
│   │       └── ITenantService.cs
│   └── Features/
│       └── Properties/
│           ├── Commands/
│           │   └── CreatePropertyCommand.cs
│           └── Queries/
│               └── GetAllPropertiesQuery.cs
├── Infrastructure/
│   ├── Persistence/
│   │   └── AppDbContext.cs
│   └── Services/
│       └── TenantService.cs
└── API/
    ├── Controllers/
    │   └── PropertiesController.cs
    └── Program.cs
```

## Teknolojiler
- .NET 8
- Entity Framework Core 8
- MediatR
- SQL Server
- Swagger/OpenAPI

