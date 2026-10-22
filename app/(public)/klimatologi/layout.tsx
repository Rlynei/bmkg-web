import SectionSidebar from '../_components/SectionSidebar';
import { Thermometer } from 'lucide-react';

const ITEMS = [
  { href: '/klimatologi/prakiraan-musim', label: 'Prakiraan Musim' },
  { href: '/klimatologi/curah-hujan', label: 'Analisis Curah Hujan' },
  { href: '/klimatologi/kualitas-udara', label: 'Kualitas Udara' },
  { href: '/klimatologi/data-historis', label: 'Data Iklim Historis' },
];

export default function KlimatologiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-800 to-teal-600 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><Thermometer size={28} /></span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">Layanan</p>
            <h1 className="mb-2 text-3xl font-bold">Klimatologi</h1>
            <p className="max-w-2xl text-sm text-emerald-100">Prakiraan musim, analisis curah hujan, dan data kualitas udara.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionSidebar items={ITEMS} overviewHref="/klimatologi" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}