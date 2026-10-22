import { CloudRain, LineChart, Wind, Thermometer } from 'lucide-react';

const LAYANAN = [
  { href: '/klimatologi/prakiraan-musim', icon: CloudRain, title: 'Prakiraan Musim', desc: 'Prakiraan awal musim hujan dan kemarau per zona musim.' },
  { href: '/klimatologi/curah-hujan', icon: LineChart, title: 'Analisis Curah Hujan', desc: 'Data curah hujan bulanan dan dasarian per wilayah.' },
  { href: '/klimatologi/kualitas-udara', icon: Wind, title: 'Kualitas Udara', desc: 'Pemantauan indeks kualitas udara di berbagai titik.' },
  { href: '/klimatologi/data-historis', icon: Thermometer, title: 'Data Iklim Historis', desc: 'Arsip data iklim jangka panjang.' },
];

export default function KlimatologiOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">Tentang Layanan Klimatologi</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Stasiun Klimatologi BMKG menganalisis data iklim jangka panjang untuk memprakirakan musim,
          menyediakan informasi curah hujan, serta memantau kualitas udara.
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