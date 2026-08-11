# 📖 Buku Panduan — Daily Journal & Mood Tracker

Panduan lengkap untuk menggunakan aplikasi **Daily Journal & Mood Tracker**.

---

## Daftar Isi

1. [Pengenalan](#1-pengenalan)
2. [Memulai Aplikasi](#2-memulai-aplikasi)
3. [Menulis Catatan Baru](#3-menulis-catatan-baru)
4. [Memahami Pilihan Mood](#4-memahami-pilihan-mood)
5. [Membaca Grafik Mood](#5-membaca-grafik-mood)
6. [Mencari Catatan](#6-mencari-catatan)
7. [Mengedit Catatan](#7-mengedit-catatan)
8. [Menghapus Catatan](#8-menghapus-catatan)
9. [Menginstal sebagai Aplikasi (PWA)](#9-menginstal-sebagai-aplikasi-pwa)
10. [Pertanyaan Umum (FAQ)](#10-pertanyaan-umum-faq)

---

## 1. Pengenalan

**Daily Journal & Mood Tracker** adalah aplikasi jurnal digital yang membantu Anda:

- Mencatat kejadian dan perasaan setiap hari
- Melacak pola suasana hati (mood) dari waktu ke waktu
- Menyimpan semua data secara pribadi di perangkat Anda

Aplikasi ini **tidak memerlukan akun login** dan **tidak mengirim data ke internet**. Semua catatan disimpan lokal di browser Anda.

---

## 2. Memulai Aplikasi

### Cara membuka

1. Buka `index.html` di browser, **atau**
2. Akses URL GitHub Pages jika sudah di-deploy

### Tampilan utama

Saat aplikasi terbuka, Anda akan melihat tiga bagian:

```
┌─────────────────────────────────┐
│  📓 Daily Journal               │  ← Header / judul
├─────────────────────────────────┤
│  Catatan Baru                   │  ← Form menulis jurnal
│  [Tanggal] [Mood] [Catatan]     │
├─────────────────────────────────┤
│  Mood Minggu Ini                │  ← Grafik donat mood
│  [Chart]                        │
├─────────────────────────────────┤
│  [Cari catatan...]              │  ← Pencarian
│  Daftar catatan lama            │  ← Feed catatan
└─────────────────────────────────┘
```

Jika belum pernah menulis catatan, akan muncul pesan:

> *"Belum ada catatan. Mulai tulis hari ini! ✨"*

---

## 3. Menulis Catatan Baru

### Langkah-langkah

| Langkah | Aksi |
|---------|------|
| **1** | Isi **Tanggal** — secara default sudah terisi tanggal hari ini |
| **2** | Pilih **Mood** — klik salah satu emoji mood (wajib) |
| **3** | Tulis **Catatan** — deskripsikan hari Anda |
| **4** | Klik tombol **Simpan** |

### Contoh catatan

```
Tanggal : 11 Agustus 2026
Mood    : 😊 Senang
Catatan : Hari ini selesai presentasi proyek. Merasa lega dan bangga
          dengan hasil tim. Besok rencananya istirahat sejenak.
```

### Catatan penting

- **Mood wajib dipilih** — jika belum, akan muncul peringatan *"Pilih mood terlebih dahulu!"*
- **Teks catatan wajib diisi** — tidak boleh dikosongkan
- Anda bisa menulis **lebih dari satu catatan** di tanggal yang sama
- Catatan terbaru selalu muncul **di atas** daftar

---

## 4. Memahami Pilihan Mood

Aplikasi menyediakan **5 kategori mood**:

| Emoji | Nama | Warna Grafik | Kapan digunakan |
|-------|------|----------------|-----------------|
| 😊 | **Senang** | Hijau | Hari yang menyenangkan, penuh kebahagiaan |
| 😐 | **Biasa** | Kuning | Hari biasa, netral, tidak terlalu naik atau turun |
| 😢 | **Sedih** | Biru | Merasa sedih, kecewa, atau melankolis |
| 😠 | **Marah** | Merah | Kesal, frustrasi, atau marah |
| 😰 | **Cemas** | Ungu | Khawatir, gelisah, atau stres |

### Cara memilih mood

1. Klik emoji mood yang sesuai perasaan Anda
2. Emoji yang dipilih akan **ter-highlight** (border biru + background ungu muda)
3. Hanya **satu mood** yang bisa dipilih per catatan

---

## 5. Membaca Grafik Mood

Bagian **"Mood Minggu Ini"** menampilkan diagram donat (pie chart) yang merangkum mood Anda **7 hari terakhir**.

### Cara membaca grafik

```
        😊 Senang  ████ 40%
        😐 Biasa   ██   20%
        😢 Sedih   █    10%
        😠 Marah   ██   20%
        😰 Cemas   █    10%
```

- Setiap **irisan** = jumlah catatan dengan mood tersebut dalam 7 hari terakhir
- **Semakin besar irisan** = semakin sering mood itu muncul
- **Legenda** di bawah grafik menampilkan emoji + nama mood
- Grafik **otomatis diperbarui** setiap kali Anda menyimpan, mengedit, atau menghapus catatan

### Tips interpretasi

- Jika irisan **😰 Cemas** atau **😢 Sedih** dominan selama seminggu, pertimbangkan untuk istirahat atau bicara dengan orang terdekat
- Gunakan grafik sebagai **refleksi**, bukan diagnosis medis
- Semakin rutin menulis, semakin akurat pola yang terlihat

---

## 6. Mencari Catatan

Di bagian bawah halaman terdapat kolom pencarian:

```
🔍 [ Cari catatan... ]
```

### Cara kerja

- Ketik kata kunci — pencarian **real-time** (langsung saat mengetik)
- Pencarian mencari di:
  - **Isi teks catatan** (tidak case-sensitive)
  - **Tanggal** (format `YYYY-MM-DD`)
- Catatan tetap diurutkan dari **terbaru ke terlama**
- Jika tidak ada hasil: *"Tidak ada hasil ditemukan."*
- Kosongkan kolom pencarian untuk menampilkan semua catatan kembali

### Contoh pencarian

| Kata kunci | Hasil |
|------------|-------|
| `presentasi` | Catatan yang mengandung kata "presentasi" |
| `2026-08` | Semua catatan di bulan Agustus 2026 |
| `senang` | Catatan yang teksnya mengandung "senang" |

---

## 7. Mengedit Catatan

Setiap catatan di daftar memiliki tombol **Edit**.

### Langkah-langkah

1. Scroll ke catatan yang ingin diubah
2. Klik tombol **Edit** di pojok kanan bawah kartu catatan
3. Form di atas akan **terisi otomatis** dengan data catatan tersebut
4. Ubah tanggal, mood, atau teks sesuai kebutuhan
5. Klik **Perbarui** untuk menyimpan perubahan
6. Klik **Batal** jika ingin membatalkan edit

### Perilaku saat edit

- Tombol **Simpan** berubah menjadi **Perbarui**
- Tombol **Batal** muncul di bawah tombol Perbarui
- Halaman otomatis **scroll ke form** agar mudah diedit
- Grafik mood ikut diperbarui setelah perubahan disimpan

---

## 8. Menghapus Catatan

Setiap catatan memiliki tombol **Hapus** (warna merah).

### Langkah-langkah

1. Klik tombol **Hapus** pada catatan yang diinginkan
2. Konfirmasi dengan klik **OK** pada dialog: *"Hapus catatan ini?"*
3. Catatan akan dihapus permanen dari penyimpanan
4. Grafik mood otomatis diperbarui

### Peringatan

> ⚠️ **Penghapusan bersifat permanen** dan tidak bisa dibatalkan. Pastikan Anda yakin sebelum menghapus.

---

## 9. Menginstal sebagai Aplikasi (PWA)

Aplikasi ini mendukung **Progressive Web App (PWA)**, sehingga bisa diinstal seperti aplikasi native.

### Android (Chrome)

1. Buka aplikasi di Chrome
2. Tap menu **⋮** (tiga titik)
3. Pilih **"Add to Home screen"** / **"Install app"**
4. Ikuti petunjuk — ikon 📓 akan muncul di layar utama

### iPhone / iPad (Safari)

1. Buka aplikasi di Safari
2. Tap tombol **Share** (kotak dengan panah)
3. Pilih **"Add to Home Screen"**
4. Beri nama, lalu tap **Add**

### Desktop (Chrome / Edge)

1. Buka aplikasi di browser
2. Klik ikon **Install** (⊕) di address bar
3. Klik **Install** pada dialog yang muncul

### Manfaat instalasi PWA

- Akses cepat dari layar utama / taskbar
- Tampilan fullscreen tanpa address bar browser
- Aset dasar di-cache — aplikasi tetap bisa dibuka **tanpa internet** *(catatan tetap dari localStorage)*

---

## 10. Pertanyaan Umum (FAQ)

### Q: Apakah data saya aman?

**A:** Data disimpan di **localStorage** browser Anda. Tidak ada server, tidak ada login, tidak ada data yang dikirim ke internet. Namun, siapa pun yang memiliki akses ke browser/perangkat Anda bisa melihat catatan.

---

### Q: Apakah catatan saya hilang jika browser ditutup?

**A:** **Tidak.** Data tetap tersimpan meskipun browser ditutup atau komputer dimatikan. Data hanya hilang jika Anda membersihkan data situs (Clear browsing data / Clear site data).

---

### Q: Bisakah saya menggunakan aplikasi di beberapa perangkat?

**A:** **Tidak secara otomatis.** Data tersimpan per perangkat & per browser. Untuk memindahkan data, Anda perlu mengekspor/mengimpor manual (fitur ini belum tersedia di versi saat ini).

---

### Q: Berapa banyak catatan yang bisa disimpan?

**A:** Tergantung batas **localStorage** browser (biasanya 5–10 MB). Untuk catatan teks biasa, kapasitas ini setara dengan **ribuan catatan**.

---

### Q: Grafik kosong padahal sudah ada catatan?

**A:** Grafik hanya menampilkan catatan dari **7 hari terakhir**. Catatan yang lebih lama dari 7 hari tidak dihitung dalam grafik, tetapi tetap muncul di daftar catatan.

---

### Q: Bisa menulis catatan untuk tanggal kemarin?

**A:** **Ya.** Ubah field **Tanggal** sebelum menyimpan. Berguna jika Anda lupa menulis kemarin dan ingin melengkapi catatan.

---

### Q: Aplikasi tidak bisa dibuka offline?

**A:** Pastikan Anda sudah membuka aplikasi **minimal sekali** saat online agar Service Worker bisa meng-cache file. Setelah itu, aplikasi bisa dibuka tanpa internet. Grafik Chart.js memerlukan koneksi internet saat pertama kali dimuat.

---

### Q: Bagaimana cara backup data?

**A:** Saat ini belum ada fitur export. Sebagai alternatif sementara:

1. Buka **DevTools** browser (F12)
2. Tab **Application** → **Local Storage**
3. Salin nilai kunci `journal_entries`
4. Simpan di file teks sebagai backup

---

## Ringkasan Cepat

| Aksi | Cara |
|------|------|
| Tulis catatan | Isi form → pilih mood → Simpan |
| Cari catatan | Ketik di kolom pencarian |
| Edit catatan | Klik **Edit** → ubah → **Perbarui** |
| Hapus catatan | Klik **Hapus** → konfirmasi OK |
| Lihat pola mood | Lihat grafik "Mood Minggu Ini" |
| Instal di HP | Add to Home Screen / Install app |

---

*Selamat menulis! Semoga jurnal ini membantu Anda lebih mengenal diri sendiri. 📓✨*
