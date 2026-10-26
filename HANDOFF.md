# Handoff — Whitespace Solutions Website

Diperbarui **2026-10-22** dari sesi utama (`main`, commit terakhir `5f64522`). Baca file ini dulu sebelum mengerjakan
apa pun, lalu `design-reference/README.md` untuk aturan gaya dan daftar komponen lengkap.

## Ringkasan

Website company profile **Whitespace Solutions** (Jakarta). HTML + CSS + JavaScript murni, **tanpa build tool**.
Gaya visual meniru situs acuan https://whitespace-web-lilac.vercel.app/ (Next.js); **isi** mengikuti deck
*Company overview* Oktober 2026 (positioning AI-first), dengan konten lama yang masih relevan dipertahankan.

- Repo: https://github.com/goocel/Whitespace-website (public, branch `main`)
- Preview online (GitHub Pages dari `main`, 1–3 menit setelah push): https://goocel.github.io/Whitespace-website/
- Semua pekerjaan sudah di-commit & push, kecuali folder `reports/` (sengaja untracked, lihat bawah).
- Deck sumber isi: `D:\WS.pdf` (di luar repo, **jangan di-commit**). Read tool tidak bisa membuka PDF di mesin ini
  (pdftoppm tidak ada) → ambil teksnya dengan `pdfjs-dist` (legacy build, `getTextContent`) di scratchpad.
- User berkomunikasi dalam **Bahasa Indonesia**; jawab dalam Bahasa Indonesia (pernah sekali memberi brief berbahasa Inggris).
- Commit/push **hanya kalau user minta**. Identitas git: Kevin Prakasa / kevin.prakasa@gmail.com.
- Perubahan struktur (menu, halaman, section) **dikonfirmasi ke user dulu**; usulkan, jangan langsung kerjakan.

## Sesi & worktree

| Sesi | Folder | Branch | Preview lokal |
| --- | --- | --- | --- |
| 1 – main | `D:\Whitespace Web` | `main` | http://localhost:5500 |
| 2 | `D:\Whitespace Web-sesi-2` | `sesi-2` | http://localhost:5501 |
| 3 | `D:\Whitespace Web-sesi-3` | `sesi-3` | http://localhost:5502 |

- `sesi-2` / `sesi-3` belum dipakai dan **tertinggal jauh dari `main`**. Sebelum bekerja di sana: `git merge main`
  (atau buat ulang dari `main`). Ganti nama branch dengan `git branch -m`.
- Server preview kalau mati: `npx http-server@14.1.1 . -p <port> -c-1` dari folder sesi.
- Hanya `main` yang tampil di GitHub Pages. Merge branch sesi ke `main` dari folder utama.

## Navigasi & isi halaman

Menu (**final, jangan diubah tanpa ditanya**): **About · What we do ▾ · Careers · [Start a conversation]**.
Dropdown "What we do" = panel 2×2 berisi 3 pilar (kotak ketiga melebar). Tidak ada menu "Who we serve", tidak ganti nama ke
"Solutions". Deals & Growth dan Capital Management tetap praktik **di dalam** Business Transformation, bukan pilar.

| Halaman | Section (urut) — `[LABEL]` = label section |
| --- | --- |
| `index.html` Home | Hero 3D "Practical business transformation, now built around AI." (Start a conversation · How it works → `#how`) → `[THE PROBLEM]` "Most advice stops at the slide deck." (3 baris sebelum→sesudah) → `[THE SOLUTION]` "Three ways we help." (matrix 3 pilar) → `[HOW IT WORKS]` "Start small, prove it, then grow." (4 langkah + 1 contoh engagement Security services + grafik runway EBITDA beranimasi) → `[WHY WHITESPACE]` "Business sense and AI in one team." (tabel + kartu Practical/Applicable/Affordable) → CTA "Where is your whitespace?" |
| `about.html` | Hero 3D "We're not just consultants." (morph 28 kubus) → `[OUR COMMITMENTS]` "How we show up" (5) → `[WHO WE WORK WITH]` "Across industries" (13 industri deck dalam 6 grup) → CTA. Workflow 9 langkah dihapus; `about.html#workflow` tidak ada lagi |
| `practices/ai-implementation.html` | Hero 3D (`ai`) → `[CORE CAPABILITIES]` What we do (3) → `[HOW WE START]` "Our approach to AI: start with the problem." (5 langkah) → `[CASE STUDIES]` AI at work (3 kasus + 6 use case) → `[WORKING MODELS]` Three ways to work with us (3 diagram beranimasi) → CTA "Bring us one problem." |
| `practices/business-transformation.html` | Hero 3D (`turnaround`) → `[CORE CAPABILITIES]` What we do (4) → `[OUR PRACTICES]` Services `#services` (4 praktik) → `[TRACK RECORD]` Engagements (4 baris, satu per praktik) → CTA |
| `practices/fractional-leadership.html` | Hero 3D (`capital`) → `[CORE CAPABILITIES]` What we do (4) → `[CLIENT EXAMPLES]` What it looks like (2 alur klien) → CTA |
| `careers.html` | Hero 3D (`careers`, kubus oranye naik tangga) → Open roles (tanpa label, sengaja) → CTA "Don't see your role?" |
| `contact.html` | Form: Topic = 3 pilar + `repskill` + `sales-assessment`; field **Practice** muncul hanya untuk Business Transformation. Validasi dengan pesan terlihat; submit = `mailto:` (tanpa backend), pesan status jujur (tidak bilang terkirim); tanpa JS: `action="mailto:…"` |
| 4 file praktik lama | Redirect (`meta refresh`) ke `business-transformation.html#services`; slug lama di `?practice=` mengisi Topic BT + Practice |

