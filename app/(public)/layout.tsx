'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ChevronDown, Calendar, Menu, X } from 'lucide-react';
//import { ChevronDown } from 'lucide-react';

function ClockBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const wib = now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const utc = now.toLocaleString('en-GB', {
    timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  return (
    <div className="bg-slate-100 px-3 py-1.5 text-center text-[11px] text-slate-500 sm:text-xs">
      {wib} WIB<span className="hidden sm:inline">&nbsp;|&nbsp;{utc} UTC</span>
    </div>
  );
}

const PROFIL_MENU = [
  {
    key: 'profil',
    label: 'Profil',
    href: '/profil',
    children: [
      { href: '/profil/sejarah', label: 'Sejarah' },
      { href: '/profil/visi-misi', label: 'Visi & Misi' },
      { href: '/profil/tugas-fungsi', label: 'Tugas & Fungsi' },
    ],
  },
  {
    key: 'stasiun',
    label: 'Stasiun/UPT',
    href: '/profil/stasiun',
    children: [
      { href: '/profil/stasiun/meteorologi', label: 'Stasiun Meteorologi' },
      { href: '/profil/stasiun/maritim', label: 'Stasiun Met. Maritim' },
      { href: '/profil/stasiun/klimatologi', label: 'Stasiun Klimatologi' },
      { href: '/profil/stasiun/geofisika', label: 'Stasiun Geofisika' },
    ],
  },
  {
    key: 'publikasi',
    label: 'Publikasi',
    href: '/publikasi',
    children: [
      { href: '/publikasi/jurnal-artikel', label: 'Jurnal & Artikel' },
      { href: '/publikasi/bulletin', label: 'Bulletin' },
    ],
  },
  {
    key: 'berita-kegiatan',
    label: 'Berita & Kegiatan',
    href: '/berita-kegiatan',
    children: null,
  },
];

const SECTION_MENU = [
  {
    key: 'meteorologi', label: 'Meteorologi', href: '/meteorologi',
    children: [
      { href: '/meteorologi/prakiraan-cuaca-wilayah', label: 'Prakiraan Cuaca Wilayah' },
      { href: '/meteorologi/cuaca-penerbangan', label: 'Cuaca Penerbangan' },
      { href: '/meteorologi/peringatan-dini', label: 'Peringatan Dini Cuaca' },
      { href: '/meteorologi/citra-satelit', label: 'Citra Satelit & Radar' },
    ],
  },
  {
    key: 'maritim', label: 'Maritim', href: '/maritim',
    children: [
      { href: '/maritim/cuaca-perairan', label: 'Prakiraan Cuaca Perairan' },
      { href: '/maritim/cuaca-pelabuhan', label: 'Prakiraan Cuaca Pelabuhan' },
      { href: '/maritim/gelombang-tinggi', label: 'Peringatan Gelombang Tinggi' },
      { href: '/maritim/info-nelayan', label: 'Informasi untuk Nelayan' },
    ],
  },
  {
    key: 'klimatologi', label: 'Klimatologi', href: '/klimatologi',
    children: [
      { href: '/klimatologi/prakiraan-musim', label: 'Prakiraan Musim' },
      { href: '/klimatologi/curah-hujan', label: 'Analisis Curah Hujan' },
      { href: '/klimatologi/kualitas-udara', label: 'Kualitas Udara' },
      { href: '/klimatologi/data-historis', label: 'Data Iklim Historis' },
    ],
  },
  {
    key: 'geofisika', label: 'Geofisika', href: '/geofisika',
    children: [
      { href: '/geofisika/gempabumi', label: 'Gempabumi Terkini' },
      { href: '/geofisika/peringatan-tsunami', label: 'Peringatan Dini Tsunami' },
      { href: '/geofisika/pemantauan-petir', label: 'Pemantauan Petir' },
      { href: '/geofisika/data-magnet', label: 'Data Magnet Bumi' },
    ],
  },
];
const MOBILE_MENU = [...PROFIL_MENU, ...SECTION_MENU];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ClockBar />
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export function PublicNavbar() {
  const [profilOpen, setProfilOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>('profil');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const tutup = () => setMobileOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-white text-blue-900">
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-7 sm:w-7" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold leading-tight text-blue-900 sm:text-xl">BMKG Tugas Magang Raihan</p>
              <p className="hidden text-[11px] font-semibold leading-tight text-emerald-600 sm:block">
                BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA
              </p>
              <p className="hidden text-[11px] italic leading-tight text-slate-400 sm:block">
                Terdepan, Tepat, dan Akurat dalam Pelayanan Informasi
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-50">
              Beranda
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setProfilOpen(true)}
              onMouseLeave={() => setProfilOpen(false)}
            >
              <button
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                  profilOpen ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Profil <ChevronDown size={14} />
              </button>

              {profilOpen && (
                <div className="absolute left-0 top-full flex rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="w-56 py-2">
                    {PROFIL_MENU.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onMouseEnter={() => setActiveSub(item.key)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                          activeSub === item.key ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                        {item.children && <span className="text-xs">›</span>}
                      </Link>
                    ))}
                  </div>
                  {(() => {
                    const active = PROFIL_MENU.find((m) => m.key === activeSub);
                    if (!active?.children) return null;
                    return (
                      <div className="w-56 border-l border-slate-100 py-2">
                        {active.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {SECTION_MENU.map((item) => (
              <SimpleDropdown key={item.key} label={item.label} href={item.href} items={item.children} />
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfYL7auiQ2Yw7A06g2Q4oon1Ymoefw0TRjqd5BNCIN4DJqhuQ/viewform"
              className="hidden items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-amber-600 sm:flex"
            >
              <Calendar size={14} /> Pelayanan
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <Link href="/" onClick={tutup} className="block rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Beranda
            </Link>
            {MOBILE_MENU.map((item) =>
              item.children ? (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup(openGroup === item.key ? null : item.key)}
                    aria-expanded={openGroup === item.key}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-slate-700"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition ${openGroup === item.key ? 'rotate-180' : ''}`} />
                  </button>
                  {openGroup === item.key && (
                    <div className="ml-3 border-l border-slate-200 pl-3">
                      <Link href={item.href} onClick={tutup} className="block px-3 py-2.5 text-sm font-medium text-blue-900">
                        Lihat semua {item.label}
                      </Link>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} onClick={tutup} className="block px-3 py-2.5 text-sm text-slate-600">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.key} href={item.href} onClick={tutup} className="block rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  {item.label}
                </Link>
              ),
            )}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfYL7auiQ2Yw7A06g2Q4oon1Ymoefw0TRjqd5BNCIN4DJqhuQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              onClick={tutup}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white"
            >
              <Calendar size={14} /> Pelayanan
            </a>
          </nav>
        )}
      </header>
      <div className="h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-amber-400" />
    </>
  );
}

function SimpleDropdown({ label, href, items }: { label: string; href: string; items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={href}
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
          open ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        {label} <ChevronDown size={14} />
      </Link>
      {open && (
        <div className="absolute left-0 top-full w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
          {items.map((child) => (
            <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="mb-2 text-lg font-bold text-white">BMKG</p>
          <p className="text-sm text-slate-400">
            Badan Meteorologi, Klimatologi, dan Geofisika — melayani informasi cuaca, iklim, dan geofisika untuk masyarakat Indonesia.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://www.instagram.com/infobmkg/?hl=en" aria-label="Instagram" className="text-slate-400 hover:text-white"><InstagramIcon /></a>
            <a href="https://x.com/infoBMKG" aria-label="Twitter" className="text-slate-400 hover:text-white"><TwitterIcon /></a>
            <a href="https://www.youtube.com/@InfoBMKGIndonesia" aria-label="YouTube" className="text-slate-400 hover:text-white"><YoutubeIcon /></a>
            <a href="https://www.facebook.com/infobmkg" aria-label="Facebook" className="text-slate-400 hover:text-white"><FacebookIcon /></a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Tautan Cepat</p>
          <ul className="space-y-2 text-sm">
            {PROFIL_MENU.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-slate-400 hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Layanan</p>
          <ul className="space-y-2 text-sm">
            {SECTION_MENU.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-slate-400 hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Kontak</p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span> Jl. Angkasa I No.2, Kemayoran, Jakarta Pusat 10610 (P.O. Box 3540 Jkt)</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>(021) 4246321</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span>info@bmkg.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Tugas Magang Raihan BMKG
      </div>
    </footer>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521A2.994 2.994 0 0 0 .502 6.186 31.26 31.26 0 0 0 0 12a31.26 31.26 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.26 31.26 0 0 0 24 12a31.26 31.26 0 0 0-.502-5.814ZM9.545 15.568V8.432L15.818 12Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.508 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
    </svg>
  );
}