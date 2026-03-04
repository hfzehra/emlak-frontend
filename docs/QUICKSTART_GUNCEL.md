# 🚀 Hızlı Başlangıç - Güncel Versiyon

## Son Değişiklikler (2026-03-05)

### 🔧 Düzeltilen Sorunlar

1. **✅ Login Hata Mesajları**
   - Yanlış kullanıcı adı/şifre girildiğinde artık açık hata mesajı gösteriliyor
   - "E-posta veya şifre hatalı." mesajı ekranda görünecek

2. **✅ Mülk Ekleme - Çift Kira Sorunu**
   - Artık kira tutarı sadece Step 4'te bir kez girilecek
   - Step 2'deki gereksiz kira alanı kaldırıldı

3. **✅ Şehir ve İlçe Seçimi**
   - Manuel yazma yerine dropdown'dan seçim
   - Türkiye API entegrasyonu (https://turkiyeapi.dev)
   - Şehir seçilince ilçeler otomatik yükleniyor

4. **✅ Kiracı Validasyonu**
   - Kiralık mülk eklerken kiracı bilgileri artık zorunlu
   - Ad, soyad, telefon mutlaka girilmeli

---

## Projeyi Çalıştırma

### 1. Backend
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API
dotnet run
```
🌐 Backend: https://localhost:5001

### 2. Frontend
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject\Frontend
npm run dev
```
🌐 Frontend: http://localhost:5173

---

## Giriş Bilgileri

### Şirket Yöneticisi
- **Email:** (Kayıt sırasında oluşturulan)
- **Şifre:** (Kayıt sırasında belirlenen)

### Yeni Şirket Kaydı
1. http://localhost:5173/register adresine git
2. Şirket bilgilerini gir
3. Otomatik admin hesabı oluşturulur
4. Login sayfasına yönlendirilirsin

---

## Mülk Ekleme Akışı

### Adım 1: Mülk Sahibi
- **Seçenek A:** Yeni sahip ekle (Ad, Soyad, Telefon)
- **Seçenek B:** Mevcut sahipten seç

### Adım 2: Kiralık Mı?
- **Boş:** Sadece "Hayır" seç
- **Kirada:** 
  - Kiracı Ad, Soyad, Telefon (ZORUNLU)
  - Sözleşme Başlangıç ve Bitiş Tarihi (ZORUNLU)
  - Depozito (Opsiyonel)

### Adım 3: Mülk Bilgisi
- **Şehir:** Dropdown'dan seç (örn: İstanbul)
- **İlçe:** Otomatik yüklenir, dropdown'dan seç (örn: Kadıköy)
- **Adres:** Kısa adres gir
- **Mülk Tipi:** Daire, Villa, Ofis, vb.
- **Oda Sayısı & Alan:** Opsiyonel

### Adım 4: Finansal Bilgiler
- **Aylık Kira:** Kira tutarı (ZORUNLU)
- **Kira Vadesi:** Ayın hangi günü (1-28)
- **Komisyon:** Opsiyonel

✅ **Kaydet** → Mülk başarıyla eklenir

---

## Dashboard

Giriş yaptıktan sonra otomatik olarak Dashboard açılır:

- 📊 **Toplam Mülk Sayısı**
- 🏠 **Kirada Olan Mülkler**
- 🔑 **Boş Mülkler**
- ✅ **Bu Ay Tahsil Edilen Kira**
- ⏳ **Bu Ay Bekleyen Kira**
- 📋 **Son Eklenen 5 Mülk**

---

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Mülkler
```
GET  /api/properties
GET  /api/properties/{id}
POST /api/properties/wizard
DELETE /api/properties/{id}
```

### Dashboard
```
GET /api/dashboard
```

### Kişiler
```
GET /api/persons?personType=0  (0=Sahip, 1=Kiracı)
```

---

## Sorun Giderme

### Backend Hatası
```powershell
# Veritabanı bağlantısını kontrol et
cd Backend/API
dotnet ef database update
```

### Frontend Hatası
```powershell
# Node modüllerini yeniden yükle
cd Frontend
rm -r node_modules
npm install
```

### CORS Hatası
`Backend/API/Program.cs` dosyasında CORS ayarları zaten yapılmış olmalı.

---

## Daha Fazla Bilgi

📖 Detaylı düzeltme notları: `docs/DUZELTMELER.md`
📖 Backend kurulum: `Backend/docs/BACKEND_CALISTIRMA.md`
📖 Supabase entegrasyon: `docs/SUPABASE_BAGLANTI_REHBERI.md`

---

## İletişim

Sorun yaşarsan:
1. `docs/DUZELTMELER.md` dosyasını oku
2. F12 → Console'da hataları kontrol et
3. Backend loglarını kontrol et

**Version:** 1.1.0 (2026-03-05)