- Footer semua halaman: What we do (3 pilar) · Firm (About · How it works → `index.html#how` · Careers · Contact) · Office.
- **Repskill & Sales Organization Assessment** sengaja tidak tampil di halaman (user: "terlalu sales"); hanya lewat Topic Contact.
- Case study AI **tetap di halaman AI** (keputusan user 22 Okt). Halaman "Case studies" sendiri baru masuk akal kalau sudah ada
  4–6 kasus nyata dengan hasil terukur dari ketiga pilar.
- Konten yang diturunkan dari halaman disimpan utuh di `design-reference/content-archive.md`.
- `reports/Perbandingan-Website-vs-Company-Overview.pdf` = analisis website vs deck — **jangan di-commit** (repo public).

## Struktur file

```
index.html, about.html, careers.html, contact.html
practices/<slug>.html        3 pilar (path pakai ../) + 4 file redirect lama
css/base.css                 token, tipografi, layout, tombol, header + dropdown, kanvas 3D (.iso-gl), CTA + footer
css/components.css           semua komponen konten (label section, grup industri, form error/status, dll.)
css/home.css                 khusus Home: hero (ukuran/posisi matrix), grafik runway, How it works
js/isometric.js              renderer kubus SVG + ILLUSTRATIONS; visibleOnly, withMotion; tiap kubus data-v="x,y,z" & data-tone
js/site.js                   nav, dropdown, render ilustrasi, reveal, highlight matrix
js/motion.js                 GSAP semua halaman: intro hero, kubus SVG, reveal, bar timeline, diagram model kerja (modelMotion)
js/iso-gl.js                 dasar 3D bersama: cek WebGL, muat three.js, kamera dipaskan ke viewBox SVG, lampu, ikut kursor, bleed
js/hero-3d.js                hero Home 3D (hover sel → caption) di atas SVG dari home.js
js/about-3d.js               hero About 3D: morph yang sama dengan about-morph.js (data dari window.AboutMorph)
js/page-hero-3d.js           hero 3D halaman pilar + Careers: ilustrasi & intro yang sama dari isometric.js
js/home.js                   hero matrix SVG Home (label sel, caption); dibagikan lewat window.HeroMatrix
js/home-motion.js            GSAP Home: intro hero, tilt SVG (hanya mode cadangan), grafik runway, reveal matrix
js/about-morph.js            morph SVG About: 28 kubus, 3 bentuk (HOLD 0.5s, MOVE 1.1s, START 2.4s); dipakai juga about-3d.js
js/contact.js                form: preselect Topic/Practice, validasi, mailto, pesan status
design-reference/            README (style guide + tabel komponen), styleguide.html, page-template.html, content-archive.md
```

## Keputusan & preferensi user (jangan diubah tanpa ditanya)

**Layout & gaya**
- `--gutter: clamp(16px, 4vw, 72px)`, `--container: 1760px`, jarak section `--section-space: clamp(48px, 6vw, 96px)`
  (minimum diturunkan dari 64px ke 48px atas permintaan user, supaya jarak antar section di HP tidak terlalu jauh; desktop tidak berubah).
- **Header = sama persis dengan acuan**: link menu 15px / tebal 550 / area klik 44px (padding 0 14px), tombol header 44px tinggi
  (padding 0 18px, 15px/550), logo tinggi 43px, header total 64px (termasuk garis 1px), tombol menu HP 44×44.
  Halaman aktif = garis bawah oranye (`aria-current="page"`; "What we do" di halaman pilar pakai `.is-current`).
  Panel menu HP selebar layar.
- **HP (≤900px): semua headline + sub-headline rata tengah** (label section, hero, kepala section, kotak CTA; tombol di bawahnya ikut).
  Desktop tetap rata kiri seperti semula — user minta hanya versi mobile yang berubah.
