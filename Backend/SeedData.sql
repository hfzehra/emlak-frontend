-- ================================================
-- EMLAK YÖNETİM SİSTEMİ - TEST VERİLERİ
-- ================================================

-- Test Şirketi Ekle
DECLARE @CompanyId UNIQUEIDENTIFIER = NEWID();

INSERT INTO Companies (Id, Name, Email, Phone, Address, CreatedAt, IsActive)
VALUES (@CompanyId, 'Test Emlak Ltd. Şti.', 'info@testemlak.com', '05551234567', 'Maslak, İstanbul, Türkiye', GETUTCDATE(), 1);

PRINT '✓ Test şirketi oluşturuldu: ' + CAST(@CompanyId AS NVARCHAR(50));

-- Test Mülkleri Ekle
INSERT INTO Properties (Id, Title, Description, Address, Price, RoomCount, Area, PropertyType, Status, CompanyId, CreatedAt, IsDeleted)
VALUES 
    (NEWID(), 'Maslak''ta Lüks Daire', 'Deniz manzaralı, 3+1 lüks daire. Sitede havuz, spor salonu ve güvenlik bulunmaktadır.', 'Maslak Mah. Büyükdere Cad. No:123 Sarıyer/İstanbul', 8500000, 3, 150, 'Daire', 'Aktif', @CompanyId, GETUTCDATE(), 0),
    
    (NEWID(), 'Kadıköy''de Satılık İşyeri', 'Ana cadde üzeri, köşe başı işyeri. Yoğun insan trafiği.', 'Moda Cad. No:45 Kadıköy/İstanbul', 4200000, 0, 80, 'İşyeri', 'Aktif', @CompanyId, GETUTCDATE(), 0),
    
    (NEWID(), 'Beykoz''da Müstakil Villa', 'Doğa içinde, özel havuzlu, 5+2 müstakil villa. Boğaz manzaralı.', 'Beykoz Korusu Mevkii Beykoz/İstanbul', 15000000, 5, 350, 'Villa', 'Aktif', @CompanyId, GETUTCDATE(), 0),
    
    (NEWID(), 'Ataşehir''de 2+1 Daire', 'Metro yakını, yeni binada, ferah 2+1 daire.', 'Barbaros Mah. İnönü Cad. No:67 Ataşehir/İstanbul', 3500000, 2, 95, 'Daire', 'Aktif', @CompanyId, GETUTCDATE(), 0),
    
    (NEWID(), 'Şile''de Arsa', 'Deniz manzaralı, imar planlı 1000 m² arsa. Yola cepheli.', 'Şile Merkez Şile/İstanbul', 2800000, 0, 1000, 'Arsa', 'Aktif', @CompanyId, GETUTCDATE(), 0);

PRINT '✓ 5 test mülkü eklendi';

-- Sonuçları Göster
PRINT '';
PRINT '================================================';
PRINT '   TEST VERİLERİ BAŞARIYLA EKLENDİ!';
PRINT '================================================';
PRINT '';
PRINT 'CompanyId: ' + CAST(@CompanyId AS NVARCHAR(50));
PRINT '';
PRINT 'Bu ID''yi kopyalayın ve browser console''da şu komutu çalıştırın:';
PRINT 'localStorage.setItem(''companyId'', ''' + CAST(@CompanyId AS NVARCHAR(50)) + ''');';
PRINT '';
PRINT '================================================';

-- Eklenen verileri listele
SELECT 
    'ŞIRKET' AS [Tür],
    Name AS [İsim],
    Email AS [Email],
    Phone AS [Telefon],
    CAST(Id AS NVARCHAR(50)) AS [ID]
FROM Companies 
WHERE Id = @CompanyId;

SELECT 
    'MÜLK' AS [Tür],
    Title AS [Başlık],
    PropertyType AS [Tip],
    FORMAT(Price, 'N0', 'tr-TR') + ' TL' AS [Fiyat],
    CAST(Area AS NVARCHAR) + ' m²' AS [Alan]
FROM Properties 
WHERE CompanyId = @CompanyId;

