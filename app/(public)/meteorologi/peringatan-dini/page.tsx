'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, TriangleAlert, Clock, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { getPeringatanDini, type PeringatanItem } from '@/lib/api';
import { formatCapTime } from '@/lib/format';

export default function PeringatanDiniPage() {
  const [items, setItems] = useState<PeringatanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await getPeringatanDini());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(
    (item) =>
      item.provinsi.toLowerCase().includes(query.toLowerCase()) ||
      item.event.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-900">Peringatan Dini Cuaca</p>
        <p className="mb-4 text-sm text-slate-600">
          Peringatan dini cuaca ekstrem (nowcast) yang sedang aktif di seluruh provinsi Indonesia, hingga level kecamatan.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari provinsi atau jenis peringatan..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-900"
            />
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:border-blue-900 disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Muat ulang
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
          <Loader2 size={18} className="animate-spin" /> Memuat peringatan...
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck size={22} />
          </span>
          <p className="font-semibold text-slate-900">Tidak ada peringatan dini aktif saat ini</p>
          <p className="mt-1 text-sm text-slate-500">Halaman ini menampilkan peringatan yang sedang berlaku dari BMKG.</p>
        </div>
      )}

      {!loading && items.length > 0 && filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400">Tidak ada peringatan yang cocok dengan pencarian.</p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((item) => (
          <Link
            key={item.kode}
            href={`/meteorologi/peringatan-dini/${item.kode}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <TriangleAlert size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {formatCapTime(item.pub_date)}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {item.description.split(/\n\s*\n/)[0]}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) — Peringatan Dini Cuaca (CAP).
      </p>
    </div>
  );
}