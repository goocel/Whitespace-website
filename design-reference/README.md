# Design Reference — Whitespace Solutions

Halaman **Home** (`/index.html`) adalah acuan gaya untuk semua halaman lain.
Warna, font, skala tipografi, dan logo mengikuti situs asli: https://whitespace-web-lilac.vercel.app/

| File | Isi |
| --- | --- |
| `styleguide.html` | Katalog visual: warna, layout, tipografi, tombol, ilustrasi isometrik, dan komponen (buka di browser) |
| `page-template.html` | Kerangka halaman baru (header, contoh section, CTA, footer). Salin ke root lalu ganti isinya |
| `screenshots/home/` | Tempat menyimpan screenshot desain Home dari desainer sebagai pembanding |

## Halaman

| File | Halaman |
| --- | --- |
| `index.html` | Home: hero 3D, The problem (Most advice stops at the slide deck), The solution (Three ways we help), How it works (Start small, prove it, then grow), Why Whitespace (Business sense and AI in one team), CTA |
| `about.html` | About: hero 3D (morph 28 kubus), Our commitments (How we show up), Who we work with (Across industries: 13 industri deck dalam 6 grup), CTA |
| `careers.html` | Careers: hero, Open roles |
| `contact.html` | Contact: detail kantor + form (validasi terlihat; membuka aplikasi email; `?practice=<slug>` mengisi Topic, slug praktik lama juga mengisi Practice) |
| `practices/<slug>.html` | 3 halaman pilar (menu "What we do"): hero, What we do, lalu section khusus pilar, Next |

Slug pilar: `ai-implementation`, `business-transformation`, `fractional-leadership`.
Topic tambahan di form Contact: `repskill`, `sales-assessment`.
Empat file praktik lama (`turnaround-transformation`, `organizational-productivity`, `deals-growth`, `capital-management-advisory`)
hanya berisi redirect ke `business-transformation.html#services`; `js/contact.js` memetakan slug lama ke `business-transformation`.
Halaman di folder `practices/` memakai path `../` untuk CSS, JS, gambar, dan link.

## Struktur file style

```
css/base.css         → token, reset, tipografi, layout, tombol, header, CTA + footer  (WAJIB di semua halaman)
css/components.css   → semua komponen konten (lihat tabel Komponen)                   (WAJIB di semua halaman)
css/<halaman>.css    → style khusus satu halaman, mis. css/home.css                     (opsional)

js/isometric.js      → renderer kubus isometrik + daftar ilustrasi                      (WAJIB)
js/site.js           → nav mobile, dropdown, render ilustrasi, highlight matrix, tahun  (WAJIB)
js/<halaman>.js      → interaksi khusus halaman: js/home.js (hero matrix), js/contact.js (form), js/about-morph.js (hero About berubah bentuk 3× berulang, butuh GSAP)

assets/images/brand/ → logo.svg (latar terang), logo-white.svg (latar gelap)
```

Aturan: kalau sebuah style dipakai di lebih dari satu halaman, pindahkan ke `components.css`.

## Logo

```html
<a href="index.html" class="logo"><img src="assets/images/brand/logo.svg" alt="Whitespace Solutions" width="147" height="42" /></a>
```

Tinggi logo 42px. Di footer/latar gelap pakai `logo-white.svg`. Jangan menggambar ulang logo; selalu pakai file SVG ini.

## Warna

| Token | Hex | Dipakai untuk |
| --- | --- | --- |
| `--ink` | `#15171a` | Heading, tombol gelap, garis tebal di atas grup |
| `--text` | `#3c4046` | Teks body |
| `--muted` | `#62676e` | Caption, label tabel, nomor step |
| `--line` | `#e2e4e7` | Garis pemisah tipis |
| `--line-strong` | `#c6cad0` | Garis putus-putus "Your whitespace" |
| `--panel` | `#f4f5f6` | Latar card, step, chart, field form |
| `--cell` | `#eef0f2` | Latar tile matrix, sektor, layanan |
| `--cell-dark` | `#2b2e33` | Cell aktif di matrix, bar timeline |
| `--orange` | `#f2902a` | Aksen tunggal: CTA utama, "Your whitespace", nav aktif |
| `--orange-deep` | `#a9520a` | Hover link di latar terang |
| `--orange-soft` | `#fff3e6` | Area highlight di chart, hover tile link |
| `--night` | `#121417` | Latar CTA + footer |
| `--night-line` | `#2f3338` | Garis di latar gelap |
| `--night-text` | `#aab0b7` | Teks di latar gelap |

