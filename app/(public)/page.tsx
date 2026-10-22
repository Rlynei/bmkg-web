'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';
import {
  getCuacaDetail,
  getPeringatanDini,
  searchWilayah,
  type CuacaSlot,
  type PeringatanItem,
  type WilayahItem,
} from '@/lib/api';

/* ------------------------------------------------------------------ */
/* Konfigurasi                                                         */
/* ------------------------------------------------------------------ */

/** Wilayah cadangan bila lokasi pengunjung tidak dapat diakses (BMKG Pusat, Kemayoran). */
//const WILAYAH_DEFAULT = { cari: 'Kemayoran', provinsi: 'jakarta' };
//const STORAGE_PILIHAN = 'bmkg-wilayah-pilihan';

const KODE_DEFAULT = '31.71.03.1005'; // Kemayoran, Jakarta Pusat
const NAMA_DEFAULT = 'Gunung Sahari Selatan';
const MAKS_PERINGATAN = 10;
const SLOT_PER_HARI = 8; // prakiraan BMKG per 3 jam

const TABS = [
  { key: 'saat-ini', label: 'Saat ini', judul: 'Cuaca Saat Ini' },
  { key: 'hari-ini', label: 'Hari ini', judul: 'Cuaca Hari Ini' },
  { key: 'besok', label: 'Besok', judul: 'Cuaca Besok' },
  { key: 'lusa', label: 'Lusa', judul: 'Cuaca Lusa' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const LAYANAN = [
  { key: 'meteorologi', href: '/meteorologi', emoji: '🌤️', title: 'Stasiun Meteorologi', desc: 'Prakiraan cuaca wilayah, peringatan dini, citra satelit, radar cuaca, dan info cuaca penerbangan.' },
  { key: 'maritim', href: '/maritim', emoji: '🌊', title: 'Stasiun Meteorologi Maritim', desc: 'Prakiraan gelombang laut, cuaca wilayah perairan, cuaca pelabuhan, dan peringatan gelombang tinggi.' },
  { key: 'klimatologi', href: '/klimatologi', emoji: '🌡️', title: 'Stasiun Klimatologi', desc: 'Prakiraan awal musim, analisis curah hujan, prakiraan hujan bulanan/dasarian, dan data kualitas udara.' },
  { key: 'geofisika', href: '/geofisika', emoji: '🌋', title: 'Stasiun Geofisika', desc: 'Informasi parameter gempa bumi terkini, peringatan dini tsunami, pemantauan petir, serta data magnet bumi.' },
];

/* ------------------------------------------------------------------ */
/* Tipe                                                                */
/* ------------------------------------------------------------------ */

type Zona = 'WIB' | 'WITA' | 'WIT';
type SumberLokasi = 'gps' | 'manual' | 'default';
type Status = 'lokasi' | 'cuaca' | 'siap' | 'error';

type DataCuaca = {
  wilayah: WilayahItem;
  provinsi: string;
  tz: string;
  zona: Zona;
  slots: CuacaSlot[]; // seluruh slot 3 jam, terurut waktu lokal
  sumber: SumberLokasi;
};

/* ------------------------------------------------------------------ */
/* Helper umum                                                         */
/* ------------------------------------------------------------------ */

function bacaJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function simpanJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* penyimpanan penuh atau diblokir: abaikan */
  }
}

/** Menyeragamkan nama wilayah agar "Kelurahan Menteng" dan "Menteng" dianggap sama. */
function bersih(nama?: string | null) {
  return (nama ?? '')
    .toLowerCase()
    .replace(/\b(kelurahan|kel|desa|kecamatan|kec|kota administrasi|kota adm|kota|kabupaten|kab|administrasi)\b\.?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sama(a?: string | null, b?: string | null) {
  const x = bersih(a);
  const y = bersih(b);
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x));
}

/* ------------------------------------------------------------------ */
/* Lokasi pengunjung                                                   */
/* ------------------------------------------------------------------ */

function ambilPosisi(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Browser tidak mendukung akses lokasi.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

function alasanGagal(err: unknown) {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: number }).code;
    if (code === 1) return 'Akses lokasi ditolak. Izinkan akses lokasi di browser untuk melihat cuaca di tempat Anda.';
    return 'Lokasi Anda belum dapat ditentukan.';
  }
  return err instanceof Error ? err.message : 'Lokasi Anda belum dapat ditentukan.';
}

async function reverseGeocode(lat: number, lon: number): Promise<Record<string, string>> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=16&accept-language=id&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Gagal membaca nama wilayah dari lokasi Anda.');
  const json = await res.json();
  return (json.address ?? {}) as Record<string, string>;
}

