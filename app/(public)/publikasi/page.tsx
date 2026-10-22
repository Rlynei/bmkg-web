import Link from 'next/link';
import { FileText, BookOpen, Newspaper } from 'lucide-react';
import ProfilSidebar from '../_components/ProfilSidebar';

const PUBLIKASI_LIST = [
  { href: '/publikasi/jurnal-artikel', icon: FileText, title: 'Jurnal & Artikel', desc: 'Publikasi ilmiah dan artikel hasil penelitian.' },
  { href: '/publikasi/bulletin', icon: BookOpen, title: 'Bulletin', desc: 'Buletin berkala cuaca, iklim, maritim, dan geofisika.' },
];

export default function PublikasiOverviewPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">Profil</p>
          <h1 className="mb-2 text-3xl font-bold">Publikasi</h1>
          <p className="max-w-2xl text-sm text-blue-100">
            Kumpulan publikasi ilmiah dan berkala yang diterbitkan BMKG.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <ProfilSidebar />

          <div className="flex-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Newspaper size={20} />
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  BMKG menerbitkan berbagai publikasi untuk mendukung transparansi data dan edukasi publik,
                  mulai dari jurnal ilmiah hasil penelitian hingga buletin berkala tentang kondisi cuaca dan iklim terkini.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PUBLIKASI_LIST.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900"
                >
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <item.icon size={20} />
                  </span>
                  <p className="mb-1 font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}