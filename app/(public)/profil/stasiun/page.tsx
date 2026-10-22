import Link from 'next/link';
import { Building2 } from 'lucide-react';

const STASIUN_LIST = [
  { href: '/profil/stasiun/meteorologi', emoji: '⛅', title: 'Stasiun Meteorologi', desc: 'Pengamatan cuaca, peringatan dini, dan informasi penerbangan.' },
  { href: '/profil/stasiun/maritim', emoji: '🌊', title: 'Stasiun Met. Maritim', desc: 'Informasi cuaca dan gelombang laut untuk pelayaran dan nelayan.' },
  { href: '/profil/stasiun/klimatologi', emoji: '🌡️', title: 'Stasiun Klimatologi', desc: 'Analisis iklim dan prakiraan musim hujan/kemarau.' },
  { href: '/profil/stasiun/geofisika', emoji: '🌍', title: 'Stasiun Geofisika', desc: 'Pemantauan gempa bumi, tsunami, dan magnet bumi.' },
];

export default function StasiunOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <Building2 size={20} />
          </span>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-900">Stasiun / UPT</p>
            <p className="text-sm leading-relaxed text-slate-600">
              BMKG memiliki beberapa Unit Pelaksana Teknis (UPT) yang tersebar sesuai bidang keahlian —
              meteorologi, maritim, klimatologi, dan geofisika — untuk memberikan layanan informasi yang
              akurat dan menyeluruh kepada masyarakat.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STASIUN_LIST.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-2xl">
              {item.emoji}
            </div>
            <p className="mb-1 font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}