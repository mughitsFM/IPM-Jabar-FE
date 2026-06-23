# PW IPM Jawa Barat — Frontend

Website resmi Pimpinan Wilayah Ikatan Pelajar Muhammadiyah Jawa Barat.

## Tech Stack

| Teknologi | Peran |
|---|---|
| **Vite + React 18** | Build tool & UI framework |
| **Tailwind CSS 3** | Styling — design system IPM Jabar |
| **React Router v6** | Client-side routing |
| **TanStack Query v5** | Server state, caching, mutations |
| **Axios** | HTTP client dengan interceptor token |
| **Firebase JS SDK** | Authentication (client-side) |
| **TipTap** | Rich text editor (konten berita) |
| **date-fns** | Format tanggal (locale Indonesia) |

## Arsitektur

```
src/
├── app/
│   ├── App.jsx               ← Root component
│   ├── router.jsx            ← Semua route (publik + admin)
│   └── providers/
│       ├── AuthProvider.jsx  ← Global auth context (Firebase)
│       └── QueryProvider.jsx ← TanStack Query client
│
├── features/                 ← Feature-based modules
│   ├── auth/                 ← Login admin
│   ├── beranda/              ← Homepage
│   ├── berita/               ← Berita & informasi
│   ├── profil/               ← Profil kepengurusan
│   ├── proker/               ← Program kerja / timeline
│   ├── pengaduan/            ← Pengaduan & penerusan surat
│   ├── pengguna-admin/       ← Manajemen akun admin
│   └── dashboard/            ← Panel admin dashboard
│
├── shared/
│   ├── components/
│   │   ├── layout/           ← Navbar, Footer, AdminSidebar, Layouts
│   │   └── ui/               ← Button, Badge, Card, Pagination, Skeleton, EmptyState
│   ├── constants/            ← roles.js, statusEnum.js
│   ├── hooks/                ← useDebounce, usePagination
│   ├── lib/                  ← firebaseClient.js, axiosClient.js
│   └── utils/                ← formatDate, slugify, fileValidator
│
└── styles/
    └── index.css             ← Tailwind + custom class components
```

Tiap feature mengikuti pola:
```
features/<nama>/
├── services/     ← Satu-satunya yang bisa memanggil apiClient / Firebase
├── hooks/        ← useQuery / useMutation wrapper
├── components/   ← Komponen reusable dalam feature
└── pages/
    ├── HalamanPublik.jsx
    └── admin/
        └── AdminHalamanPage.jsx
```

## Setup & Instalasi

### 1. Clone & install
```bash
git clone <repo>
cd pw-ipm-jabar-fe
npm install
```

### 2. Konfigurasi environment
```bash
cp .env.example .env
```
Isi `.env` dengan:
- `VITE_API_BASE_URL` — URL backend Django (`http://localhost:8000/api` untuk dev)
- Variabel Firebase dari Firebase Console > Project Settings > Web App

### 3. Jalankan dev server
```bash
npm run dev
# → http://localhost:5173
```

### 4. Build produksi
```bash
npm run build
# output di /dist — deploy ke hosting statis (Vercel, Netlify, Firebase Hosting, dll.)
```

## Routing

| Path | Akses | Keterangan |
|---|---|---|
| `/` | Publik | Beranda |
| `/berita` | Publik | Daftar berita |
| `/berita/:slug` | Publik | Detail berita |
| `/profil` | Publik | Profil kepengurusan |
| `/timeline` | Publik | Program kerja / timeline |
| `/pengaduan` | Publik | Form pengaduan & cek status |
| `/admin/login` | Publik | Login admin |
| `/admin/dashboard` | Admin | Dashboard ringkasan |
| `/admin/berita` | Admin | CRUD berita |
| `/admin/profil` | Admin | CRUD jabatan & anggota |
| `/admin/proker` | Admin | CRUD program kerja |
| `/admin/pengaduan` | Admin | Kelola pengaduan |
| `/admin/pengguna` | **Super Admin** | Manajemen akun admin |

## Design System

### Warna utama
| Token | Hex | Kegunaan |
|---|---|---|
| `brand-green-500` | `#1B7A3D` | Primary (Navbar, tombol utama, aksen) |
| `brand-gold-500`  | `#E8A800` | Secondary (CTA, highlight) |
| `brand-blue-500`  | `#1E5AA8` | Admin accent (sidebar, aksi edit) |
| `brand-red-500`   | `#C8102E` | Danger (hapus, error) |

### Tipografi
- Display (heading): **Lexend**
- Body: **Plus Jakarta Sans**

### Class komponen custom
```css
.btn-primary      /* Tombol hijau utama */
.btn-secondary    /* Tombol gold */
.btn-outline      /* Tombol outline hijau */
.btn-danger       /* Tombol merah */
.input-field      /* Input form standar */
.form-label       /* Label form */
.form-error       /* Pesan error form */
.card             /* Container kartu */
.container-site   /* Max-width container */
.section          /* Padding section vertikal */
.prose-ipm        /* Rich text content berita */
```

## Tambah Fitur Baru

1. Buat folder `src/features/<nama-fitur>/`
2. Buat `services/<nama>Service.js` — **HANYA DI SINI** yang boleh import `apiClient`
3. Buat `hooks/use<Nama>.js` — wrapper TanStack Query
4. Buat `components/` — komponen UI spesifik fitur
5. Buat `pages/` — halaman publik dan/atau `admin/` untuk admin
6. Daftarkan di `src/app/router.jsx`
