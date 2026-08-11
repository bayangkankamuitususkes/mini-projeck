# 📓 Daily Journal & Mood Tracker

Aplikasi web sederhana untuk **menulis jurnal harian** dan **melacak suasana hati (mood)**. Dibangun dengan HTML, CSS, dan JavaScript murni — tanpa framework, tanpa backend, dan tanpa database eksternal.

> **Demo:** [https://bayangkankamuitususkes.github.io/mini-projeck/](https://bayangkankamuitususkes.github.io/mini-projeck/) *(aktifkan GitHub Pages terlebih dahulu)*

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Tulis catatan** | Simpan jurnal dengan tanggal, mood, dan teks bebas |
| **Mood tracker** | 5 pilihan mood: Senang, Biasa, Sedih, Marah, Cemas |
| **Grafik mood** | Diagram donat menampilkan distribusi mood 7 hari terakhir |
| **Cari catatan** | Filter catatan berdasarkan kata kunci atau tanggal |
| **Edit & hapus** | Perbarui atau hapus catatan yang sudah tersimpan |
| **PWA** | Bisa diinstal di perangkat mobile/desktop seperti aplikasi native |
| **Offline-ready** | Service Worker menyimpan aset agar tetap bisa dibuka tanpa internet |

---

## 🛠️ Teknologi

- **HTML5** — struktur halaman
- **CSS3** — tampilan responsif (mobile-first)
- **Vanilla JavaScript** — logika aplikasi & penyimpanan data
- **[Chart.js](https://www.chartjs.org/)** — visualisasi grafik mood
- **localStorage** — penyimpanan data di browser
- **Service Worker + Web App Manifest** — dukungan PWA

---

## 🚀 Cara Menjalankan

### Opsi 1: Buka langsung di browser

1. Clone atau unduh repository ini
2. Buka file `index.html` di browser (Chrome, Firefox, Edge, dll.)

### Opsi 2: Live Server (disarankan untuk development)

```bash
# Jika menggunakan VS Code / Cursor, install extension "Live Server"
# Klik kanan index.html → "Open with Live Server"
```

### Opsi 3: GitHub Pages

1. Buka repository di GitHub
2. Masuk ke **Settings → Pages**
3. Source: **Deploy from branch**
4. Branch: **main**, folder: **/ (root)**
5. Simpan — situs akan tersedia di `https://<username>.github.io/mini-projeck/`

---

## 📁 Struktur Proyek

```
daily-journal/
├── index.html      # Halaman utama aplikasi
├── app.js          # Logika: CRUD catatan, grafik, pencarian
├── style.css       # Gaya tampilan responsif
├── manifest.json   # Konfigurasi PWA (nama, ikon, tema)
├── sw.js           # Service Worker untuk cache offline
├── README.md       # Dokumentasi proyek (file ini)
└── MANUAL.md       # Buku panduan pengguna lengkap
```

---

## 💾 Penyimpanan Data

Semua catatan jurnal disimpan di **localStorage** browser dengan kunci `journal_entries`. Data:

- Hanya tersimpan di perangkat & browser yang sama
- Tidak dikirim ke server manapun
- Akan hilang jika cache browser dibersihkan (opsi "Clear site data")

---

## 📖 Panduan Pengguna

Untuk penjelasan langkah demi langkah cara menggunakan aplikasi, lihat:

👉 **[MANUAL.md](./MANUAL.md)** — Buku Panduan Lengkap

---

## 📄 Lisensi

Proyek ini open source. Bebas digunakan, dimodifikasi, dan dibagikan.

---

## 👤 Kontribusi

Pull request dan issue dipersilakan. Pastikan perubahan tidak merusak fungsionalitas yang sudah ada.
