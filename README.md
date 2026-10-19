# Whitespace Solutions — Website

Website company profile Whitespace Solutions, dibuat dengan HTML, CSS, dan JavaScript murni tanpa build tool.

## Struktur

```
.
├── index.html              # Home (acuan desain)
├── about.html              # About
├── careers.html            # Careers
├── contact.html            # Contact (form → aplikasi email)
├── practices/              # 4 halaman praktik
├── css/
│   ├── base.css            # Token, tipografi, layout, header, CTA + footer (semua halaman)
│   ├── components.css      # Komponen reusable (semua halaman)
│   └── home.css            # Khusus Home
├── js/
│   ├── isometric.js        # Renderer ilustrasi kubus isometrik
│   ├── site.js             # Perilaku bersama (nav, dropdown, ilustrasi)
│   ├── home.js             # Hero matrix interaktif
│   ├── home-motion.js      # Animasi GSAP khusus Home
│   └── contact.js          # Form kontak
├── assets/images/brand/    # Logo SVG
└── design-reference/       # Style guide, template halaman, screenshot desain
```

## Menjalankan secara lokal

Buka `index.html` di browser, atau pakai ekstensi **Live Server** di VS Code
(klik kanan `index.html` → *Open with Live Server*).

## Membuat halaman baru

Baca [design-reference/README.md](design-reference/README.md), lalu mulai dari `design-reference/page-template.html`.
