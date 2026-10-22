import Link from 'next/link';
import { Landmark, Target, ClipboardList, Building2, Newspaper, Megaphone, User } from 'lucide-react';

const QUICK_LINKS = [
  { href: '/profil/sejarah', icon: Landmark, title: 'Sejarah', desc: 'Perjalanan panjang BMKG', color: 'bg-orange-50 text-orange-600' },
  { href: '/profil/visi-misi', icon: Target, title: 'Visi & Misi', desc: 'Tujuan dan arah kebijakan', color: 'bg-blue-50 text-blue-600' },
  { href: '/profil/tugas-fungsi', icon: ClipboardList, title: 'Tugas & Fungsi', desc: 'Layanan dan kewenangan', color: 'bg-slate-100 text-slate-600' },
  { href: '/profil/stasiun', icon: Building2, title: 'Stasiun/UPT', desc: 'Unit pelaksana teknis', color: 'bg-sky-50 text-sky-600' },
  { href: '/publikasi/jurnal-artikel', icon: Newspaper, title: 'Publikasi', desc: 'Jurnal, artikel & bulletin', color: 'bg-teal-50 text-teal-600' },
  { href: '/berita-kegiatan', icon: Megaphone, title: 'Berita', desc: 'Kegiatan terkini BMKG', color: 'bg-rose-50 text-rose-600' },
];

{QUICK_LINKS.map((item) => (
  <Link
    key={item.href}
    href={item.href}
    className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900"
  >
    <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
      <item.icon size={20} />
    </span>
    <p className="font-semibold text-slate-900">{item.title}</p>
    <p className="text-sm text-slate-500">{item.desc}</p>
  </Link>
))}

export default function ProfilOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <User size={22} />
          </span>
          <div>
            <h1 className="mb-2 text-lg font-bold text-slate-900">Tentang BMKG</h1>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) mengemban tugas memberikan
              pelayanan informasi meteorologi, klimatologi, kualitas udara, dan geofisika kepada
              masyarakat dan pemangku kepentingan.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Gak tau mau isi apa nanti aja dipikirin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-900"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <item.icon size={20} />
            </span>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}