Oranye adalah satu-satunya warna aksen. Pakai **sekali per layar** untuk hal yang paling penting.

## Tipografi

Font: **Archivo** (Google Fonts, variable: width 62–125, weight 100–900). Ukuran memakai skala fluid situs asli:

| Token | Ukuran | Dipakai oleh |
| --- | --- | --- |
| `--step-5` | 40 → 88px | `.display` (judul hero/halaman) |
| `--step-4` | 36 → 68px | `.title` (judul section) |
| `--step-3` | 28 → 46px | — |
| `--step-2` | 22 → 30px | `.subtitle`, nama role, link "Next" |
| `--step-1` | 18 → 21px | `.lead`, judul feature, isi field form |
| `--step-0` | 16 → 17px | body |
| `--step--1` | 13 → 14px | `.caption`, label field, breadcrumb |

| Class | Gaya |
| --- | --- |
| `.display` / `.title` | 800, width 115%, tracking -0.035em |
| `.subtitle` | 700, width 105% |
| `.caption` | 600, width 85% (condensed), warna `--muted` |

Judul section yang berupa kalimat diakhiri titik: *"What the work looks like."* Label pendek tanpa titik: *"Services"*, *"Open roles"*.

**Pemotongan baris judul ditulis manual dengan `<br />`** kalau ingin sama dengan desain (2–3 baris pendek). Tanpa `<br />`, judul mengalir mengikuti lebar kolom.

```html
<h2 class="title">We don't hand<br /> over a deck<br /> and leave.</h2>
<!-- Hero Home tidak pakai <br />: lebarnya dibatasi max-width 7.6em di css/home.css -->
<h1 class="display">Growth hides in the space no one has mapped.</h1>
```

## Layout & jarak

Semua section memakai `.container`, jadi tepi kiri dan kanan semua konten (header, hero, section, footer) **selalu sejajar**.
Latar warna dan garis pemisah section membentang penuh selebar layar; isinya tetap di dalam container.

| Token | Nilai | Artinya |
| --- | --- | --- |
| `--gutter` | `clamp(16px, 4vw, 72px)` | Jarak kiri = kanan. **72px** di desktop (layar ≥1800px), di bawahnya 4% lebar layar, minimum **16px** di HP |
| `--container` | `1760px` | Lebar konten maksimal; baru terasa di monitor sangat lebar (>1904px) |
| `--section-space` | `clamp(48px, 6vw, 96px)` | Padding atas & bawah tiap section → jarak antar section maks **192px** di desktop (layar ≥1600px; situs asli 320px, sengaja dirapatkan), **96px** di HP |
| `--head-space` | `clamp(48px, 6vw, 80px)` | Jarak judul section (`.split--head`) ke isinya, sama dengan situs asli |
| `--header-h` | `64px` | Tinggi header (sticky) |
| `--tile-gap` | `3px` | Jarak antar tile abu |

Contoh lebar konten: layar 1866px → konten 1722px (72px kiri-kanan) · layar 1440px → 1325px (±58px) · layar 390px → 358px (16px).

Catatan: situs asli memakai gutter maks 48px dan lebar maks 1360px. Di proyek ini sengaja dibuat 72px / 1760px sesuai arahan.

