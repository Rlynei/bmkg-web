'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Calendar, Eye } from 'lucide-react';
import { getPublicJurnalArtikelList, getFileUrl, type PublicJurnalArtikel } from '@/lib/api';
import ProfilSidebar from '../../_components/ProfilSidebar';

export default function JurnalArtikelPublicPage() {
  const [items, setItems] = useState<PublicJurnalArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getPublicJurnalArtikelList()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (item) =>
      item.judul.toLowerCase().includes(query.toLowerCase()) ||
      item.penulis.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">Publikasi</p>
          <h1 className="mb-2 text-3xl font-bold">Jurnal & Artikel</h1>
          <p className="max-w-2xl text-sm text-blue-100">
            Kumpulan jurnal ilmiah dan artikel penelitian di bidang meteorologi, klimatologi, dan geofisika.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <ProfilSidebar />

          <div className="flex-1">
            <div className="relative mx-auto mb-10 max-w-md lg:mx-0">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-900"
              />
            </div>

            {loading && <p className="text-center text-sm text-slate-400">Memuat data...</p>}

            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-slate-400">Belum ada publikasi yang tersedia.</p>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filtered.map((item) => {
                const thumb = getFileUrl(item.thumbnail);
                return (
                  <Link
                    key={item.id}
                    href={`/publikasi/jurnal-artikel/${item.slug}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-900 hover:shadow-md"
                  >
                    <div className="flex h-36 items-center justify-center bg-slate-50">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={item.judul} className="h-full w-full object-cover" />
                      ) : (
                        <FileText size={36} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 line-clamp-2 font-semibold text-slate-900">{item.judul}</h3>
                      <p className="mb-3 text-sm text-slate-500">{item.penulis}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.tanggal_terbit).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {item.dilihat}x
                        </span>
                      </div>
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