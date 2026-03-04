# 🚀 Git Komutları - Frontend Repo

## Frontend Repo Hazırlama

### 1. Backend Klasörünü Sil
```powershell
cd C:\Users\pc\Desktop\emlak\emlakProject
Remove-Item -Path "Backend" -Recurse -Force
```

### 2. Git Initialize (Eğer yoksa)
```bash
git init
git add .
git commit -m "Initial commit: Frontend React + TypeScript"
```

### 3. GitHub Remote Ekle ve Push
```bash
# Eğer remote yoksa
git remote add origin https://github.com/hfzehra/emlak-project.git
git branch -M main
git push -u origin main
```

---

## ▲ Vercel Deployment

### Option 1: Vercel Dashboard (Önerilen)

1. https://vercel.com/new adresine git
2. "Import Git Repository" tıkla
3. GitHub'dan `emlak-project` seç
4. Framework: **Vite** (otomatik algılanır)
5. Root Directory: **Frontend** (önemli!)
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Environment Variables ekle:
   ```
   VITE_API_URL=https://emlak-backend-production.up.railway.app
   ```
9. "Deploy" tıkla

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
cd Frontend
vercel --prod
```

CLI ile environment variable ekle:
```bash
vercel env add VITE_API_URL
# Değer gir: https://emlak-backend-production.up.railway.app
```

---

## 🔄 Güncellemeler İçin

```bash
cd C:\Users\pc\Desktop\emlak\emlakProject
git add .
git commit -m "feat: description of changes"
git push origin main
```

Vercel otomatik deploy edecek.

---

## 🔗 Backend CORS Güncelle

Frontend deploy edildikten sonra, backend Railway environment variables'a ekle:

```env
Cors__AllowedOrigins__0=https://emlak-project.vercel.app
```

Railway'i redeploy et veya otomatik restart bekle.

---

## ✅ Frontend Deploy Checklist

- [ ] Backend klasörü silindi
- [ ] Git init yapıldı
- [ ] GitHub'a push edildi
- [ ] Vercel projesi oluşturuldu
- [ ] Root Directory: Frontend seçildi
- [ ] `VITE_API_URL` environment variable eklendi
- [ ] İlk deploy tamamlandı
- [ ] Build başarılı
- [ ] Ana sayfa açılıyor
- [ ] Backend CORS güncellendi
- [ ] Login/Register test edildi

**Vercel URL:** https://emlak-project.vercel.app

---

## 📱 Custom Domain (Opsiyonel)

Vercel Settings → Domains:
1. "Add Domain" tıkla
2. Domain adını gir
3. DNS kayıtlarını ayarla
4. SSL otomatik sağlanır

Backend'de CORS'a custom domain'i de ekle:
```env
Cors__AllowedOrigins__1=https://your-custom-domain.com
```