- **Hero Home**: 2 kolom sama lebar di dalam container, tinggi `min(100svh − header, 900px)`.
- **Hero halaman dalam** (`.page-hero`): judul + lead di kiri, ilustrasi + catatan di kanan, kedua kolom **rata tengah vertikal** (situs asli rata bawah, tapi itu menyisakan ruang kosong besar di atas judul).
- **Pola kepala section** (`.split.split--head`): judul besar di kiri, `.lead` di kanan dan rata bawah, jarak `--head-space` ke konten.
- **HP / ≤900px**: label section, judul + lead (kepala section, hero Home & halaman dalam, intro Contact), breadcrumb, serta isi kotak CTA
  **rata tengah** (blok di akhir `css/components.css`; hero Home di `css/home.css`, termasuk tombolnya). Juga rata tengah: kartu
  `.value` (Home, About), baris sebelum → sesudah (`.compare`), teks contoh engagement Home (`.work__example`), teks studi kasus
  runway (`.case__text`) + caption grafiknya, kartu `why-table` (mode kartu ≤700px), ilustrasi + teks samping hero halaman
  dalam (`.page-hero__aside`), kartu grup industri (`.tiles--groups`), fitur (`.feature`, nomor di atas judul), teks semua
  studi kasus (`.case-study__text`, garis oranye `.case-study__result` pindah ke atas), langkah `.flow`, `.cases__more`,
  kartu `.journey` dan `.model`, label + deskripsi grup layanan (`.tile-group__label/__desc`), tabel `.data-table`
  (mode baris bertumpuk) dan caption di bawahnya (`.table-wrap .caption`), lowongan Careers (`.role`, tombol Apply ikut di tengah).
  Judul yang di HP harus lebih sedikit barisnya: `<br class="br-wide" />` (hanya memotong di desktop) + class `.title--fit`
  (ukuran ikut lebar kolom supaya baris terpanjang muat). Dipakai di Home "Start small, prove it, / then grow.".
  Juga langkah bernomor `.approach`. `.feature` di HP diberi padding
  14px kiri-kanan (desktop hanya kanan). Yang masih rata kiri: `.pullquote`, kotak tile, form.
  Desktop tidak berubah.
- **Grup tile**: garis `--ink` 1.5px di atas, lalu tile abu berjarak **3px** (`--tile-gap`). Tanpa border radius dan bayangan.
- **CTA + footer** adalah satu blok gelap (`div.dark`): kotak CTA bergaris oranye + ilustrasi, lalu kolom footer (brand, Practices, Firm, Office dengan alamat lengkap). Tidak ada garis pemisah di antaranya. Halaman Contact hanya memakai footer.
- Breakpoint: **1100px** (grid mengecil), **900px** (nav mobile, 1 kolom), **600px** (ponsel).

Untuk mengubah lebar seluruh situs, cukup ubah `--gutter` / `--container` di `css/base.css`.

## Komponen

