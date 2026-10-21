# Handoff — Whitespace Solutions Website

Diperbarui **2026-10-21** dari sesi utama (`main`). Baca file ini dulu sebelum mengerjakan apa pun,
lalu `design-reference/README.md` untuk aturan gaya dan daftar komponen lengkap.

## Ringkasan

Website company profile **Whitespace Solutions** (Jakarta). HTML + CSS + JavaScript murni, **tanpa build tool**.
Gaya visual meniru situs acuan https://whitespace-web-lilac.vercel.app/ (Next.js); **isi** mengikuti deck
*Company overview* Oktober 2026 (positioning AI-first), dengan konten lama yang masih relevan dipertahankan.

- Repo: https://github.com/goocel/Whitespace-website (public, branch `main`)
- Preview online (GitHub Pages dari `main`, 1–3 menit setelah push): https://goocel.github.io/Whitespace-website/
- Commit terakhir: `7bfc647` — semua pekerjaan sudah di-commit & push, kecuali folder `reports/` (lihat bawah).
- User berkomunikasi dalam **Bahasa Indonesia**; jawab dalam Bahasa Indonesia.
- Commit/push **hanya kalau user minta**. Identitas git: Kevin Prakasa / kevin.prakasa@gmail.com.

## Sesi & worktree

| Sesi | Folder | Branch | Preview lokal |
| --- | --- | --- | --- |
| 1 – main | `D:\Whitespace Web` | `main` | http://localhost:5500 |
| 2 | `D:\Whitespace Web-sesi-2` | `sesi-2` | http://localhost:5501 |
| 3 | `D:\Whitespace Web-sesi-3` | `sesi-3` | http://localhost:5502 |

- `sesi-2` / `sesi-3` belum dipakai dan **tertinggal jauh dari `main`** (dibuat sebelum repositioning).
  Sebelum bekerja di sana: `git merge main` (atau buat ulang dari `main`). Ganti nama dengan `git branch -m`.
- Server preview kalau mati: `npx http-server@14.1.1 . -p <port> -c-1` dari folder sesi.
- Hanya `main` yang tampil di GitHub Pages. Merge branch sesi ke `main` dari folder utama.

## Positioning & isi halaman (Okt 2026)

Menu: **About · What we do ▾ · Careers · [Start a conversation]**. Dropdown "What we do" = panel 2×2 (kotak ketiga melebar).

| Halaman | Section (urut) |
| --- | --- |
| `index.html` Home | Hero "Practical business transformation, now built around AI." (matrix kubus besar, terpotong kanan/bawah) → "We solve problems the way a founder would" (40+, Practical/Applicable/Affordable, pull quote) → "Three ways we help" (matrix 3 pilar, 12 cell/pilar) → "What the work looks like" (4 alur klien + grafik runway EBITDA) → "Why Whitespace" (tabel vs konsultan & vendor) → CTA |
| `about.html` | Hero "We're not just consultants." (kubus **berubah bentuk 3× berulang**) → "Most advice stops at the slide deck" (sebelum→sesudah) → "How we show up" (5 komitmen) → "Our workflow" 9 langkah (`#workflow`) → "Across industries" (18 industri + ikon garis) |
| `practices/ai-implementation.html` | Hero (ilustrasi `ai`) → What we do (3) → Our approach to AI (5 langkah) → AI at work (IT diagnostic, Invoice OCR, Tender engine + 6 contoh use case) → Three ways to work with us (3 model) |
| `practices/business-transformation.html` | Hero (`turnaround`) → What we do (4) → Services (4 praktik lama sebagai grup: Turnaround, Org productivity, Deals & growth, Capital management) → Engagements (7 baris) |
| `practices/fractional-leadership.html` | Hero (`capital`) → What we do (4) → What it looks like (2 alur klien) |
| `careers.html` | Tidak berubah isinya |
| `contact.html` | Topic: 3 pilar + `repskill` + `sales-assessment`. Slug praktik lama dipetakan ke `business-transformation` di `js/contact.js` |
| 4 file praktik lama | Hanya redirect (`meta refresh`) ke `business-transformation.html#services` |

