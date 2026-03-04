# 🐘 PostgreSQL Kurulum ve Başlatma Rehberi

## Mevcut Durum

PostgreSQL 16 bilgisayarınızda kurulu ama yapılandırma hatası var.
Docker'ı kaldırdık, artık kullanmıyoruz.

---

## ✅ ÇÖZÜMLERİ

### SEÇENEK 1: PostgreSQL Portable Kullan (EN KOLAY) ⭐

PostgreSQL Portable, kurulum gerektirmeyen bir sürüm.

#### Adımlar:

1. **PostgreSQL Portable İndir:**
   - https://github.com/garethflowers/postgresql-portable/releases
   - En son sürümü indirin (postgresql-16.x-windows-x64-binaries.zip)

2. **Zip'i Açın:**
   ```powershell
   # Örneğin C:\PostgreSQL dizinine açın
   Expand-Archive -Path "indirilen_dosya.zip" -DestinationPath "C:\PostgreSQL"
   ```

3. **Data Klasörü Oluşturun:**
   ```powershell
   mkdir C:\PostgreSQL\data
   ```

4. **PostgreSQL'i Başlatın:**
   ```powershell
   cd C:\PostgreSQL\pgsql\bin
   .\initdb.exe -D C:\PostgreSQL\data -U postgres -E UTF8
   .\pg_ctl.exe -D C:\PostgreSQL\data -l C:\PostgreSQL\logfile start
   ```

5. **Veritabanı Oluşturun:**
   ```powershell
   .\createdb.exe -U postgres emlak_saas
   ```

---

### SEÇENEK 2: Mevcut PostgreSQL'i Düzelt

Mevcut PostgreSQL 16'daki yapılandırma hatasını düzeltin.

#### Adımlar:

1. **postgresql.conf dosyasını düzenleyin:**
   - Konum: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`
   - Not Defteri'ni Yönetici olarak açın
   - Dosyayı açın

2. **Şu satırları bulun ve değiştirin:**
   ```ini
   # Eski (hatalı):
   lc_monetary = 'Turkish_Turkey.1254'
   lc_numeric = 'Turkish_Turkey.1254'
   lc_time = 'Turkish_Turkey.1254'

   # Yeni (doğru):
   lc_monetary = 'C'
   lc_numeric = 'C'
   lc_time = 'C'
   ```

3. **Servisi başlatın:**
   ```powershell
   Start-Service postgresql-x64-16
   ```

4. **Veritabanı oluşturun:**
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE emlak_saas;"
   ```

---

### SEÇENEK 3: PostgreSQL'i Yeniden Kur

En temiz çözüm.

#### Adımlar:

1. **Mevcut PostgreSQL'leri Kaldırın:**
   - Denetim Masası > Programlar ve Özellikler
   - PostgreSQL 12 ve 16'yı kaldırın

2. **PostgreSQL 16'yı Yeniden Kurun:**
   - https://www.postgresql.org/download/windows/
   - Installer'ı indirin
   - Kurulum sırasında şifre: `postgres`
   - Port: `5432`

3. **Veritabanı Oluşturun:**
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE emlak_saas;"
   ```

---

## 🚀 Backend'i Başlatma (PostgreSQL Hazır Olduktan Sonra)

```powershell
# 1. Backend klasörüne gidin
cd C:\Users\pc\Desktop\emlak\emlakProject\Backend\API

# 2. Migration'ları çalıştırın
dotnet ef database update

# 3. Backend'i başlatın
dotnet run
```

---

## 🌐 Frontend'i Başlatma

```powershell
# 1. Frontend klasörüne gidin
cd C:\Users\pc\Desktop\emlak\emlakProject\Frontend

# 2. Bağımlılıkları kurun (ilk kez)
npm install

# 3. Frontend'i başlatın
npm run dev
```

---

## 🔍 PostgreSQL Bağlantı Testi

```powershell
# Test scriptini çalıştırın
.\test_db.ps1
```

Ya da manuel test:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d emlak_saas -c "SELECT version();"
```

---

## 📝 ÖNEMLİ NOTLAR

### Bağlantı Bilgileri (appsettings.json'da):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=emlak_saas;Username=postgres;Password=postgres"
  }
}
```

### Şifreniz Farklıysa:

Eğer PostgreSQL kurulumunda başka bir şifre kullandıysanız:

1. `Backend\API\appsettings.json` dosyasını açın
2. `Password=postgres` kısmını kendi şifrenizle değiştirin
3. `Backend\API\appsettings.Development.json` dosyasında da aynısını yapın

---

## ❓ Sorun Giderme

### PostgreSQL Çalışıyor mu Kontrol Et:

```powershell
Get-Service -Name postgresql*
```

### Port 5432 Kullanılıyor mu:

```powershell
netstat -ano | findstr :5432
```

### psql Komutunu Bulamıyor:

Path'e ekleyin:

```powershell
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```

Ya da tam yolu kullanın:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```

---

## 🎯 TAVSİYE EDİLEN: SEÇENEK 2

En hızlı çözüm, mevcut PostgreSQL'deki yapılandırma dosyasını düzeltmek.

**Özet Adımlar:**

1. Yönetici olarak Not Defteri aç
2. `C:\Program Files\PostgreSQL\16\data\postgresql.conf` dosyasını aç
3. `lc_monetary`, `lc_numeric`, `lc_time` satırlarını bul
4. Değerlerini `'C'` olarak değiştir
5. Kaydet ve kapat
6. Servisi başlat: `Start-Service postgresql-x64-16`
7. Veritabanı oluştur

---

**Hangi yöntemi tercih ederseniz, sonrasında backend ve frontend'i başlatabilirsiniz.**

**Son Güncelleme:** 2026-03-04

