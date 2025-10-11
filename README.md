# Stalking Tiktok CLI

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

## Catatan

- Data Short ID bisa saja kosong jika TikTok tidak menampilkan field tersebut untuk user tertentu.
- Region juga bisa kosong jika tidak tersedia di data publik TikTok.
- Untuk keluar dari mode interaktif, ketik `exit` atau pilih `n` saat ditanya "Lanjut stalk user lain?".

## Lisensi

Bebas digunakan untuk pembelajaran dan non-komersial.