- CTA + footer = satu blok gelap. Judul section dipotong manual dengan `<br />`, huruf kecil biasa (bukan Title Case).
- Warna, font Archivo, skala tipografi, logo = sama dengan acuan. Sudut kotak **tidak membulat**; oranye hanya aksen.
- Tombol oranye: panel hitam menyapu dari kiri saat hover. CTA global = **"Start a conversation"**.
- Teks yang diketik di form = ukuran sama dengan label (`--step--1`).
- Hero Home: matrix `width: 170%; margin: -4% -76% -26% 6%` di desktop, `135%` di HP. Disetel user bertahap — jangan diubah.
- Tabel Why: judul kolom "Whitespace Solutions" tanpa blok oranye; kolomnya dibedakan sel oranye muda saja.

**Isi & teks**
- **Tidak boleh ada konten dobel dalam satu halaman** (kalimat/judul sama di dua section). Cek setiap menambah konten.
- **Label section** (`p.section-label`) di setiap section isi, kecuali hero & CTA (dan Open roles di Careers). Teks label ≠ judul.
- **Jangan pakai "pain point"** (user: jargon kaku) → pakai "problem" sesuai konteks ("Problem first, tool last.").
  Deck masih memakai "pain point"; itu disadari.
- Kutipan "If we owned this company…" sengaja tidak tampil di mana pun.
- **Jaga halaman ringkas.** Tinggi `main` di 1440px (21 Okt): Home ±5.700, About ±2.400, AI ±4.950, BT ±3.900, FL ±2.350.
- Angka "40+" cukup sekali per halaman. Jangan mengarang klaim, klien, angka atau hasil; ilustrasi diberi label "Illustrative".

**Ilustrasi** (`js/isometric.js` → `ILLUSTRATIONS`)
- Identik dengan acuan: `proactive`, `ownership`, `strategic`, `network`, `tailored`, `turnaround`, `productivity`,
  `deals`, `capital`, `about`, `careers`, `tower`. Buatan sendiri: `ai`, `fractional`, `deck`, `pre`/`engagement`/`partnership`, `night`.
- Hero Fractional Leadership sengaja pakai `capital` ("seperti di Vercel").
- Ukuran: hero & ikon kartu `data-pad="0.4"`; hero halaman dalam maks 460px rata kanan; ikon kartu 120px.

**Animasi & 3D**
- GSAP 3.12.5 + ScrollTrigger (cdnjs) di semua halaman. Tanpa GSAP / reduced motion → CSS / tampilan diam.
- **Semua hero kubus 3D** (Home, About, 3 pilar, Careers) dengan three.js 0.169.0 dari jsDelivr, dimuat lewat dynamic import
  (`js/iso-gl.js`) dan di-**preload** (`<link rel="modulepreload">` di `<head>` keenam halaman — URL harus sama dengan iso-gl.js).
- Cara kerjanya: kanvas `.iso-gl` menutup SVG persis, kamera orthographic dipaskan ke viewBox SVG → layout tidak berubah.
  SVG disembunyikan selama three.js dimuat (`[data-gl]`). Tanpa WebGL → SVG tampil. Reduced motion → bentuk akhir, diam.
- **Jangan tampilkan SVG dulu lalu ganti ke 3D** — user menolaknya ("tidak konsisten").
- Kubus 0.94 (bercelah), lampu Hemisphere 1.6 + Directional 2.2, kamera ikut kursor (yaw 0.12, pitch 0.05). Kubus oranye
  pakai warna sisi datar: atas oranye, kiri `#1a1a1a`, kanan `#999999`.
- Halaman pilar & Careers: kanvas **bleed 35%** supaya kubus yang masuk dari luar bingkai tetap tergambar; `.page-hero`
  diberi `overflow-x: clip` supaya tidak ada scroll ke samping.
- About morph: ketiga bentuk = **28 kubus yang semuanya terlihat** (`Isometric.visibleOnly`). Bentuk baru wajib dicek jumlah kubus
  terlihatnya sama. Jeda 0.5s (user minta lebih cepat), mulai 2.4s setelah intro.
- Caption hero Home di layar sentuh tanpa "Hover to read a cell".

## Jebakan teknis (sudah pernah kena)

- **Find-replace mengenai tempat yang salah.** Pola seperti `</article>\n        </div>\n      </div>\n    </section>` muncul di
  lebih dari satu section; replace pertama pernah menghapus `</div>` yang salah. Pastikan pola unik (hitung kemunculan dulu)
  dan **cek keseimbangan tag** (`<div>` buka vs tutup) setelah edit HTML. Browser menoleransi HTML rusak, jadi tes visual tidak menangkapnya.
- **GSAP `fromTo` merender titik awal saat timeline dibuat** (`immediateRender`). Di loop morph 3D, tween terakhir (bentuk 3 → 1)
  langsung memindahkan semua kubus ke bentuk 3. Pakai `immediateRender: false` untuk tween yang belum boleh tampil.