| Komponen | Markup kunci | Contoh |
| --- | --- | --- |
| Tombol utama | `.btn.btn--orange` (+ `.btn--sm`) + `<span class="arrow">→</span>`; hover: panel hitam menyapu dari kiri (0,45 dtk), teks putih, panah geser 4px. Di `.dark`: panel putih, teks hitam | "Start a conversation", "Apply" |
| Tombol gelap | `.btn.btn--dark`; hover: berubah oranye, teks hitam | Tombol di header |
| Link garis bawah | `.link-underline` | "How we work" |
| Link panah | `.link-arrow` | "View practice →" |
| Nav aktif | `aria-current="page"` pada `.nav__link` | Garis bawah oranye |
| Page hero | `section.page-hero` (+ `.breadcrumb`, `.page-hero__art`) | Semua halaman dalam |
| Value cards | `ul.values > li.value` (+ `<div class="iso value__art" data-illustration="…" data-pad="0.4">`); area gambar 170px, ikon setinggi 120px (90px di HP), sama dengan situs asli; hover: latar `--panel` → `--cell` | Home, About |
| Practice matrix | `.matrix > article.practice` (+ `.cell`, `.cell--whitespace`); 11 cell + 1 whitespace per pilar = tepat 2 baris | Home "Three ways we help" |
| Value cards (3 kolom) | `ul.values.values--3`; `<strong>` di dalam `<p>` jadi kalimat pembuka hitam | Home Practical / Applicable / Affordable |
| Angka besar | `p.stat > span.stat__num + span.stat__label` (angka oranye, ukuran `--step-5`) | Belum dipakai di halaman; contoh ada di styleguide |
| Pull quote | `blockquote.pullquote` (+ `<strong>` untuk bagian yang ditekankan); garis kiri oranye. Maks. satu per section | Penutup section |
| Sebelum → sesudah | `.compare` > `p.compare__head` ×2 + `.compare__row` > `.compare__from` + `span.compare__arrow` + `.compare__to` | Home "Most advice stops at the slide deck." |
| Bisnis × teknologi | `.overlap` > `.overlap__side` (h3 + `ul.tags` + `.blindspot`) + `.overlap__core` (blok oranye) + `.overlap__side` | Belum dipakai di halaman (dihapus dari AI Implementation agar tidak terlalu panjang); contoh ada di styleguide |
| Tag | `ul.tags > li` (kotak kecil bergaris) | Venn, dimensi IT diagnostic |
| Langkah bernomor | `ol.approach > li` > `span.approach__num` + h3 + p; langkah 1 oranye | AI Implementation "Our approach to AI" |
| Kartu alur / use case | `ul.journeys > li.journey` (caption + h3 + p); 4 kolom, `.journeys--3` / `.journeys--2` untuk 3 / 2 kolom; kartu pertama bergaris oranye | Fractional Leadership alur klien, AI use cases |
| Label section | `p.section-label` tepat sebelum `.split--head` (teks huruf besar oranye + kotak kecil). Teksnya tidak boleh sama dengan judul | Semua section isi, kecuali hero & CTA |
| Fitur 3 kolom | `.features.features--3`: tetap satu baris sampai 800px (tidak pecah 2 + 1) | AI Implementation "What we do" |
| Tabel perbandingan | `.why__wrap > table.why-table`; kolom kita `.why-table__us`; tanda `span.mark.mark--yes / --no / --part`. Setiap `td` wajib `data-label` (di HP tabel jadi kartu per baris) | Home "Why Whitespace" |
| Kartu penawaran | `.offer-grid > article.offer` (+ `.offer--dark`) | Belum dipakai di halaman (dihapus dari Home); contoh ada di styleguide |
| Studi kasus alur | `article.case-study` > `.case-study__text` + `ol.flow > li` (+ `.flow__ai` oranye muda, `.flow__person` gelap) + opsional `ul.tags`, `p.case-study__result` | AI Implementation "AI at work" |
| Model kerja | `.models > article.model` > `.model__diagram` (SVG kotak 200×110) + caption + h3 + p | AI Implementation "Three ways to work with us" |
| Deskripsi grup tile | `p.tile-group__desc` setelah `.tile-group__label` | Business Transformation Services |
| Process | `.phases > .phase > ol.phase__steps > li.step[value]` | Tidak dipakai di halaman (workflow About diarsipkan); tetap di styleguide |
| Grup industri | `ul.tiles.tiles--icons.tiles--groups > li.cell.cell--icon` (ikon + `h3` grup + `p` daftar industri) | About "Across industries" |
| Field error / status form | `.field.is-invalid`, `p.field__error`, `p.form__status` (diisi `js/contact.js`) | Contact |
| Tile grid | `ul.tiles > li.cell` (+ `.tiles--short`, `.tile-group`, `a.cell.cell--link`) | Sektor, Services |
| Feature columns | `.features > .feature` (+ `.feature__num`) | "What we do" |
| Case study | `.case > figure.case__chart + .case__text` | Home chart runway → EBITDA |
| Data table | `table.data-table` (+ `.num`, `.timeline`) | Tabel engagement |
| Next link | `a.next-link` | "Next: Business Transformation" |
| Roles list | `ul.roles > li.role` | Careers |
| Detail list | `dl.details` | Contact |
| Form | `form.form > .field` (+ `.field--full`, `.form__footer`) | Contact |
| CTA + footer | `div.dark > section.contact + footer.footer` (satu blok) | Bagian bawah semua halaman |

## Ilustrasi isometrik

Semua ilustrasi kubus dibuat oleh kode, bukan gambar:

```html
<div class="iso" data-illustration="ownership"></div>
```

Nama yang tersedia: `deck`, `proactive`, `ownership`, `strategic`, `network`, `tailored`,
`turnaround`, `productivity`, `deals`, `capital`, `ai`, `fractional`, `pre`, `engagement`, `partnership`,
`about`, `careers`, `tower`, `night`.

Ikon pilar: `ai` (AI Implementation), `turnaround` (Business Transformation), `fractional` (Fractional Leadership).

