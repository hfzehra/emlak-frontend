# Emlak Yönetim Sistemi - Hızlı Başlatma Script'i

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   EMLAK YÖNETİM SİSTEMİ - HIZLI BAŞLATMA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Backend'i kontrol et
Write-Host "[1/4] Backend kontrolü yapılıyor..." -ForegroundColor Yellow
if (Test-Path ".\Backend\API\API.csproj") {
    Write-Host "✓ Backend bulundu" -ForegroundColor Green
} else {
    Write-Host "✗ Backend bulunamadı!" -ForegroundColor Red
    exit 1
}

# Frontend'i kontrol et
Write-Host "[2/4] Frontend kontrolü yapılıyor..." -ForegroundColor Yellow
if (Test-Path ".\Frontend\package.json") {
    Write-Host "✓ Frontend bulundu" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend bulunamadı!" -ForegroundColor Red
    exit 1
}

# Backend bağımlılıklarını kontrol et
Write-Host "[3/4] Backend bağımlılıkları kontrol ediliyor..." -ForegroundColor Yellow
cd Backend
dotnet restore --verbosity quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend bağımlılıkları hazır" -ForegroundColor Green
} else {
    Write-Host "✗ Backend bağımlılık hatası!" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..

# Frontend bağımlılıklarını kontrol et
Write-Host "[4/4] Frontend bağımlılıkları kontrol ediliyor..." -ForegroundColor Yellow
cd Frontend
if (Test-Path ".\node_modules") {
    Write-Host "✓ Frontend bağımlılıkları hazır" -ForegroundColor Green
} else {
    Write-Host "! Frontend bağımlılıkları yükleniyor (biraz zaman alabilir)..." -ForegroundColor Yellow
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend bağımlılıkları yüklendi" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend bağımlılık hatası!" -ForegroundColor Red
        cd ..
        exit 1
    }
}
cd ..

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SİSTEM BAŞLATILIYOR" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Migration kontrolü
Write-Host "ÖNEMLİ: Database migration'ı yapılmalı!" -ForegroundColor Yellow
Write-Host "Şu komutları çalıştırın:" -ForegroundColor Yellow
Write-Host "  cd Backend\Infrastructure" -ForegroundColor White
Write-Host "  dotnet ef migrations add InitialCreate --startup-project ..\API" -ForegroundColor White
Write-Host "  dotnet ef database update --startup-project ..\API" -ForegroundColor White
Write-Host ""

$response = Read-Host "Migration'ı tamamladınız mı? (E/H)"
if ($response -ne "E" -and $response -ne "e") {
    Write-Host "Lütfen önce migration'ı tamamlayın." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Backend başlatılıyor (http://localhost:5000)..." -ForegroundColor Green
Write-Host "Frontend başlatılıyor (http://localhost:5173)..." -ForegroundColor Green
Write-Host ""
Write-Host "Her iki sunucu da yeni terminal penceresinde açılacak." -ForegroundColor Cyan
Write-Host "Kapatmak için CTRL+C kullanın." -ForegroundColor Cyan
Write-Host ""

# Backend'i yeni terminalde başlat
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Backend\API'; Write-Host 'Backend Server Başlatılıyor...' -ForegroundColor Green; dotnet run"

# Biraz bekle
Start-Sleep -Seconds 3

# Frontend'i yeni terminalde başlat
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Frontend'; Write-Host 'Frontend Server Başlatılıyor...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SUNUCULAR BAŞLATILDI!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "Swagger UI:  http://localhost:5000/swagger" -ForegroundColor White
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "İlk kullanımda şu adımları izleyin:" -ForegroundColor Yellow
Write-Host "1. SQL Server'da test şirketi oluşturun (README.md'ye bakın)" -ForegroundColor White
Write-Host "2. Browser console'da localStorage.setItem('companyId', 'GUID')" -ForegroundColor White
Write-Host "3. Sayfayı yenileyin ve mülk eklemeye başlayın!" -ForegroundColor White
Write-Host ""
Write-Host "Daha fazla bilgi için README.md dosyasına bakın." -ForegroundColor Cyan
Write-Host ""

