import SectionSidebar from '../_components/SectionSidebar';
import { CloudSun } from 'lucide-react';

const ITEMS = [
  { href: '/meteorologi/prakiraan-cuaca-wilayah', label: 'Prakiraan Cuaca Wilayah' },
  { href: '/meteorologi/cuaca-penerbangan', label: 'Cuaca Penerbangan' },
  { href: '/meteorologi/peringatan-dini', label: 'Peringatan Dini Cuaca' },
  { href: '/meteorologi/citra-satelit', label: 'Citra Satelit & Radar' },
];

export default function MeteorologiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-sky-800 to-blue-600 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10"><CloudSun size={28} /></span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-200">Layanan</p>
            <h1 className="mb-2 text-3xl font-bold">Meteorologi</h1>
            <p className="max-w-2xl text-sm text-sky-100">Prakiraan cuaca wilayah, peringatan dini, citra satelit, dan informasi cuaca penerbangan.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <SectionSidebar items={ITEMS} overviewHref="/meteorologi" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}