/** Mengubah koordinat menjadi kelurahan/kecamatan yang ada di tabel wilayah BMKG. */
async function wilayahDariKoordinat(lat: number, lon: number): Promise<WilayahItem | null> {
  const key = `bmkg-geo:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const tersimpan = bacaJson<WilayahItem>(sessionStorage, key);
  if (tersimpan) return tersimpan;

  const a = await reverseGeocode(lat, lon);
  const kelurahan = [a.suburb, a.village, a.neighbourhood, a.quarter].filter(Boolean) as string[];
  const kecamatan = a.city_district ?? a.district ?? a.subdistrict ?? a.municipality;
  const kabupaten = a.city ?? a.county ?? a.regency ?? a.town ?? a.state_district;

  let terbaik: { w: WilayahItem; skor: number } | null = null;

  for (const nama of kelurahan) {
    const kata = bersih(nama) || nama;
    if (kata.length < 3) continue;
    const daftar = await searchWilayah(kata).catch(() => [] as WilayahItem[]);
    for (const w of daftar) {
      const skor =
        (sama(w.nama_kelurahan, nama) ? 4 : 0) +
        (sama(w.nama_kecamatan, kecamatan) ? 2 : 0) +
        (sama(w.nama_kabupaten, kabupaten) ? 2 : 0);
      if (!terbaik || skor > terbaik.skor) terbaik = { w, skor };
    }
    if (terbaik && terbaik.skor >= 6) break;
  }

  // Cadangan: cocokkan lewat kecamatan bila nama kelurahan tidak ditemukan.
  if ((!terbaik || terbaik.skor < 4) && bersih(kecamatan).length >= 3) {
    const daftar = await searchWilayah(bersih(kecamatan)).catch(() => [] as WilayahItem[]);
    let kandidat: { w: WilayahItem; skor: number } | null = null;
    for (const w of daftar) {
      const skor = (sama(w.nama_kecamatan, kecamatan) ? 3 : 0) + (sama(w.nama_kabupaten, kabupaten) ? 2 : 0);
      if (skor >= 3 && (!kandidat || skor > kandidat.skor)) kandidat = { w, skor };
    }
    if (kandidat) terbaik = kandidat;
  }

  if (!terbaik || terbaik.skor < 3) return null;
  simpanJson(sessionStorage, key, terbaik.w);
  return terbaik.w;
}

async function wilayahDefault(): Promise<WilayahItem> {
  try {
    const daftar = await searchWilayah(NAMA_DEFAULT);
    const cocok = daftar.find((w) => w.kode_adm4 === KODE_DEFAULT);
    if (cocok) return cocok;
    //const sesuai = daftar.filter((w) => w.nama_provinsi.toLowerCase().includes(WILAYAH_DEFAULT.provinsi));
    //return sesuai.find((w) => bersih(w.nama_kelurahan) === WILAYAH_DEFAULT.cari.toLowerCase()) ?? sesuai[0] ?? daftar[0] ?? null;
  } catch {
    // pakai data cadangan di bawah 
  }
  return{
    id:0,
    kode_adm4:KODE_DEFAULT,
    nama_kelurahan:NAMA_DEFAULT,
    nama_kecamatan:'Kemayoran',
    nama_kabupaten:'Jakarta Pusat',
    nama_provinsi:'DKI Jakarta',
  };
}

function resolveZona(timezone?: string): { tz: string; zona: Zona } {
  const v = (timezone ?? '').toLowerCase();
  if (v.includes('+0900') || v.includes('jayapura')) return { tz: 'Asia/Jayapura', zona: 'WIT' };
  if (v.includes('+0800') || v.includes('makassar')) return { tz: 'Asia/Makassar', zona: 'WITA' };
  return { tz: 'Asia/Jakarta', zona: 'WIB' };
}

/* ------------------------------------------------------------------ */
/* Helper cuaca                                                        */
/* ------------------------------------------------------------------ */

function parseLocal(value: string) {
  return new Date(value.replace(' ', 'T'));
}

/** Waktu "sekarang" di zona waktu wilayah, dinyatakan sebagai Date lokal. */
function wilayahNow(tz: string, now: Date) {
  return new Date(now.toLocaleString('en-US', { timeZone: tz }));
}

function ymd(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Indeks slot yang sedang berlaku: slot terakhir yang waktunya sudah lewat. */
function indeksSekarang(slots: CuacaSlot[], local: Date) {
  let idx = -1;
  slots.forEach((s, i) => {
    if (parseLocal(s.local_datetime).getTime() <= local.getTime()) idx = i;
  });
  return idx === -1 ? 0 : idx;
}

function slotsUntuk(tab: TabKey, data: DataCuaca, now: Date): CuacaSlot[] {
  const local = wilayahNow(data.tz, now);
  if (tab === 'saat-ini') {
    const i = indeksSekarang(data.slots, local);
    return data.slots.slice(i, i + SLOT_PER_HARI);
  }
  const offset = tab === 'hari-ini' ? 0 : tab === 'besok' ? 1 : 2;
  const target = new Date(local);
  target.setDate(target.getDate() + offset);
  const key = ymd(target);
  return data.slots.filter((s) => s.local_datetime.slice(0, 10) === key);
}

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function ArrowButton({
  direction,
  onClick,
  disabled,
  className = '',
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Sebelumnya' : 'Berikutnya'}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-default disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-white ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}

function PeringatanBanner({ items }: { items: PeringatanItem[] }) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const aktif = items[index % items.length];
  const pindah = (arah: 1 | -1) => setIndex((i) => (i + arah + items.length) % items.length);
  const judul = aktif.provinsi ? `Peringatan Dini Cuaca ${aktif.provinsi}` : aktif.title;

  return (
    <div className="mt-8 flex items-center gap-4">
      <ArrowButton direction="prev" onClick={() => pindah(-1)} disabled={items.length < 2} className="max-sm:hidden"/>
      <div className="flex min-w-0 flex-1 items-start gap-4 rounded-xl border border-orange-400 bg-orange-50 px-4 py-3 sm:px-6 sm:py-4">
        <AlertTriangle size={28} className="mt-0.5 shrink-0 text-amber-500" />
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{judul}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-700">{aktif.description || aktif.title}</p>
          {/* Ganti ke `/meteorologi/peringatan-dini/${aktif.kode}` bila halaman detail memakai rute itu. */}
           <Link href="/meteorologi/peringatan-dini" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">
            Selengkapnya →
          </Link>
          {items.length > 1 && (
            <div className="mt-3 flex items-center gap-3 sm:hidden">
              <button type="button" onClick={() => pindah(-1)} aria-label="Sebelumnya" className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-300 bg-white text-slate-700">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600">{(index % items.length) + 1} / {items.length}</span>
              <button type="button" onClick={() => pindah(1)} aria-label="Berikutnya" className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-300 bg-white text-slate-700">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <ArrowButton direction="next" onClick={() => pindah(1)} disabled={items.length < 2} className="max-sm:hidden" />
    </div>
  );
}

function SlotCard({ slot, zona, aktif }: { slot: CuacaSlot; zona: Zona; aktif: boolean }) {
  const waktu = parseLocal(slot.local_datetime);
  const jam = waktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const tanggal = waktu.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl bg-blue-100/70 px-3 pb-6 pt-7 text-center sm:px-4 sm:pb-7 sm:pt-8 ${
        aktif ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <span className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full border-[14px] border-blue-200/70" />
      <h3 className="relative text-base font-bold text-slate-900 sm:text-lg">
        {jam} {zona}
      </h3>
      <p className="relative mt-1 text-sm text-slate-400">{aktif ? 'Sekarang' : tanggal}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slot.image} alt={slot.weather_desc} className="relative mx-auto my-5 h-16 w-16" />
      <p className="relative text-3xl font-extrabold text-slate-900 sm:text-4xl">{slot.t} °C</p>
      <p className="relative mt-2 text-sm text-slate-600">{slot.weather_desc}</p>
    </div>
  );
}

function SlotSkeleton() {
  return <div className="h-[290px] animate-pulse rounded-3xl bg-blue-100/60" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

const LABEL_SUMBER: Record<SumberLokasi, string> = {
  gps: 'Lokasi Anda',
  manual: 'Lokasi pilihan',
  default: 'Lokasi bawaan',
};

export default function BerandaPage() {
  const [tab, setTab] = useState<TabKey>('saat-ini');
  const [now, setNow] = useState<Date | null>(null);
  const [status, setStatus] = useState<Status>('lokasi');
  const [pesan, setPesan] = useState<string | null>(null);
  const [data, setData] = useState<DataCuaca | null>(null);
  const [peringatan, setPeringatan] = useState<PeringatanItem[]>([]);

  const [cariTerbuka, setCariTerbuka] = useState(false);
  const [query, setQuery] = useState('');
  const [hasilCari, setHasilCari] = useState<WilayahItem[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Jam berjalan (dirender setelah mount agar tidak beda dengan server).
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const muatCuaca = useCallback(async (wilayah: WilayahItem, sumber: SumberLokasi) => {
    setStatus('cuaca');
    try {
      const detail = await getCuacaDetail(wilayah.kode_adm4);
      const slots = (detail.data?.[0]?.cuaca ?? [])
        .flat()
        .sort((a, b) => a.local_datetime.localeCompare(b.local_datetime));
      setData({
        wilayah,
        provinsi: detail.lokasi?.provinsi ?? wilayah.nama_provinsi,
        ...resolveZona(detail.lokasi?.timezone),
        slots,
        sumber,
      });
      setStatus('siap');
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal memuat data cuaca.');
      setStatus('error');
    }
  }, []);

  const deteksiLokasi = useCallback(async () => {
    setStatus('lokasi');
    setPesan(null);
    try {
      const posisi = await ambilPosisi();
      const wilayah = await wilayahDariKoordinat(posisi.coords.latitude, posisi.coords.longitude);
      if (!wilayah) throw new Error('Wilayah di lokasi Anda belum ditemukan pada data BMKG.');
      await muatCuaca(wilayah, 'gps');
    } catch (err) {
      setPesan(`${alasanGagal(err)} Menampilkan prakiraan untuk ${NAMA_DEFAULT}.`);
      await muatCuaca(await wilayahDefault(), 'default');
      //const pilihan = bacaJson<WilayahItem>(localStorage, STORAGE_PILIHAN);
      //const cadangan = pilihan ?? (await wilayahDefault());
      //if (cadangan) await muatCuaca(cadangan, pilihan ? 'manual' : 'default');
      //else setStatus('error');
    }
  }, [muatCuaca]);

  useEffect(() => {
    deteksiLokasi();
  }, [deteksiLokasi]);

  // Peringatan dini dari backend.
  useEffect(() => {
    let aktif = true;
    getPeringatanDini()
      .then((daftar) => aktif && setPeringatan(daftar))
      .catch(() => aktif && setPeringatan([]));
    return () => {
      aktif = false;
    };
  }, []);

  // Peringatan di provinsi pengunjung ditampilkan lebih dulu.
  const peringatanTampil = useMemo(() => {
    const provinsi = data?.provinsi;
    const urut = [...peringatan].sort(
      (a, b) => Number(sama(b.provinsi, provinsi)) - Number(sama(a.provinsi, provinsi)),
    );
    return urut.slice(0, MAKS_PERINGATAN);
  }, [peringatan, data?.provinsi]);

  // Pencarian wilayah manual.
  useEffect(() => {
    if (query.trim().length < 3) {
      setHasilCari([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchWilayah(query).then(setHasilCari).catch(() => setHasilCari([]));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  function pilihWilayah(item: WilayahItem) {
    //simpanJson(localStorage, STORAGE_PILIHAN, item);
    setCariTerbuka(false);
    setQuery('');
    setHasilCari([]);
    setPesan(null);
    muatCuaca(item, 'manual');
  }

  // Slot yang ditampilkan menurut tab.
  const tampil = useMemo(() => (data && now ? slotsUntuk(tab, data, now) : []), [data, now, tab]);
  const slotSekarang = useMemo(() => {
    if (!data || !now) return null;
    return data.slots[indeksSekarang(data.slots, wilayahNow(data.tz, now))] ?? null;
  }, [data, now]);

  // Status tombol panah carousel.
  const perbaruiPanah = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  // Pada tab "Hari ini", geser ke slot yang sedang berlaku; tab lain mulai dari awal.
  // Kunci berupa string agar posisi geser tidak di-reset setiap jam berdetak.
  const kunciTampil = useMemo(() => tampil.map((s) => s.datetime).join('|'), [tampil]);
  const kunciSekarang = slotSekarang?.datetime ?? '';
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || kunciTampil === '') return;
    const daftar = kunciTampil.split('|');
    const indeks = tab === 'hari-ini' ? daftar.indexOf(kunciSekarang) : 0;
    el.scrollTo({ left: Math.max(indeks, 0) * (el.scrollWidth / daftar.length), behavior: 'auto' });
    perbaruiPanah();
  }, [tab, kunciTampil, kunciSekarang, perbaruiPanah]);

  useEffect(() => {
    perbaruiPanah();
    window.addEventListener('resize', perbaruiPanah);
    return () => window.removeEventListener('resize', perbaruiPanah);
  }, [perbaruiPanah]);

  function geser(arah: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: arah * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  const judul = TABS.find((t) => t.key === tab)?.judul ?? 'Cuaca Saat Ini';
  const memuat = status === 'lokasi' || status === 'cuaca';

  return (
    <div>
      {/* Cuaca */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{judul}</h1>

          <div className="flex flex-wrap items-center gap-3">
            <div role="tablist" aria-label="Rentang waktu prakiraan" className="flex flex-wrap gap-3">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    tab === t.key
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Link
              href="/meteorologi/prakiraan-cuaca-wilayah"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Lihat Semuanya →
            </Link>
          </div>
        </div>

        {/* Lokasi */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <MapPin size={16} className="shrink-0 text-blue-600" />
            {memuat && !data && (status === 'lokasi' ? 'Mendeteksi lokasi Anda…' : 'Memuat prakiraan cuaca…')}
            {data && (
              <>
                <span className="font-medium text-slate-900">{data.wilayah.nama_kelurahan}</span>
                <span className="text-slate-400">
                  Kec. {data.wilayah.nama_kecamatan}, {data.wilayah.nama_kabupaten}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {LABEL_SUMBER[data.sumber]}
                </span>
              </>
            )}
          </span>

          {data?.sumber !== 'gps' && !memuat && (
            <button type="button" onClick={deteksiLokasi} className="font-medium text-blue-600 hover:underline">
              Gunakan lokasi saya
            </button>
          )}
          <button
            type="button"
            onClick={() => setCariTerbuka((v) => !v)}
            className="font-medium text-blue-600 hover:underline"
          >
            Ubah lokasi
          </button>
        </div>

        {pesan && <p className="mt-2 text-sm text-amber-700">{pesan}</p>}

        {cariTerbuka && (
          <div className="relative mt-3 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kelurahan atau kecamatan…"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-900"
            />
            {hasilCari.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white py-2 text-left shadow-lg">
                {hasilCari.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pilihWilayah(item)}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span className="font-medium">{item.nama_kelurahan}</span>
                    <span className="text-slate-400">
                      {' '}
                      — {item.nama_kecamatan}, {item.nama_kabupaten}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <PeringatanBanner items={peringatanTampil} />

        {/* Prakiraan per 3 jam */}
        <div className="relative mt-8">
          <ArrowButton
            direction="prev"
            onClick={() => geser(-1)}
            disabled={!canPrev}
            className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 max-sm:hidden"
          />

          <div
            ref={scrollRef}
            onScroll={perbaruiPanah}
            className="-mx-2.5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {memuat &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shrink-0 basis-1/2 snap-start px-2.5 md:basis-1/3 lg:basis-1/5">
                  <SlotSkeleton />
                </div>
              ))}

            {!memuat &&
              data &&
              tampil.map((slot) => (
                <div key={slot.datetime} className="shrink-0 basis-1/2 snap-start px-2.5 md:basis-1/3 lg:basis-1/5">
                  <SlotCard
                    slot={slot}
                    zona={data.zona}
                    aktif={tab !== 'besok' && tab !== 'lusa' && slotSekarang?.datetime === slot.datetime}
                  />
                </div>
              ))}
          </div>

          <ArrowButton
            direction="next"
            onClick={() => geser(1)}
            disabled={!canNext}
            className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 max-sm:hidden"
          />
        </div>

        {!memuat && status === 'error' && (
          <p className="mt-6 text-center text-sm text-red-600">
            {pesan ?? 'Prakiraan cuaca belum dapat dimuat.'} Coba lagi atau pilih lokasi lewat “Ubah lokasi”.
          </p>
        )}
        {!memuat && status === 'siap' && tampil.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-500">Prakiraan untuk rentang waktu ini belum tersedia.</p>
        )}

        <p className="mt-6 text-xs text-slate-400">
          Prakiraan per 3 jam bersumber dari BMKG. Lokasi hanya dipakai di browser untuk menentukan wilayah dan tidak disimpan
        </p>
      </section>

      {/* Layanan & Informasi Publik */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Layanan & Informasi Publik</h2>
            <p className="mt-2 text-slate-500">Pilih unit kerja di bawah ini untuk mengakses layanan spesifik kami.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LAYANAN.map((item) => (
              <div key={item.key} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-3xl">
                  {item.emoji}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{item.title}</h3>
                <p className="mb-4 text-sm text-slate-500">{item.desc}</p>
                <Link href={item.href} className="text-sm font-medium text-blue-900 hover:underline">
                  Lihat Info →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}