- **Repskill & Sales Organization Assessment** sengaja **tidak tampil** di halaman mana pun (user: "terlalu sales");
  hanya bisa diminta lewat Topic di Contact. Komponen kartunya masih ada di styleguide.
- Analisis website vs deck: `reports/Perbandingan-Website-vs-Company-Overview.pdf` — **jangan di-commit** (repo public).
  Folder `reports/` sengaja dibiarkan untracked.

## Struktur file

```
index.html, about.html, careers.html, contact.html
practices/<slug>.html        3 pilar (path pakai ../) + 4 file redirect lama
css/base.css                 token, tipografi, layout, tombol, header + dropdown, CTA + footer, .sr-only
css/components.css           semua komponen konten (termasuk komponen positioning baru)
css/home.css                 khusus Home: hero (ukuran/posisi matrix), aturan GSAP grafik
js/isometric.js              renderer kubus + ILLUSTRATIONS; tiap kubus diberi data-v="x,y,z" & data-tone
js/site.js                   nav, dropdown, render ilustrasi, reveal, highlight matrix
js/motion.js                 GSAP semua halaman: intro hero, kubus, reveal, bar timeline
js/home.js                   hero matrix interaktif (hover cell, label sel)
js/home-motion.js            GSAP Home: intro hero, tilt ikut kursor, grafik runway (titik naik menyusuri kurva)
js/about-morph.js            hero About: 44 kubus berubah 3 bentuk berulang (konstanta HOLD/MOVE/LIFT/RIPPLE)
js/contact.js                form → mailto; ?practice=<slug> mengisi Topic
design-reference/            README (style guide + tabel komponen), styleguide.html, page-template.html
```

## Keputusan & preferensi user (jangan diubah tanpa ditanya)

**Layout & gaya**
- Lebar `--gutter: clamp(16px, 4vw, 72px)`, `--container: 1760px`; jarak section `clamp(72px, 8vw, 120px)` (sengaja beda dari acuan).
- CTA + footer = satu blok gelap. Hero halaman dalam rata tengah vertikal. Judul section dipotong manual dengan `<br />`,
  huruf kecil biasa (mis. "How we<br /> show up", bukan Title Case).
- Warna, font Archivo, skala tipografi, logo = sama dengan acuan. Sudut kotak **tidak membulat**; oranye hanya aksen.
- Tombol oranye: panel hitam menyapu dari kiri saat hover. CTA hero Home = "Start a conversation".
- Teks yang diketik di form = **ukuran sama dengan label** (`--step--1`).
- Hero Home: matrix `width: 170%; margin: -4% -76% -26% 6%` di desktop (besar, terpotong kanan & bawah, ada jarak dari headline);
  di HP `width: 135%`, terpotong kanan saja. User menyetel ini bertahap — ubah hanya kalau diminta.

**Isi**
- **Tidak boleh ada konten dobel dalam satu halaman** (kalimat/judul yang sama di dua section). Cek ini setiap menambah konten.
- **Jaga halaman tetap ringkas.** Home ±6.600px, AI ±5.000px, BT ±4.300px, FL ±2.400px (tinggi `main` di 1440px).
  Sebelum menambah section, pertimbangkan memindah/menggabung.
- Angka "40+" cukup **sekali** per halaman.

**Ilustrasi** (`js/isometric.js` → `ILLUSTRATIONS`)
- Identik dengan acuan: `proactive`, `ownership`, `strategic`, `network`, `tailored`, `turnaround`, `productivity`,
  `deals`, `capital`, `about`, `careers`, `tower`.
