import { Waves, Anchor, TriangleAlert, Ship } from 'lucide-react';

const LAYANAN = [
  { href: '/maritim/cuaca-perairan', icon: Waves, title: 'Prakiraan Cuaca Perairan', desc: 'Cuaca, angin, dan tinggi gelombang untuk seluruh wilayah perairan Indonesia.' },
  { href: '/maritim/cuaca-pelabuhan', icon: Anchor, title: 'Prakiraan Cuaca Pelabuhan', desc: 'Informasi cuaca spesifik untuk aktivitas pelabuhan.' },
  { href: '/maritim/gelombang-tinggi', icon: TriangleAlert, title: 'Peringatan Gelombang Tinggi', desc: 'Peringatan dini gelombang sedang hingga ekstrem.' },
  { href: '/maritim/info-nelayan', icon: Ship, title: 'Informasi untuk Nelayan', desc: 'Panduan keselamatan dan kondisi laut terkini.' },
];

export default function MaritimOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-900">Tentang Layanan Maritim</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Stasiun Meteorologi Maritim BMKG menyediakan informasi cuaca dan gelombang laut untuk mendukung
          keselamatan pelayaran, aktivitas perikanan, dan operasional pelabuhan.
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