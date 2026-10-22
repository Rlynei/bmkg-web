'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Newspaper, CalendarDays, MapPin } from 'lucide-react';
import { getPublicBeritaList, getPublicKegiatanList, getFileUrl, type PublicBerita, type PublicKegiatan } from '@/lib/api';
import ProfilSidebar from '../_components/ProfilSidebar';

type CombinedItem =
  | { type: 'berita'; date: string; data: PublicBerita }
  | { type: 'kegiatan'; date: string; data: PublicKegiatan };

type Filter = 'all' | 'berita' | 'kegiatan';

export default function BeritaKegiatanPage() {
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    Promise.all([getPublicBeritaList(), getPublicKegiatanList()])
      .then(([berita, kegiatan]) => {
        const combined: CombinedItem[] = [
          ...berita.map((b): CombinedItem => ({ type: 'berita', date: b.tanggal_publish, data: b })),
          ...kegiatan.map((k): CombinedItem => ({ type: 'kegiatan', date: k.tanggal_mulai, data: k })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setItems(combined);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = items
    .filter((item) => filter === 'all' || item.type === filter)
    .filter((item) => item.data.judul.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">Informasi</p>
          <h1 className="mb-2 text-3xl font-bold">Berita & Kegiatan</h1>
          <p className="max-w-2xl text-sm text-blue-100">
            Kabar terbaru dan agenda kegiatan resmi BMKG.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <ProfilSidebar />

          <div className="flex-1">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari judul..."
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-900"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'berita', 'kegiatan'] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      filter === f ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {f === 'all' ? 'Semua' : f === 'berita' ? 'Berita' : 'Kegiatan'}
                  </button>
                ))}
              </div>
            </div>

            {loading && <p className="text-center text-sm text-slate-400">Memuat data...</p>}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-slate-400">Belum ada data yang tersedia.</p>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filtered.map((item) => {
                const thumb = getFileUrl(item.data.thumbnail);
                const isBerita = item.type === 'berita';
                const href = isBerita
                  ? `/berita-kegiatan/berita/${item.data.slug}`
                  : `/berita-kegiatan/kegiatan/${item.data.slug}`;

                return (
                  <Link
                    key={`${item.type}-${item.data.id}`}
                    href={href}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-900 hover:shadow-md"
                  >
                    <div className="flex h-36 items-center justify-center bg-slate-50">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={item.data.judul} className="h-full w-full object-cover" />
                      ) : isBerita ? (
                        <Newspaper size={36} className="text-slate-300" />
                      ) : (
                        <CalendarDays size={36} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          isBerita ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                        }`}
                      >
                        {isBerita ? 'Berita' : 'Kegiatan'}
                      </span>
                      <h3 className="mb-1 line-clamp-2 font-semibold text-slate-900">{item.data.judul}</h3>

                      {isBerita ? (
                        <p className="text-xs text-slate-400">
                          {new Date((item.data as PublicBerita).tanggal_publish).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={11} /> {(item.data as PublicKegiatan).lokasi ?? '-'}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}