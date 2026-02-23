# 🏢 Emlak Yönetim Sistemi (SaaS)

Modern, ölçeklenebilir ve çok kiracılı (multi-tenant) emlak yönetim sistemi.

## 🎯 Özellikler

- ✅ **Clean Architecture** - Katmanlı mimari ile temiz kod
- ✅ **CQRS Pattern** - MediatR ile komut/sorgu ayrımı
- ✅ **Multi-Tenancy** - CompanyId bazlı veri izolasyonu
- ✅ **Modern Tech Stack** - .NET 8 + React 18 + TypeScript
- ✅ **Type Safety** - Hem backend hem frontend'de tip güvenliği
- ✅ **RESTful API** - Swagger/OpenAPI dokümantasyonu

## 🏗️ Mimari

### Backend (.NET 8)
```
Backend/
├── Domain/           # Entity'ler ve domain logic
├── Application/      # CQRS, MediatR handlers
├── Infrastructure/   # Database, external services
└── API/             # REST API endpoints
```

**Teknolojiler:**
- .NET 8
- Entity Framework Core 8
- MediatR (CQRS)
- SQL Server
- Swagger/OpenAPI

### Frontend (React + TypeScript)
```
Frontend/
├── src/
│   ├── app/         # Redux store
│   ├── features/    # Feature-based components
│   ├── services/    # RTK Query API
│   ├── components/  # Shared components
│   └── hooks/       # Custom hooks
```

**Teknolojiler:**
- React 18
- TypeScript
- Vite
- Redux Toolkit
- RTK Query

## 🚀 Hızlı Başlangıç

### Gereksinimler
- .NET 8 SDK
- Node.js 18+
- SQL Server (LocalDB veya Express)

### 1️⃣ Backend Kurulumu

```bash
# Backend klasörüne git
cd Backend

# Bağımlılıkları yükle
dotnet restore

# Database migration'ı oluştur ve uygula
cd Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API
dotnet ef database update --startup-project ../API

# API'yi çalıştır
cd ../API
dotnet run
```

Backend şu adreste çalışacak: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

### 2️⃣ Frontend Kurulumu

```bash
# Frontend klasörüne git
cd Frontend

# Bağımlılıkları yükle
npm install

# Dev server'ı başlat
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

### 3️⃣ Test Verisi Ekleme

SQL Server'da bir test şirketi oluşturun:

```sql
INSERT INTO Companies (Id, Name, Email, Phone, Address, CreatedAt, IsActive)
VALUES (NEWID(), 'Test Emlak Ltd.', 'info@testemlak.com', '05551234567', 'İstanbul, Türkiye', GETUTCDATE(), 1);

-- CompanyId'yi not edin
SELECT TOP 1 Id, Name FROM Companies ORDER BY CreatedAt DESC;
```

Browser Console'da CompanyId'yi set edin:
```javascript
localStorage.setItem('companyId', 'YOUR-COMPANY-GUID-HERE');
```

Sayfayı yenileyin ve mülk eklemeye başlayın! 🎉

## 📚 Dokümantasyon

Her klasörde detaylı README dosyaları bulunmaktadır:
- [Backend README](./Backend/README.md)
- [Frontend README](./Frontend/README.md)

## 🔐 Multi-Tenancy Nasıl Çalışır?

### Geliştirme Ortamı
- Frontend: localStorage'dan `companyId` alır ve her istekte `X-Company-Id` header'ına ekler
- Backend: Header'dan CompanyId'yi okur ve tüm database sorgularını otomatik filtreler

### Production Ortamı
- JWT token içinde `CompanyId` claim'i bulunmalı
- Backend otomatik olarak her sorguya CompanyId filtresi uygular
- Veri izolasyonu garanti altına alınır

## 📊 API Endpoints

### Properties (Mülkler)
- `GET /api/properties` - Tüm mülkleri listele (filtrelenmiş)
- `POST /api/properties` - Yeni mülk ekle

## 🎨 UI Özellikleri

- Modern ve responsive tasarım
- Form validasyonu
- Loading states
- Error handling
- Real-time updates (RTK Query cache)

## 🛠️ Geliştirme

### Backend Geliştirme
```bash
cd Backend
dotnet watch run --project API
```

### Frontend Geliştirme
```bash
cd Frontend
npm run dev
```

## 📝 Yeni Feature Ekleme

### Backend (CQRS)
1. `Domain/Entities` - Yeni entity ekle
2. `Application/Features/[Feature]/Commands` - Command handler yaz
3. `Application/Features/[Feature]/Queries` - Query handler yaz
4. `API/Controllers` - Controller endpoint ekle

### Frontend (Feature-based)
1. `src/features/[feature]/components` - Component'ler
2. `src/services/[feature]Api.ts` - RTK Query endpoints
3. Redux store'a entegre et

## 🧪 Test

```bash
# Backend tests
cd Backend
dotnet test

# Frontend tests (kurulacak)
cd Frontend
npm test
```

## 📦 Production Build

### Backend
```bash
cd Backend/API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd Frontend
npm run build
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 👨‍💻 Geliştirici

Tek başına geliştirilen bu proje, modern yazılım mimarisi prensiplerini göstermek için oluşturulmuştur.

---

**Not:** Bu proje Clean Architecture, CQRS ve Multi-tenancy gibi enterprise-level pattern'leri öğrenmek için mükemmel bir başlangıç noktasıdır.

