import { Activity, Waves as TsunamiIcon, Zap, Compass } from 'lucide-react';

const LAYANAN = [
  { href: '/geofisika/gempabumi', icon: Activity, title: 'Gempabumi Terkini', desc: 'Informasi kejadian gempabumi real-time.' },
  { href: '/geofisika/peringatan-tsunami', icon: TsunamiIcon, title: 'Peringatan Dini Tsunami', desc: 'Sistem peringatan dini untuk wilayah pesisir.' },
  { href: '/geofisika/pemantauan-petir', icon: Zap, title: 'Pemantauan Petir', desc: 'Data aktivitas petir untuk keselamatan.' },
  { href: '/geofisika/data-magnet', icon: Compass, title: 'Data Magnet Bumi', desc: 'Pengukuran parameter magnet bumi.' },
];

export default function GeofisikaOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-800">Tentang Layanan Geofisika</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Stasiun Geofisika BMKG memantau aktivitas kegempaan, potensi tsunami, sambaran petir, dan parameter
          magnet bumi secara berkelanjutan untuk mendukung mitigasi bencana.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LAYANAN.map((item) => (
          <a key={item.href} href={item.href} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-slate-500"><item.icon size={20} /></span>
            <p className="mb-1 font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}