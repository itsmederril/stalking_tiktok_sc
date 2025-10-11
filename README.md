# Tiktok Stalk CLI

Aplikasi CLI sederhana untuk menampilkan detail profil pengguna TikTok berdasarkan username.

## Fitur

- Mendapatkan informasi user TikTok (ID, Short ID, Unique ID, Nickname, Signature, dll)
- Menampilkan statistik akun (followers, following, likes, video count, dll)
- Warna output yang menarik di terminal
- Bisa digunakan interaktif maupun langsung via argumen

## Instalasi

1. **Pastikan Node.js sudah terinstall.**  
   Download di [nodejs.org](https://nodejs.org/) jika belum ada.

2. **Clone atau download repository ini.**

3. **Install dependency:**
   ```bash
   npm install axios
   ```

## Cara Penggunaan

### Mode Interaktif

Jalankan perintah berikut di terminal:

```bash
node ttstalk.js
```

Masukkan username TikTok (tanpa @) saat diminta.

### Mode Argumen

Langsung stalk user dengan argumen username:

```bash
node ttstalk.js username_tiktok
```

Ganti `username_tiktok` dengan username yang ingin dicari.

## Contoh Output

```
==================================================
Tiktok Stalk CLI - Hasil Stalk
==================================================
Mencari data untuk: XXXXX
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
```

## Catatan

- Data Short ID bisa saja kosong jika TikTok tidak menampilkan field tersebut untuk user tertentu.
- Region juga bisa kosong jika tidak tersedia di data publik TikTok.
- Untuk keluar dari mode interaktif, ketik `exit` atau pilih `n` saat ditanya "Lanjut stalk user lain?".

## Lisensi

Bebas digunakan untuk pembelajaran dan non-komersial.
