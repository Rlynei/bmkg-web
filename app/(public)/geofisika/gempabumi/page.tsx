'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getGempaTerkini, getGempaM5, getGempaDirasakan, type GempaItem } from '@/lib/api';
import GempaCard from './_components/GempaCard';

type Tab = 'm5' | 'dirasakan';

export default function GempaBumiPage() {
  const [terkini, setTerkini] = useState<GempaItem | null>(null);
  const [m5, setM5] = useState<GempaItem[]>([]);
  const [dirasakan, setDirasakan] = useState<GempaItem[]>([]);
  const [tab, setTab] = useState<Tab>('m5');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getGempaTerkini(), getGempaM5(), getGempaDirasakan()])
      .then(([t, a, b]) => {
        setTerkini(t);
        setM5(a);
        setDirasakan(b);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Terjadi kesalahan'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
        <Loader2 size={18} className="animate-spin" /> Memuat data gempabumi...
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const list = tab === 'm5' ? m5 : dirasakan;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Gempabumi Terbaru</p>
        {terkini && <GempaCard data={terkini} highlight />}
        {terkini?.shakemap_url && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={terkini.shakemap_url}
              alt="Peta guncangan (shakemap)"
              className="max-w-md rounded-xl border border-slate-200"
            />
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab('m5')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'm5' ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            Gempabumi M 5.0+
          </button>
          <button
            onClick={() => setTab('dirasakan')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'dirasakan' ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            Gempabumi Dirasakan
          </button>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-slate-400">Tidak ada data.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {list.map((item, i) => (
              <GempaCard key={i} data={item} />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) — Data Gempabumi Terbuka.
      </p>
    </div>
  );
}