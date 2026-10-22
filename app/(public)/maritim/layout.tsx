import SectionSidebar from '../_components/SectionSidebar';
import { Waves } from 'lucide-react';

const ITEMS = [
  { href: '/maritim/cuaca-perairan', label: 'Prakiraan Cuaca Perairan' },
  { href: '/maritim/cuaca-pelabuhan', label: 'Prakiraan Cuaca Pelabuhan' },
  { href: '/maritim/gelombang-tinggi', label: 'Peringatan Gelombang Tinggi' },
  { href: '/maritim/info-nelayan', label: 'Informasi untuk Nelayan' },
];

export default function MaritimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-teal-700 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><Waves size={28} /></span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">Layanan</p>
            <h1 className="mb-2 text-3xl font-bold">Maritim</h1>
            <p className="max-w-2xl text-sm text-blue-100">Informasi cuaca dan gelombang laut untuk keselamatan pelayaran dan nelayan.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionSidebar items={ITEMS} overviewHref="/maritim" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}