- Buatan sendiri: `ai` (tumpukan bisnis ditembus inti oranye — hero AI & ikon matrix Home), `fractional`
  (kubus oranye di kursi depan atas — ikon matrix Home), `deck`, `pre`/`engagement`/`partnership`, `night`, hero matrix Home.
- Hero Fractional Leadership sengaja pakai `capital` (permintaan user, "seperti di Vercel").
- Ukuran: hero & ikon kartu `data-pad="0.4"`; hero halaman dalam maks 460px rata kanan; ikon kartu 120px.

**Animasi**
- GSAP 3.12.5 + ScrollTrigger (CDN cdnjs) di semua halaman. Tanpa GSAP / reduced motion → animasi CSS / tampilan diam.

## Jebakan teknis (sudah pernah kena)

- **Urutan gambar kubus**: kubus yang bergerak digambar menurut posisi *terdekat* antara awal & akhir. Kubus yang
  **jatuh dari atas** ke samping kubus lain digambar belakangan dan menutupi tetangganya. Untuk ilustrasi padat:
  gerak menyamping / dari bawah / fade di tempat (lihat `ai`, `fractional`).
- **GSAP membulatkan `stroke-dashoffset` ke px bulat** → garis `pathLength="1"` meloncat 1→0. Tulis nilainya sendiri
  lewat objek proxy + `onUpdate` (lihat `draw()` di `js/home-motion.js`).
- **Header & footer ditulis ulang di setiap halaman** (7 halaman + `design-reference/page-template.html`; 4 redirect tidak punya header).
  Perubahan menu/footer harus diterapkan ke semua.
- Semua path **relatif** (situs jalan di sub-folder `/Whitespace-website/`). Tiap halaman wajib
  `<script>document.documentElement.classList.add("js");</script>` di `<head>`.
- Komponen tabel `why-table`: setiap `td` wajib `data-label` (di HP tabel jadi kartu).

## Cara verifikasi di browser (penting)

- **Python tidak terpasang.** Pakai Node / perl / Edit tool. Heredoc bash yang berisi apostrof (`don't`) sering gagal —
  tulis file dengan Write tool saja.
- `puppeteer.launch()` **gagal** dengan Edge di mesin ini. Cara yang jalan (PowerShell, perlu `dangerouslyDisableSandbox`):
  1. `Start-Process msedge.exe --headless --remote-debugging-port=9333 --user-data-dir=$env:TEMP\edgeprobe2 about:blank`
  2. Script Node: `puppeteer.connect({ browserURL: "http://127.0.0.1:9333" })` (puppeteer-core 22.15.0 terpasang di scratchpad sesi lama; pasang ulang di scratchpad baru kalau perlu)
  3. Setelah selesai, matikan proses Edge yang command line-nya mengandung `edgeprobe2`.
- Headless Edge default **prefers-reduced-motion: reduce** → GSAP tidak jalan. Untuk tes animasi:
  `page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])`.
- `--virtual-time-budget` membekukan GSAP — jangan dipakai untuk tes animasi. Rekam frame dengan waktu nyata.
- Screenshot per elemen: sembunyikan header sticky dulu (`.header{display:none}`) supaya tidak menutupi.
- Cek rutin: error JS, elemen yang masih `opacity < 1` setelah scroll penuh, scroll horizontal di 390px, link internal rusak.

## Belum dikerjakan / terbuka

1. Ilustrasi `deck`, ikon fase proses (`pre`/`engagement`/`partnership`), dan `night` belum sama dengan acuan.
2. Hero 3D three.js seperti acuan (saat ini SVG + tilt GSAP; parallax per kubus pernah dicoba & dibatalkan karena celah).
3. Nomor telepon `021-39731400` (sama dengan acuan) belum dikonfirmasi user.
4. Ikon Fractional di matrix Home (`fractional`) beda dengan hero-nya (`capital`) — user belum memutuskan perlu disamakan atau tidak.
5. Branch `sesi-2` / `sesi-3` perlu di-merge dari `main` sebelum dipakai.
