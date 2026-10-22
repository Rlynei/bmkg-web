import ProfilSidebar from '../_components/ProfilSidebar';
import { User } from 'lucide-react';

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
            <User size={28} />
          </span>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">BMKG</p>
            <h1 className="mb-2 text-3xl font-bold">Profil BMKG</h1>
            <p className="max-w-2xl text-sm text-blue-100">
              Mengenal lebih dekat Badan Meteorologi, Klimatologi, dan Geofisika — sejarah, visi, misi, dan unit kerja.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <ProfilSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}