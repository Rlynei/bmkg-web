import SectionSidebar from '../_components/SectionSidebar';
import { Activity } from 'lucide-react';

const ITEMS = [
  { href: '/geofisika/gempabumi', label: 'Gempabumi Terkini' },
  { href: '/geofisika/peringatan-tsunami', label: 'Peringatan Dini Tsunami' },
  { href: '/geofisika/pemantauan-petir', label: 'Pemantauan Petir' },
  { href: '/geofisika/data-magnet', label: 'Data Magnet Bumi' },
];

export default function GeofisikaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-orange-800 to-red-600 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><Activity size={28} /></span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-200">Layanan</p>
            <h1 className="mb-2 text-3xl font-bold">Geofisika</h1>
            <p className="max-w-2xl text-sm text-orange-100">Gempa bumi, tsunami, petir, dan magnet bumi.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionSidebar items={ITEMS} overviewHref="/geofisika" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}