# 🐘 PostgreSQL Bağlantı Bilgileri

## Mevcut Ayarlar

### Docker PostgreSQL (docker-compose.yml)
```
Host: localhost
Port: 5432
Database: emlak_saas
Username: postgres
Password: postgres
```

### Backend Bağlantı String'i (appsettings.json)
```
Host=localhost;Port=5432;Database=emlak_saas;Username=postgres;Password=postgres
```

---

## ⚠️ Port Çakışması Sorunu

**Hata:** "Port 5432 is already allocated"

Bu hata, bilgisayarınızda zaten PostgreSQL'in kurulu ve çalıştığı anlamına gelir.

---

## ✅ ÇÖZÜM SEÇENEKLERİ

### 🎯 SEÇENEK 1: Mevcut PostgreSQL'i Kullan (ÖNERİLEN)

Docker'a gerek yok. Mevcut PostgreSQL'inizi kullanın.

#### Adımlar:

1. **PostgreSQL'in Çalıştığını Kontrol Edin:**
```powershell
# Windows'ta PostgreSQL servisini kontrol et
Get-Service -Name postgresql*
```

2. **pgAdmin veya psql ile Bağlanın:**
   - pgAdmin'i açın (PostgreSQL ile birlikte gelir)
   - Veya komut satırından:
```powershell
psql -U postgres
```

3. **Veritabanını Oluşturun:**
```sql
CREATE DATABASE emlak_saas;
```

4. **Backend'i Çalıştırın:**
```powershell
cd Backend\API
dotnet run
```

**NOT:** Eğer şifreniz farklıysa, `appsettings.json` dosyasındaki şifreyi değiştirin.

---

### 🔄 SEÇENEK 2: Docker'ı Farklı Portta Çalıştır

Docker kullanmak istiyorsanız, portu değiştirin.

#### docker-compose.yml'i düzenleyin:
```yaml
ports:
  - "5433:5432"  # 5432 yerine 5433 kullan
```

#### appsettings.json'u düzenleyin:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5433;Database=emlak_saas;Username=postgres;Password=postgres"
}
```

#### Sonra Docker'ı çalıştırın:
```powershell
docker-compose up -d
```

---

### 🛑 SEÇENEK 3: Mevcut PostgreSQL'i Durdur

Sadece Docker kullanmak istiyorsanız:

```powershell
# Windows servisi olarak çalışıyorsa:
Stop-Service postgresql*

# Sonra Docker'ı çalıştır:
docker-compose up -d
```

---

## 🔍 PostgreSQL Şifrenizi Nasıl Bulursunuz?

### Windows'ta:

1. **PostgreSQL Kurulum Klasörünü Bulun:**
   - Genellikle: `C:\Program Files\PostgreSQL\{version}\`

2. **pgAdmin ile Bağlanın:**
   - Başlat menüsünden "pgAdmin" açın
   - Eğer bağlanabiliyorsanız, şifre kayıtlıdır

3. **Şifreyi Hatırlayamıyorsanız:**
   - `pg_hba.conf` dosyasını düzenleyip şifresiz giriş yapabilirsiniz (geliştirme için)
   - Konum: `C:\Program Files\PostgreSQL\{version}\data\pg_hba.conf`

---

## 🚀 Hızlı Başlangıç

### Önerilen Yöntem (Mevcut PostgreSQL):

```powershell
# 1. Veritabanı oluştur
psql -U postgres -c "CREATE DATABASE emlak_saas;"

# 2. Backend'i çalıştır
cd Backend\API
dotnet ef database update
dotnet run

# 3. Frontend'i çalıştır (başka terminal)
cd Frontend
npm install
npm run dev
```

---

## 📞 Destek

Eğer hala sorun yaşıyorsanız:

1. **PostgreSQL versiyonunuzu kontrol edin:**
```powershell
psql --version
```

2. **Bağlantıyı test edin:**
```powershell
.\test_db.ps1
```

3. **Şifreniz farklıysa:**
   - `Backend\API\appsettings.json` dosyasında `Password=postgres` kısmını kendi şifrenizle değiştirin
   - `Backend\API\appsettings.Development.json` dosyasında da aynısını yapın

---

## 🔐 Şifre Değiştirme

Eğer PostgreSQL şifrenizi değiştirmek isterseniz:

```sql
-- psql'e bağlanın
psql -U postgres

-- Şifreyi değiştirin
ALTER USER postgres WITH PASSWORD 'yeni_sifreniz';
```

Sonra appsettings.json'da da güncelleyin.

---

**Son Güncelleme:** 2026-03-04