Untuk menambah ilustrasi, tambahkan entri di `ILLUSTRATIONS` pada `js/isometric.js`.
Perhatian: kubus yang bergerak digambar menurut posisi terdekat antara awal dan akhirnya. Kubus yang **jatuh dari atas** ke samping kubus lain bisa menutupi tetangganya; untuk ilustrasi yang padat, pakai gerakan menyamping atau fade di tempat (lihat `ai`).
Tone yang tersedia: `light`, `paper`, `mid`, `dark`, `orange`, `ghost` (wireframe oranye putus-putus), `night`, `nightHi`.
Garis antar-kubus **tipis dan samar** (bukan putih): tiap sisi diberi stroke 0.015 unit dengan warna sisinya sendiri digelapkan 8%. Atur lewat konstanta `SEAM` di `js/isometric.js` (0 = tanpa garis).
Warnanya sama dengan tone stone, paper, ink, signal, dan night situs asli. Aturannya: kubus abu/gelap, oranye hanya sebagai aksen.

## Animasi

Meniru animasi situs asli. Semua animasi hanya jalan sekali saat elemen terlihat di layar, dan otomatis dilewati
untuk pengguna dengan pengaturan *reduce motion* (langsung tampil di posisi akhir).

| Animasi | Cara kerja | Durasi |
| --- | --- | --- |
| **Ilustrasi kubus merakit diri** | Otomatis untuk setiap `.iso` dan hero matrix. Tiap kubus jatuh dari 3 unit di atas sambil fade-in, merambat diagonal dari pojok belakang; kubus oranye mendarat terakhir, wireframe oranye (`ghost`) muncul paling akhir. | 1,1 dtk per kubus, `--ease-out` |
| **Grafik runway** | `<svg data-reveal>` + class `rw-line rw-before/rw-after` (pakai `pathLength="1"`), `rw-pivot`, `rw-end`. Garis tergambar, lalu titik muncul berurutan. | ±2,7 dtk total |

Detail teknis:
- Kubus: `js/isometric.js` menggambar tiap kubus sebagai `<g class="c">` dengan variabel CSS `--ax/--ay` (posisi akhir), `--bx/--by` (posisi awal), `--bo` (opacity awal), `--d` (delay). CSS di `base.css` (`.iso-svg`).
- Gerakan khusus per kubus bisa diatur di `ILLUSTRATIONS`: tambahkan `from: [x, y, z]`, `delay` (ms), `fade: true`. Matikan animasi dengan `render(voxels, { animate: false })`.
- Ikon kartu nilai (`proactive`, `ownership`, `strategic`, `network`, `tailored`) juga **persis** situs asli: kubus oranye melompat keluar dari batang; jatuh ke pojok blok; 4 kubus datang dari 4 arah; grid berjarak jatuh dengan pusat oranye terakhir; kubus oranye mengisi celah blok. Kubus yang diam ditandai dengan `still([...])` supaya tidak ikut animasi jatuh.
- Semua ilustrasi hero (`.page-hero__art`, `.contact-page__art`) memakai `data-pad="0.4"` sehingga ukurannya sama persis dengan situs asli (lebar maks 460px; menara Contact 150px).
- Hero Careers (`careers`): tangga putih 5×2 setinggi 1–5, kubus oranye "mendaki" dari kaki tangga ke puncak. Contact (`tower`): menara 2×2 setinggi 11 tumbuh lapis demi lapis dari bawah, lapis ke-6 oranye, di atas lantai putih. Keduanya **persis** situs asli.
- Hero About (`about`, dengan `data-pad="0.4"`) **persis** situs asli: ladang 6×4 kubus putih/abu setinggi 1–2, dengan 5 menara setinggi 3 (kolom `(x + 2y) % 5 === 1`) yang puncak oranyenya jatuh berurutan. Ilustrasi hero halaman dalam lebarnya maks 460px, rata kanan (`.page-hero__art`).
- Ikon praktik (`turnaround`, `productivity`, `deals`, `capital`) memakai bentuk dan gerakan **persis** situs asli: tangga meluncur dari belakang; 18 kubus berkumpul dari posisi acak (hash sama dengan situs asli); dua blok bertemu dari kiri-kanan lalu 2 kubus oranye jatuh; lapisan dasar, cincin hitam, lalu 3 kubus oranye jatuh berurutan.
- Elemen lain bisa memakai `data-reveal`: `js/site.js` memberi `data-on="true"` saat 40% elemen terlihat. Sembunyikan state awal hanya dengan selector `.js [data-reveal]:not([data-on="true"])`, supaya konten tetap tampil kalau JavaScript mati.
- Setiap halaman wajib punya `<script>document.documentElement.classList.add("js");</script>` di `<head>` (sudah ada di template).
- Semua hero kubus (Home, About, 3 pilar, Careers) dirender 3D dengan three.js 0.169.0 lewat `js/iso-gl.js` (kanvas `.iso-gl`
  menutup SVG persis; tanpa WebGL → SVG). Detail dan aturannya di `HANDOFF.md` bagian "Animasi & 3D".

