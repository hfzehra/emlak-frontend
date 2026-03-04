# Emlak Yönetim Sistemi - Frontend

## Teknolojiler
- React 18
- TypeScript
- Vite
- Redux Toolkit
- RTK Query

## Mimari
Feature-based klasör yapısı kullanılmıştır.

```
src/
├── app/
│   └── store.ts              # Redux store yapılandırması
├── features/
│   └── properties/
│       └── components/
│           ├── PropertyList.tsx
│           └── PropertyList.css
├── services/
│   └── propertyApi.ts        # RTK Query API definitions
├── components/               # Shared components
└── hooks/                    # Custom hooks
```

## Kurulum

### 1. Bağımlılıkları Yükle
```bash
cd Frontend
npm install
```

### 2. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

Uygulama şu adreste çalışacak: `http://localhost:5173`

### 3. CompanyId Ayarlama (Geliştirme)
Browser'da localStorage'a CompanyId ekleyin:
```javascript
// Browser Console'da çalıştırın
localStorage.setItem('companyId', 'your-company-guid-here');
```

## Build (Production)
```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulacak.

## Özellikler
✅ Redux Toolkit ile state yönetimi  
✅ RTK Query ile API entegrasyonu  
✅ TypeScript tip güvenliği  
✅ Modern ve responsive UI  
✅ Form validasyonu  
✅ Loading ve error state yönetimi  

## API Yapılandırması
`src/services/propertyApi.ts` dosyasında base URL:
```typescript
baseUrl: 'http://localhost:5000/api'
```

Backend farklı bir portta çalışıyorsa bu değeri güncelleyin.

## Kullanım

### Yeni Mülk Ekleme
1. "Yeni Mülk Ekle" butonuna tıklayın
2. Formu doldurun
3. "Ekle" butonuna tıklayın

### Mülkleri Görüntüleme
Sayfa açıldığında otomatik olarak mülkler listelenir.

## Scripts
- `npm run dev` - Geliştirme sunucusunu başlat
- `npm run build` - Production build
- `npm run preview` - Build'i önizle
- `npm run lint` - ESLint çalıştır

## Multi-Tenancy
Her API isteğinde otomatik olarak:
- JWT token (varsa) Authorization header'ına eklenir
- CompanyId, X-Company-Id header'ına eklenir

Bu işlemler `propertyApi.ts` içindeki `prepareHeaders` fonksiyonunda yapılır.

    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
