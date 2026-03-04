# Test Komutları

## Backend Test

### 1. Build ve Çalıştır
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API
dotnet build
dotnet run
```

### 2. Sadece Build (Hata Kontrolü)
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend
dotnet build
```

### 3. Migration Kontrol
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API
dotnet ef database update
```

---

## Frontend Test

### 1. Geliştirme Sunucusu
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Frontend
npm run dev
```

### 2. Build Test
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Frontend
npm run build
```

### 3. Lint Kontrol
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Frontend
npm run lint
```

---

## Manuel API Test

### 1. Kayıt (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Emlak",
    "email": "admin@test.com",
    "password": "Test123!",
    "fullName": "Test Admin",
    "phone": "05321234567"
  }'
```

### 2. Giriş (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!"
  }'
```

### 3. Dashboard (Token ile)
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Mülk Ekleme
```bash
curl -X POST http://localhost:5000/api/properties/wizard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "ownerFirstName": "Ahmet",
    "ownerLastName": "Yılmaz",
    "ownerPhone": "05321234567",
    "isRented": true,
    "tenantFirstName": "Mehmet",
    "tenantLastName": "Demir",
    "tenantPhone": "05339876543",
    "contractStartDate": "2026-03-01T00:00:00Z",
    "contractEndDate": "2027-03-01T00:00:00Z",
    "deposit": 17000,
    "city": "İstanbul",
    "district": "Kadıköy",
    "shortAddress": "Moda Caddesi No:5 D:3",
    "propertyType": 0,
    "roomCount": 3,
    "area": 120,
    "monthlyRent": 17000,
    "rentDueDay": 2,
    "commission": 850
  }'
```

---

## Browser Test Adımları

### Test 1: Login Hata Mesajı
1. Tarayıcıda: http://localhost:5173/login
2. Email: `yanlis@email.com`
3. Şifre: `123456`
4. **Beklenen:** "E-posta veya şifre hatalı." mesajı

### Test 2: Başarılı Login
1. Doğru bilgilerle giriş yap
2. **Beklenen:** Dashboard'a yönlendirilme
3. İstatistiklerin görünmesi

### Test 3: Boş Mülk Ekleme
1. Mülkler → Yeni Mülk
2. Step 1: Sahip bilgilerini doldur
3. Step 2: "Hayır - Boş" seç
4. Step 3: Şehir dropdown'ından "İstanbul" seç
5. Step 3: İlçe dropdown'ından "Kadıköy" seç
6. Step 4: Kira tutarı: 10000
7. **Beklenen:** Başarıyla kaydedilmeli

### Test 4: Kiralık Mülk Ekleme (Kiracı Bilgisi Eksik)
1. Yeni Mülk
2. Step 2: "Evet - Kirada" seç
3. Kiracı bilgilerini BOŞ bırak
4. İleri git
5. **Beklenen:** "Kiracı bilgileri zorunludur" hatası

### Test 5: Kiralık Mülk Ekleme (Başarılı)
1. Yeni Mülk
2. Step 2: "Evet - Kirada" seç
3. Kiracı Ad: "Zehra"
4. Kiracı Soyad: "UYSAL"
5. Kiracı Telefon: "05550725061"
6. Başlangıç: "2026-03-05"
7. Bitiş: "2027-03-05"
8. Step 3: Şehir/İlçe seç
9. Step 4: Kira: 17000
10. **Beklenen:** Başarıyla kaydedilmeli

---

## Hata Ayıklama

### Backend Loglama
Backend terminalde gelen istekleri görebilirsin:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

### Frontend Console
Tarayıcıda F12 → Console:
```javascript
// Dashboard verisi kontrolü
console.log('Dashboard verisi:', data);

// Wizard hata kontrolü
console.error('Wizard hatası:', err.response?.data);
```

### Network Tab
F12 → Network → XHR:
- `/api/auth/login` → Status 200 ise başarılı
- `/api/dashboard` → Response'da veri var mı?
- `/api/properties/wizard` → Status 400 ise validasyon hatası

---

## Başarı Kriterleri

✅ Backend hatasız derlenip çalışıyor
✅ Frontend hatasız derlenip çalışıyor
✅ Login yapılabiliyor
✅ Login hatası gösteriliyor
✅ Dashboard verileri geliyor
✅ Şehir/İlçe dropdown'ları çalışıyor
✅ Boş mülk eklenebiliyor
✅ Kiralık mülk eklenebiliyor
✅ Kiracı validasyonu çalışıyor

---

## Notlar

- Türkiye API internete bağımlı (offline çalışmaz)
- CORS ayarları Backend/API/Program.cs'de yapılmış
- JWT token 24 saat geçerli
- Tüm tarihler UTC olarak saklanıyor

