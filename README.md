# MVP Lab (7 Ürün Prototipi)

Bu proje, tek bir Next.js arayüzünde aşağıdaki 7 fikir için etkileşimli MVP prototipleri içerir:

1. Yapay zekâ destekli kişisel finans uygulaması
2. Freelance müşteri ve proje yönetim paneli
3. Türkçe öğrenci çalışma platformu
4. CV ve portföy oluşturucu
5. GitHub analiz paneli
6. Stok ve satış takip sistemi
7. Etkinlik platformu

## Dahil edilen MVP özellikleri

- Her ürün için ayrı çalışma ekranı (sol menüden geçiş)
- Form tabanlı temel CRUD/iş akışları
- Özet kartları, durum göstergeleri ve basit analizler
- GitHub panelinde canlı repo metrik çekimi (`owner/repo`)
- Etkinlik modülünde QR check-in simülasyonu

## Çalıştırma

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini açın.

## Notlar

- Prototip tamamen istemci tarafında çalışır.
- Veri kalıcılığı ve gerçek üretim entegrasyonları (auth, backend, ödeme, bildirim sağlayıcıları vb.) bu sürümde kapsam dışıdır.
