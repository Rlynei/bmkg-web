import { CloudSun, Plane, TriangleAlert, Radar } from 'lucide-react';

const LAYANAN = [
  { href: '/meteorologi/prakiraan-cuaca-wilayah', icon: CloudSun, title: 'Prakiraan Cuaca Wilayah', desc: 'Prakiraan cuaca 3 harian per kelurahan/desa, per 3 jam.' },
  { href: '/meteorologi/cuaca-penerbangan', icon: Plane, title: 'Cuaca Penerbangan', desc: 'Informasi cuaca bandar udara untuk keselamatan penerbangan.' },
  { href: '/meteorologi/peringatan-dini', icon: TriangleAlert, title: 'Peringatan Dini Cuaca', desc: 'Peringatan cuaca ekstrem (nowcast) level kecamatan.' },
  { href: '/meteorologi/citra-satelit', icon: Radar, title: 'Citra Satelit & Radar', desc: 'Citra satelit Himawari dan komposit radar cuaca.' },
];

export default function MeteorologiOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-900">Tentang Layanan Meteorologi</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Stasiun Meteorologi BMKG melaksanakan pengamatan cuaca secara terus-menerus untuk menghasilkan
          prakiraan cuaca yang akurat, peringatan dini cuaca ekstrem, serta informasi cuaca penerbangan.
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