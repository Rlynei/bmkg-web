'use client';

import { useEffect, useState } from 'react';
import { Search, Droplets, Wind, Cloud, Eye, MapPin, Loader2 } from 'lucide-react';
import { searchWilayah, getCuacaDetail, type WilayahItem, type CuacaData, type CuacaSlot } from '@/lib/api';

// Nama file ikon dari BMKG mengandung spasi (mis. "cerah berawan-am.svg"), jadi di-encode dulu
function iconUrl(url: string) {
  return url.replace(/ /g, '%20');
}

function dayLabel(slots: CuacaSlot[]) {
  const first = slots[0]?.local_datetime;
  if (!first) return '-';
  return new Date(first.replace(' ', 'T')).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
}

export default function PrakiraanCuacaWilayahPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WilayahItem[]>([]);
  const [cuaca, setCuaca] = useState<CuacaData | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchWilayah(query).then(setResults).catch(() => setResults([]));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleSelect(item: WilayahItem) {
    setResults([]);
    setQuery('');
    setDayIndex(0);
    setLoading(true);
    setError(null);
    try {
      setCuaca(await getCuacaDetail(item.kode_adm4));
    } catch (err) {
      setCuaca(null);
      setError(err instanceof Error ? err.message : 'Gagal memuat cuaca');
    } finally {
      setLoading(false);
    }
  }

  const days = cuaca?.data?.[0]?.cuaca ?? [];
  const slots = days[dayIndex] ?? [];
  const lokasi = cuaca?.lokasi;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-900">Prakiraan Cuaca Wilayah</p>
        <p className="mb-4 text-sm text-slate-600">
          Cari kelurahan atau kecamatan untuk melihat prakiraan cuaca 3 hari ke depan, per 3 jam.
        </p>

        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kelurahan/kecamatan, cth: Cipinang..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-900"
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="font-medium">{item.nama_kelurahan}</span>
                  <span className="text-slate-400"> — {item.nama_kecamatan}, {item.nama_kabupaten}, {item.nama_provinsi}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
          <Loader2 size={18} className="animate-spin" /> Memuat cuaca...
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !cuaca && !error && (
        <p className="py-6 text-center text-sm text-slate-400">
          Belum ada wilayah dipilih. (coba &ldquo;Cipinang&rdquo; atau &ldquo;Rawa&rdquo;).
        </p>
      )}

      {lokasi && !loading && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-blue-900">
                <MapPin size={18} />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{lokasi.desa}</p>
                <p className="text-sm text-slate-500">
                  Kec. {lokasi.kecamatan} · {lokasi.kotkab} · {lokasi.provinsi}
                </p>
                {lokasi.lat != null && lokasi.lon != null && (
                  <p className="mt-1 text-xs text-slate-400">
                    Koordinat: {lokasi.lat}, {lokasi.lon}
                    {lokasi.timezone ? ` · ${lokasi.timezone}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setDayIndex(i)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  dayIndex === i ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {dayLabel(d)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {slots.map((slot) => (
              <div key={slot.local_datetime} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-center text-sm font-semibold text-slate-900">
                  {slot.local_datetime.slice(11, 16)}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconUrl(slot.image)} alt={slot.weather_desc} className="mx-auto my-2 h-12 w-12" />
                <p className="text-center text-2xl font-bold text-slate-900">{slot.t}°C</p>
                <p className="mb-3 text-center text-xs text-slate-500">{slot.weather_desc}</p>

                <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5"><Droplets size={13} /> Kelembapan {slot.hu}%</p>
                  <p className="flex items-center gap-1.5"><Wind size={13} /> {slot.ws} km/j dari {slot.wd}</p>
                  <p className="flex items-center gap-1.5"><Cloud size={13} /> Awan {slot.tcc}%</p>
                  <p className="flex items-center gap-1.5"><Eye size={13} /> Jarak pandang {slot.vs_text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-slate-400">
        Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika). Data diperbarui 2 kali sehari.
      </p>
    </div>
  );
}