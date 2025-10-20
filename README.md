# TikTok Stalk CLI v2.0.0

Aplikasi CLI canggih untuk mengambil informasi publik pengguna TikTok dengan fitur export, batch stalk, analytics, dan history management.

## ✨ Fitur Baru v2.0.0

- **Export Data**: Export hasil stalk ke format JSON dan CSV
- **Download Avatar**: Download avatar user secara otomatis
- **Batch Stalk**: Stalk multiple users sekaligus
- **History Management**: Simpan dan lihat history stalk otomatis
- **Analytics**: Analisis statistik dan perbandingan user
- **Loading Animation**: Animasi loading yang menarik
- **Menu Interaktif**: Interface yang lebih user-friendly
- **Command Line Options**: Dukungan berbagai opsi command line

## 🚀 Fitur Utama

- Mendapatkan informasi user TikTok (ID, Short ID, Unique ID, Nickname, Signature, dll)
- Menampilkan statistik akun (followers, following, likes, video count, dll)
- Warna output yang menarik di terminal
- Bisa digunakan interaktif maupun langsung via argumen
- Rate limiting untuk menghindari blokir
- Random IP untuk anonimitas

## Instalasi

1. **Pastikan Node.js sudah terinstall.**  
   Download di [nodejs.org](https://nodejs.org/) jika belum ada.

2. **Clone atau download repository ini.**

3. **Install dependency:**
   ```bash
   npm install axios
   ```

## 📖 Cara Penggunaan

### 1. Mode Interaktif (Menu Utama)

Jalankan perintah berikut di terminal:

```bash
node ttstalk.js
```

Menu interaktif akan menampilkan:

- Stalk Single User
- Batch Stalk Multiple Users
- Lihat History
- Analytics dari History
- Exit

### 2. Mode Command Line

#### Stalk Single User

```bash
node ttstalk.js username_tiktok
```

#### Batch Stalk Multiple Users

```bash
node ttstalk.js --batch user1,user2,user3
```

#### Lihat History

```bash
node ttstalk.js --history
```

#### Bantuan

```bash
node ttstalk.js --help
```

#### Versi

```bash
node ttstalk.js --version
```

### 3. Fitur Export Data

Setelah stalk user, Anda akan mendapat opsi:

- Export ke JSON
- Export ke CSV
- Download Avatar
- Skip

### 4. Fitur Batch Stalk

- Masukkan multiple username dipisahkan koma
- Otomatis delay 2 detik antar request
- Tampilkan ringkasan hasil
- Analytics perbandingan
- Export batch data

### 5. Fitur History & Analytics

- History otomatis tersimpan (max 100 entri)
- Lihat history stalk sebelumnya
- Analytics statistik dari history
- Export analytics ke JSON

## 📊 Contoh Output

### Menu Utama

```
==================================================
Tiktok Stalk CLI - Tiktok Stalk CLI
==================================================
[MAIN MENU] Pilih mode:
1. Stalk Single User
2. Batch Stalk Multiple Users
3. Lihat History
4. Analytics dari History
5. Exit
```

### Hasil Stalk

```
==================================================
Tiktok Stalk CLI - Hasil Stalk
==================================================
Mencari data untuk: XXXXX
⠋ Mengambil data user...
==================================================
ID: 123456789
Short ID: 987654321
Unique ID: XXXXX
Nickname: XXXXX
Signature: Welcome to my profile!
Verified: Tidak
Private Account: Tidak
Region: undefined
Language: en
SecUid: XXXXXXXXXXXXX
Avatar Larger: https://...
Avatar Medium: https://...
Avatar Thumb: https://...
Create Time: 1/1/2020, 12:00:00 PM
==================================================
Stats:
Follower Count: 10000
Following Count: 100
Heart: 50000
Heart Count: 50000
Video Count: 50
Digg Count: 200
Friend Count: 10
==================================================

[OPTIONS] Pilihan tambahan:
1. Export ke JSON
2. Export ke CSV
3. Download Avatar
4. Skip (tidak ada aksi)
```

### Batch Stalk Results

```
==================================================
Tiktok Stalk CLI - Batch Stalk Results
==================================================
[INFO] Memulai batch stalk untuk 3 users...
[1/3] Stalking: user1
[2/3] Stalking: user2
[3/3] Stalking: user3

[SUCCESS] Berhasil stalk 3 dari 3 users

1. user1 (@User One)
   Followers: 10,000
   Following: 500
   Videos: 50

2. user2 (@User Two)
   Followers: 25,000
   Following: 200
   Videos: 100

[ANALYTICS] Analisis Data:
==================================================
Total Users: 3
Total Followers: 35,000
Total Following: 700
Total Videos: 150
Verified Users: 1/3 (33.3%)

Top User (Followers): user2 (25,000 followers)
```

## 📁 File Output

Program akan membuat file-file berikut:

- `tiktok_stalk_history.json` - History stalk otomatis
- `tiktok_data_*.json` - Export data individual
- `tiktok_data_*.csv` - Export data CSV
- `batch_tiktok_data_*.json` - Export batch data
- `analytics_*.json` - Export analytics
- `./avatars/` - Folder avatar downloads

## ⚠️ Catatan Penting

- Data Short ID bisa saja kosong jika TikTok tidak menampilkan field tersebut untuk user tertentu
- Region juga bisa kosong jika tidak tersedia di data publik TikTok
- Program menggunakan delay 2 detik untuk batch stalk untuk menghindari rate limit
- History dibatasi maksimal 100 entri (FIFO)
- Avatar akan didownload ke folder `./avatars/`
- Gunakan `exit` atau pilih `n` untuk keluar dari mode interaktif

## 🔧 Troubleshooting

- Jika mendapat error 403/404, coba gunakan username yang berbeda
- Pastikan koneksi internet stabil
- Untuk batch stalk, jangan masukkan terlalu banyak username sekaligus
- Jika avatar gagal didownload, cek koneksi internet

## 📄 Lisensi

Bebas digunakan untuk pembelajaran dan non-komersial.
