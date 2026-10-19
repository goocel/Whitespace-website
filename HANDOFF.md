# Handoff — Whitespace Solutions Website

Dibuat 2026-10-19 dari sesi utama (`main`). Baca file ini dulu sebelum mengerjakan apa pun,
lalu baca `design-reference/README.md` untuk aturan gaya lengkapnya.

## Ringkasan

Website company profile **Whitespace Solutions** (firma advisory middle-market, Jakarta).
HTML + CSS + JavaScript murni, **tanpa build tool**. Meniru situs acuan
https://whitespace-web-lilac.vercel.app/ (Next.js), dengan beberapa penyesuaian sesuai arahan user.

- Repo: https://github.com/goocel/Whitespace-website (public, branch `main`)
- Preview online (GitHub Pages, otomatis dari `main`, 1–3 menit setelah push):
  https://goocel.github.io/Whitespace-website/
- Commit terakhir saat handoff: `16cd4b7` (semua pekerjaan sudah di-commit & push)
- User berkomunikasi dalam **Bahasa Indonesia**.

## Sesi & worktree

| Sesi | Folder | Branch | Preview lokal |
| --- | --- | --- | --- |
| 1 – main | `D:\Whitespace Web` | `main` | http://localhost:5500 |
| 2 | `D:\Whitespace Web-sesi-2` | `sesi-2` | http://localhost:5501 |
| 3 | `D:\Whitespace Web-sesi-3` | `sesi-3` | http://localhost:5502 |

- Nama `sesi-2` / `sesi-3` hanya sementara; user akan menentukan tugasnya. Ganti dengan `git branch -m`.
- Server preview dijalankan dari sesi utama; kalau mati, jalankan ulang dari folder sesi:
  `npx http-server@14.1.1 . -p <port> -c-1`
- Hanya `main` yang tampil di GitHub Pages. Merge branch sesi ke `main` dari folder utama.
- Commit/push **hanya kalau user minta**. Identitas git repo ini: Kevin Prakasa / kevin.prakasa@gmail.com
  (nama ditebak dari email; ganti kalau user koreksi).

## Struktur

```
index.html, about.html, careers.html, contact.html
practices/<slug>.html        4 halaman praktik (path pakai ../)
css/base.css                 token, tipografi, layout, tombol, header, CTA + footer
css/components.css           semua komponen konten
css/home.css                 khusus Home (+ aturan GSAP grafik runway)
js/isometric.js              renderer kubus isometrik + ILLUSTRATIONS
js/site.js                   nav, dropdown, render ilustrasi, reveal, highlight matrix
js/home.js                   hero matrix interaktif (hover cell)
js/motion.js                 animasi GSAP semua halaman (intro hero, kubus, reveal, bar timeline)
js/home-motion.js            animasi GSAP khusus Home (hero, tilt ikut kursor, grafik runway)
js/contact.js                form kontak → mailto, ?practice=<slug> mengisi Topic
assets/images/brand/         logo.svg, logo-white.svg (asli dari situs acuan)
design-reference/            README (style guide tertulis), styleguide.html, page-template.html
```

## Keputusan & preferensi user (jangan diubah tanpa ditanya)

- **Lebar**: `--gutter: clamp(16px, 4vw, 72px)`, `--container: 1760px` (situs acuan 48px/1360px — sengaja beda).
- **Jarak section**: `--section-space: clamp(72px, 8vw, 120px)` → maks 240px antar section (acuan 320px, sengaja dirapatkan).
  `--head-space: clamp(48px, 6vw, 80px)` judul section → isi.
- **CTA + footer = satu blok gelap**, tanpa baris Office/Phone/Email terpisah (acuan punya dua bagian).
- **Hero halaman dalam rata tengah vertikal** (acuan rata bawah; user tidak suka ruang kosong di atas judul).
- **Judul section** dipotong manual dengan `<br />` agar sama dengan desain.
- **Kubus**: garis antar-kubus tipis & samar (stroke = warna sisi digelapkan 8%, konstanta `SEAM`), bukan putih.
- **Warna, font (Archivo), skala tipografi, logo** = sama persis dengan situs acuan.
- **Ukuran ilustrasi** = sama persis dengan acuan: semua hero & ikon kartu pakai `data-pad="0.4"`;
  hero halaman dalam maks 460px rata kanan; ikon kartu 120px; menara Contact 150px.
- **Tombol**: oranye → panel hitam menyapu dari kiri saat hover (putih di blok gelap); tombol header → oranye.
- **Kartu nilai**: hover latar `--panel` → `--cell`.
- **GSAP 3.12.5 + ScrollTrigger di semua halaman** (CDN cdnjs): `motion.js` di semua halaman, `home-motion.js` tambahan di Home.
  Kalau GSAP gagal dimuat / reduced motion → otomatis kembali ke CSS.

## Ilustrasi kubus (`js/isometric.js` → `ILLUSTRATIONS`)

Sudah **identik dengan situs acuan** (bentuk + gerakan, disalin dari kode/HTML acuan):
`proactive`, `ownership`, `strategic`, `network`, `tailored`, `turnaround`, `productivity`,
`deals`, `capital`, `about`, `careers`, `tower`.

Masih **buatan sendiri** (belum sama dengan acuan): `deck` (Home "We don't hand over a deck"),
`pre` / `engagement` / `partnership` (ikon fase proses), `night` (blok CTA gelap), hero matrix Home.

Cara menyalin dari acuan: ambil HTML halaman acuan, setiap kubus adalah
`<g class="c c-{tone}" style="--ax;--ay;--bx;--by;--bo;--d">` dengan skala 40/unit:
`x−y = ax / (cos30°·40)`, `x+y−2z = ay / 20`. Tone acuan → lokal: stone→light, ink→dark,
signal→orange, paper→paper, night→night. Kubus yang diam ditandai `still([...])`.
Resep generator asli ada di chunk JS acuan `/_next/static/immutable/chunks/2iurel4j9kqrz.js`.

## Hal yang perlu diketahui

- **Header & footer ditulis ulang di setiap halaman** (8 HTML + `design-reference/page-template.html`).
  Perubahan menu/footer harus diterapkan ke semua file itu. Generator yang dulu dipakai sudah tidak tersedia.
- Semua path harus **relatif** (situs berjalan di sub-folder `/Whitespace-website/` di GitHub Pages).
- Setiap halaman wajib `<script>document.documentElement.classList.add("js");</script>` di `<head>`.
- Verifikasi visual: headless Edge `--virtual-time-budget` **membekukan GSAP/ScrollTrigger** — hasilnya menyesatkan.
  Pakai Puppeteer (`puppeteer-core` + Edge di `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`)
  dengan waktu nyata dan scroll sungguhan.

## Belum dikerjakan / terbuka

1. Samakan ilustrasi `deck`, ikon fase proses, dan `night` dengan acuan (user sudah ditawari).
2. Hero 3D three.js seperti acuan (saat ini SVG + tilt GSAP mengikuti kursor; parallax per kubus dicoba & dibatalkan karena muncul celah).
3. ~~GSAP untuk halaman selain Home~~ — sudah diterapkan (`js/motion.js`).
4. Tampilan HP 390px belum diverifikasi penuh (headless Edge minimum ±500px; cek dengan Puppeteer viewport 390).
5. Nomor telepon `021-39731400` terbaca samar dari screenshot desain — sama dengan situs acuan, belum dikonfirmasi user.
6. Dua jarak di dalam section Home masih 120px (teks "We don't hand…" → kartu; grafik → tabel) — bisa dirapatkan kalau user minta.