- **three.js InstancedMesh menyimpan bounding sphere lama** → raycast hover gagal. Set `mesh.boundingSphere = null` tiap kali
  matriks instance berubah.
- **Urutan gambar kubus SVG**: kubus yang bergerak digambar menurut posisi terdekat antara awal & akhir; kubus yang jatuh dari
  atas ke samping kubus lain bisa menutupi tetangganya. Untuk ilustrasi padat: gerak menyamping / dari bawah / fade di tempat.
- **GSAP membulatkan `stroke-dashoffset`** → garis `pathLength="1"` meloncat. Tulis nilainya lewat proxy + `onUpdate` (`draw()` di home-motion.js).
- **Header & footer ditulis ulang di setiap halaman** (7 halaman + `design-reference/page-template.html`). Ubah semuanya.
- Semua path **relatif** (situs jalan di sub-folder `/Whitespace-website/`). Tiap halaman wajib
  `<script>document.documentElement.classList.add("js");</script>` di `<head>`.
- `why-table`: setiap `td` wajib `data-label` (di HP jadi kartu). `.field` punya `display:flex` → atribut `hidden` butuh `.field[hidden]`.

## Cara verifikasi di browser (penting)

- **Python tidak terpasang.** Pakai Node / Edit tool. `node -e '…'` di bash gagal kalau isinya mengandung apostrof atau regex
  rumit → tulis skrip ke file (Write tool) lalu jalankan dengan `node file.js`.
- `puppeteer.launch()` gagal dengan Edge. Cara yang jalan (PowerShell, `dangerouslyDisableSandbox`):
  1. `Start-Process msedge.exe -ArgumentList "--headless","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\edgeprobe2","about:blank"`
  2. Node: `puppeteer.connect({ browserURL: "http://127.0.0.1:9333" })` (pasang `puppeteer-core@22.15.0` di scratchpad sesi baru).
  3. Setelah selesai, matikan proses Edge yang command line-nya mengandung `edgeprobe2`.
- Headless Edge default **reduced motion** → `page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }])`.
  WebGL tersedia di headless Edge (3D bisa dites). `(pointer: fine)` dan `(hover: hover)` false di headless → override `matchMedia` untuk tes hover.
- `--virtual-time-budget` membekukan GSAP — rekam frame dengan waktu nyata. Untuk intro, mulai rekam saat `[data-gl="on"]` muncul.
- **Klik puppeteer + smooth scroll / reveal GSAP** = klik meleset (elemen belum terlihat). Matikan `scroll-behavior`, scroll ke
  elemen, tunggu reveal, baru klik — atau pakai `form.requestSubmit()`.
- `mailto:` dari form bisa ditangkap lewat CDP `Page.frameRequestedNavigation` (tidak bisa lewat override `location.href`).
- Simulasi GitHub Pages: salin file ke `<scratch>/ghp/Whitespace-website/` dan layani foldernya di port lain.
- Cek rutin: error console, request gagal, elemen masih `opacity < 1` setelah scroll penuh, scroll horizontal di 390px,
  link & anchor internal, ID dobel, satu `h1` per halaman, keseimbangan tag.

## Belum dikerjakan / terbuka

1. **Email karier — HOLD**: tombol Careers ("Apply", "Email us") masih ke `contact@whitespace.id`. Tunggu alamat dari user;
   setelah ada: ganti alamatnya, pertimbangkan isi email yang sudah terisi dan alamat sebagai teks cadangan.
2. **Form kontak — HOLD**: masih `mailto:` tanpa backend. User menunggu keputusan email/endpoint penerima. Usulan yang sudah
   disampaikan: Formspree (gratis ±50/bulan, hanya ID form di HTML), alternatif Web3Forms (±250/bulan). Setelah ada: ubah
   `js/contact.js` ke `fetch`, status terkirim/gagal yang jujur, `mailto:` tetap sebagai cadangan tanpa JS. Jangan taruh kunci rahasia di front-end.
3. Nomor telepon `021-39731400` (sama dengan acuan) belum dikonfirmasi user.
4. Ikon Fractional di matrix Home (`fractional`) beda dengan hero-nya (`capital`) — user belum memutuskan.
5. Ilustrasi `deck`, ikon fase proses (`pre`/`engagement`/`partnership`) dan `night` belum sama dengan acuan. Kubus di luar hero
   (ikon kartu, blok CTA gelap) masih SVG.
6. ~~Daftar industri situs beda dengan deck~~ — selesai: About memakai 13 industri deck (6 grup). Engagement di BT
   dan contoh Home masih menyebut sektor klien lama (Consumer electronics, Metaverse, dll.) — itu catatan proyek, bukan daftar industri.
7. Branch `sesi-2` / `sesi-3` perlu di-merge dari `main` sebelum dipakai.
8. Belum dites di Safari, Firefox dan perangkat fisik (hanya headless Edge).