### GSAP (semua halaman)

Semua halaman memakai **GSAP 3.12.5 + ScrollTrigger** (CDN cdnjs) supaya gerakan lebih halus.
`js/motion.js` dimuat di setiap halaman; Home menambah `js/home-motion.js` untuk animasi khusus Home.

| Elemen | File | Animasi GSAP |
| --- | --- | --- |
| Hero Home (judul, paragraf, tombol, caption) | `home-motion.js` | Naik 32px + fade, berurutan 0,09 dtk, `expo.out` 1,1 dtk |
| Hero halaman dalam (breadcrumb, judul, lead, teks samping; intro + detail di Contact) | `motion.js` | Sama dengan hero Home |
| Hero matrix mengikuti kursor | `home-motion.js` | Saat kursor di atas hero, seluruh matriks miring 3D (rotateY ±10°, rotateX ±6°, perspektif 1100px) dan bergeser ±12px ke arah kursor; kembali halus saat kursor keluar (`gsap.quickTo`, 0,9 dtk `power3.out`). Hanya untuk perangkat dengan mouse |
| Semua kubus isometrik | `motion.js` | Tween variabel `--tx/--ty/--to` dari posisi awal ke akhir, `expo.out` 1,3 dtk, delay per kubus tetap dari `ILLUSTRATIONS` |
| Grafik runway | `home-motion.js` | Garis tergambar `power2.inOut`; titik hitam & oranye "pop" (`back.out`) |
| Bar timeline di tabel engagement | `motion.js` | Memanjang dari kiri (`scaleX`), `expo.out` 1,2 dtk, berurutan per baris |
| Judul section, kartu nilai, fitur, tile layanan, lowongan, field form, langkah proses, tabel, link "Next", kotak CTA | `motion.js` | Naik 28px + fade saat masuk layar (ScrollTrigger.batch), stagger 0,05–0,1 dtk |
| Paragraf About, baris matrix, case study | `home-motion.js` | Sama, khusus Home |

Cara kerja: `motion.js` menambah class `html.gsap-motion`, yang mematikan transition CSS (aturan kubus di `css/base.css`, grafik di `css/home.css`) sehingga hanya GSAP yang menggerakkan elemen.
Kalau GSAP gagal dimuat atau pengguna memilih *reduce motion*, class itu tidak ditambahkan dan animasi CSS biasa yang berjalan.
Untuk halaman baru: muat 2 script CDN GSAP sebelum `isometric.js`, lalu `motion.js` setelah `site.js` (sudah ada di template). Komponen baru yang perlu animasi masuk: tambahkan `reveal(".selector")` di `motion.js`.

## Membuat halaman baru

1. Salin `design-reference/page-template.html` ke root, mis. `insights.html` (atau ke subfolder dan ubah path jadi `../`).
2. Ubah `<title>`, meta description, dan tambahkan `aria-current="page"` di link nav yang sesuai.
3. Isi `<main>` dengan `.page-hero` lalu section-section memakai komponen di atas.
4. Sesuaikan judul/teks/tombol di kotak CTA, atau hapus `section.contact` kalau halaman tidak butuh CTA.
5. Kalau butuh style khusus, buat `css/<halaman>.css` dan link setelah `components.css`.
6. Tambahkan link halaman baru ke header dan footer di **semua** halaman.
