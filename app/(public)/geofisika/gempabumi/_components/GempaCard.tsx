import { MapPin, Clock, Ruler, Waves } from 'lucide-react';
import type { GempaItem } from '@/lib/api';

export default function GempaCard({ data, highlight = false }: { data: GempaItem; highlight?: boolean }) {
  //const potensiTsunami = data.potensi && !/tidak berpotensi/i.test(data.potensi);
  const potensiTsunami = data.potensi
  ? /tsunami/i.test(data.potensi) && !/tidak berpotensi/i.test(data.potensi)
  : false;

  return (
    <div className={`rounded-xl border bg-white p-5 ${highlight ? 'border-red-200' : 'border-slate-200'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            M {data.magnitude?.toFixed(1) ?? '-'}
          </p>
          <p className="text-sm text-slate-600">{data.wilayah ?? 'Wilayah tidak diketahui'}</p>
        </div>
        {potensiTsunami && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            <Waves size={12} /> Berpotensi Tsunami
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <p className="flex items-center gap-1.5"><Clock size={13} /> {data.tanggal}, {data.jam}</p>
        <p className="flex items-center gap-1.5"><Ruler size={13} /> Kedalaman {data.kedalaman}</p>
        <p className="flex items-center gap-1.5 col-span-2"><MapPin size={13} /> {data.lintang}, {data.bujur}</p>
      </div>
      
      {data.potensi && !potensiTsunami && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">{data.potensi}</p>
        )}

      {data.dirasakan && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Dirasakan:</span> {data.dirasakan}
        </p>
      )}
    </div>
  );
}