# ADeEl - Advanced Digital Employee Log

**Smart Platform for Daily Work Activities, Performance Tracking, and Reporting.**

## 📋 Deskripsi

ADeEl (Advanced Digital Employee Log) adalah aplikasi web enterprise modern untuk mencatat aktivitas harian pegawai ASN, PPPK, maupun Non ASN, khususnya SDM Kesehatan di Dinas Kesehatan, Rumah Sakit, dan Puskesmas.

## 🚀 Fitur Utama

- **Dashboard** - Statistik real-time, grafik aktivitas, top performer
- **Aktivitas Harian** - Catat pekerjaan dengan CRUD lengkap, upload file, auto-save
- **Data Pegawai** - Manajemen pegawai, import/export Excel
- **Monitoring** - Pantau aktivitas per unit, profesi, periode
- **Penilaian Kinerja** - Hitung otomatis target, realisasi, skor, kategori
- **Laporan** - Harian, mingguan, bulanan, triwulan, semester, tahunan
- **Notifikasi** - Reminder, approval, komentar atasan
- **Dark Mode** - Tersedia light dan dark mode

## 💻 Teknologi

### Frontend
- HTML5, CSS3, Vanilla JavaScript ES6
- Bootstrap 5, Font Awesome, AOS Animation
- Chart.js, SweetAlert2, DataTables

### Backend
- Google Apps Script

### Database
- Google Spreadsheet

## 📁 Struktur Project

```
├── index.html          # Landing page
├── login.html          # Halaman login
├── dashboard.html      # Dashboard utama
├── activity.html       # Aktivitas harian
├── employee.html       # Data pegawai
├── report.html         # Laporan
├── setting.html        # Pengaturan
├── css/
│   └── style.css       # Stylesheet utama
├── js/
│   ├── config.js       # Konfigurasi (URL backend)
│   ├── app.js          # Core aplikasi
│   ├── login.js        # Login module
│   ├── dashboard.js    # Dashboard module
│   ├── activity.js     # Aktivitas module
│   ├── employee.js     # Pegawai module
│   ├── report.js       # Laporan module
│   └── setting.js      # Pengaturan module
├── assets/
│   ├── img/
│   ├── icon/
│   └── logo/
├── backend/
│   └── Code.gs         # Google Apps Script
└── README.md
```

## 🔧 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/adeel.git
cd adeel
```

### 2. Konfigurasi
Edit `js/config.js`:
```javascript
const CONFIG = {
    WEB_APP_URL: "YOUR_GOOGLE_APPS_SCRIPT_URL",
    SPREADSHEET_ID: "YOUR_GOOGLE_SPREADSHEET_ID",
    VERSION: "1.0.0"
};
```

### 3. Google Apps Script
1. Buka Google Spreadsheet
2. Extensions > Apps Script
3. Copy `backend/Code.gs` ke editor
4. Deploy sebagai Web App
5. Copy URL ke `config.js`

### 4. Jalankan
Buka `index.html` di browser, atau deploy ke hosting statis.

## 🔐 Akun Demo

| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | Admin |
| pimpinan | 123456 | Pimpinan |
| pegawai | 123456 | Pegawai |

## 📊 Google Sheet Structure

### Pegawai
id, nip, nik, nama, gelar, gender, profesi, unit, jabatan, status, role, email, hp, password, foto, createdAt, updatedAt

### Aktivitas
id, tanggal, jamMulai, jamSelesai, durasi, kategori, subKegiatan, deskripsi, lokasi, volume, satuan, target, realisasi, persentase, dokumentasi, lampiran, status, komentar, pegawaiNama, unit, profesi, createdAt, updatedAt

### MasterKategori, MasterUnit, MasterProfesi
id, nama, keterangan, createdAt

### Setting
key, value, updatedAt

### Log
id, nip, action, timestamp

## 🎨 UI/UX Features
- Glassmorphism design
- Responsive (Desktop, Tablet, Mobile)
- Dark/Light mode
- Smooth animations
- Skeleton loading
- Toast notifications
- Floating action button

## 📝 Lisensi
Hak Cipta © Dinas Kesehatan. All rights reserved.
