# Auto deploy ke Railway

Alur: **Pull Request** -> `CI` (cek link internal, build image Docker, buka semua halaman) -> merge ke `main` ->
`Deploy` (ulang CI -> `railway up` -> cek semua halaman di situs live). Kalau CI merah, deploy tidak jalan.
Railway hanya memindahkan traffic ke container baru setelah lolos healthcheck (`railway.json`), jadi rilis yang
rusak tidak menggantikan versi yang sedang live.

Setup sekali (perlu admin repo):

1. Railway -> project **whitespace-website** -> **Settings -> Tokens -> New Token** (environment `production`) -> salin.
2. GitHub repo -> **Settings -> Secrets and variables -> Actions**: secret **`RAILWAY_TOKEN`** = token tadi;
   tab Variables -> **`SITE_URL`** = URL live, mis. `https://whitespace-website-production.up.railway.app`
   (atau domain custom kalau sudah dipasang).
3. Railway -> service **whitespace-website -> Settings -> Source**: pastikan **tidak** terhubung ke repo GitHub
   (kalau terhubung, setiap push ter-deploy dua kali dan melewati CI). Cukup *Disconnect*.
4. Disarankan: GitHub -> **Settings -> Branches -> Add rule** untuk `main`: *Require a pull request* dan
   *Require status checks* (`verify`). Atau **Settings -> Environments -> production -> Required reviewers**.
5. Setelah pindah ke Railway, matikan GitHub Pages (Settings -> Pages) supaya tidak ada dua versi situs.

Menambah halaman `.html` baru di folder root? Tambahkan juga ke daftar `COPY` di `Dockerfile`. CI akan gagal
(404 di smoke test) kalau lupa.

Rollback cepat: Railway -> service -> **Deployments** -> deploy sebelumnya -> **Redeploy**.
