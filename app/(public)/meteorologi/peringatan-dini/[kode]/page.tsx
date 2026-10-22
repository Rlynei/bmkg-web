'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getPeringatanDetail, type PeringatanDetail } from '@/lib/api';
import { formatCapTime } from '@/lib/format';

// Leaflet mengakses `window`, jadi hanya boleh dimuat di browser
const AlertMap = dynamic(() => import('../_components/AlertMap'), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse rounded-xl bg-slate-100" />,
});

const URGENCY: Record<string, string> = {
  Immediate: 'Segera', Expected: 'Diperkirakan', Future: 'Akan datang', Past: 'Sudah lewat', Unknown: 'Tidak diketahui',
};
const SEVERITY: Record<string, string> = {
  Extreme: 'Ekstrem', Severe: 'Berat', Moderate: 'Sedang', Minor: 'Ringan', Unknown: 'Tidak diketahui',
};
const CERTAINTY: Record<string, string> = {
  Observed: 'Teramati', Likely: 'Kemungkinan besar', Possible: 'Mungkin', Unlikely: 'Kecil kemungkinan', Unknown: 'Tidak diketahui',
};
const SEVERITY_BADGE: Record<string, string> = {
  Extreme: 'bg-red-50 text-red-600',
  Severe: 'bg-red-50 text-red-600',
  Moderate: 'bg-amber-50 text-amber-600',
  Minor: 'bg-blue-50 text-blue-600',
};

export default function PeringatanDetailPage() {
  const params = useParams();
  const kode = params.kode as string;

  const [data, setData] = useState<PeringatanDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPeringatanDetail(kode)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Terjadi kesalahan'));
  }, [kode]);

  const polygons = useMemo(() => data?.areas.flatMap((a) => a.polygons) ?? [], [data]);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">{error}</p>
        <Link href="/meteorologi/peringatan-dini" className="mt-4 inline-block text-sm text-blue-900 hover:underline">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
        <Loader2 size={18} className="animate-spin" /> Memuat...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/meteorologi/peringatan-dini" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900">
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="mb-4 text-xl font-bold text-slate-900">{data.headline || data.event}</h1>

        <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600" title={data.urgency}>
            Urgensi: {URGENCY[data.urgency] ?? data.urgency}
          </span>
          <span
            className={`rounded-full px-3 py-1 ${SEVERITY_BADGE[data.severity] ?? 'bg-slate-100 text-slate-600'}`}
            title={data.severity}
          >
            Tingkat: {SEVERITY[data.severity] ?? data.severity}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600" title={data.certainty}>
            Kepastian: {CERTAINTY[data.certainty] ?? data.certainty}
          </span>
        </div>

        <dl className="mb-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Dimulai</dt>
            <dd className="text-slate-700">{formatCapTime(data.effective)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Berakhir</dt>
            <dd className="text-slate-700">{formatCapTime(data.expires)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Diterbitkan oleh</dt>
            <dd className="text-slate-700">{data.sender_name || '-'}</dd>
          </div>
        </dl>

        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{data.description}</p>
      </div>

      {polygons.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Peta wilayah terdampak</p>
          <AlertMap polygons={polygons} />
        </div>
      )}

      {data.web && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Infografik</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.web} alt="Infografik peringatan dini cuaca" className="max-w-full rounded-xl border border-slate-200" />
        </div>
      )}

      <p className="text-xs text-slate-400">
        Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) — Peringatan Dini Cuaca (CAP).
      </p>
    </div>
  );
}