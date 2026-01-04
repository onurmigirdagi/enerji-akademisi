# Enerji Akademisi - Teknik Analiz Raporu

**Tarih:** 4 Ocak 2024
**İncelenen Proje:** Stantec Portal (Enerji Akademisi)

## 1. Genel Bakış
Proje, enerji farkındalığını artırmayı amaçlayan interaktif bir web platformudur. Teknik olarak **Supabase** destekli, **Vanilla JavaScript** ile geliştirilmiş bir **SPA (Single Page Application)** hibrit yapısına sahiptir.

### Mimari Bileşenler
*   **Frontend:** HTML5, CSS3 (Modern Variables), JavaScript (Vanilla - ES6+).
*   **Backend / Veritabanı:** Supabase (PostgreSQL).
*   **Kimlik Doğrulama:** Supabase Auth (Email & Password).
*   **İş Mantığı:** JavaScript (Client-side) + PostgreSQL Functions (Server-side).

---

## 2. Detaylı Kod Analizi

### 📂 Dosya Yapısı & Organizasyon
*   Proje yapısı sade ve anlaşılır. Her şey kök dizinde toplanmış.
*   `script.js`: **Kritik Tespit.** Bu dosya projenin tüm yükünü taşıyor (Auth, Router, UI, Logic, Data). 30KB+ boyutunda ve yönetilmesi zorlaşmaya başlamış.
*   `supabase_schema.sql`: Oldukça başarılı. RLS (Row Level Security) politikaları ve "Stored Procedure" kullanımı ile iş mantığının bir kısmı veritabanına taşınarak güvenlik artırılmış.

### 💻 Arayüz (HTML/CSS)
*   **Tasarım:** "Glassmorphism" ve modern UI elementleri ile profesyonel bir görünüm katılmış.
*   **HTML:** Semantik etiketler (`nav`, `main`, `section`) doğru kullanılmış.
*   **CSS:** Flexbox ve Grid yapıları etkin. Stil dosyasının harici olması iyi.

### ⚙️ JavaScript & İş Mantığı
*   **State Yönetimi:** `currentUser`, `isLoginMode` gibi global değişkenler kullanılıyor. Uygulama büyüdükçe riskli.
*   **Veri Yönetimi:** Anket soruları (`knowledgeQuestions`) kodun içine gömülmüş (Hardcoded). Güncelleme zorluğu yaratıyor.
*   **Güvenlik:** Supabase RLS kuralları ile veri güvenliği sağlanmış.

---

## 3. Tespit Edilen Teknik Borçlar ve Sorunlar

| Öncelik | Kategori | Sorun | Etki |
| :--- | :--- | :--- | :--- |
| 🔴 Yüksek | **Mimari** | `script.js` Monolitik yapıda. | Bakım zorluğu, Hata riski. |
| 🟡 Orta | **Veri** | Sorular Hardcoded. | Dinamik değil, Panelden yönetilemez. |
| 🟡 Orta | **UX** | Sayfa yenilemelerinde "Loading" durumu yönetimi zayıf. | Kullanıcıda "boş sayfa" algısı. |

---

## 4. Geliştirme Önerileri

### 🚀 Faz 1: Refactoring
1.  **Modüler Yapı:** JS kodunu `auth.js`, `quiz.js`, `ui.js` olarak bölün.
2.  **ES6 Modules:** `type="module"` kullanarak import/export yapısına geçin.

### 💾 Faz 2: Backend
1.  **Veritabanı Odaklı İçerik:** Soruları Supabase'de bir tabloya taşıyın.

### ✨ Faz 3: UX
1.  **Skeleton Loading:** Yükleme anlarını görselleştirin.

---

**Sonuç:** Proje MVP aşamasını başarıyla geçmiş güçlü bir altyapıya sahip, ancak kod organizasyonu (Refactoring) ihtiyacı var.
