'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/profil', label: 'Overview', icon: LayoutGrid },
  { href: '/profil/sejarah', label: 'Sejarah' },
  { href: '/profil/visi-misi', label: 'Visi & Misi' },
  {
    href: '/profil/tugas-fungsi',
    label: 'Tugas & Fungsi',
    children: [
      { href: '/profil/stasiun/meteorologi', label: 'Stasiun Meteorologi' },
      { href: '/profil/stasiun/maritim', label: 'Stasiun Met. Maritim' },
      { href: '/profil/stasiun/klimatologi', label: 'Stasiun Klimatologi' },
      { href: '/profil/stasiun/geofisika', label: 'Stasiun Geofisika' },
    ],
  },
  { href: '/publikasi/jurnal-artikel', label: 'Jurnal & Artikel' },
  { href: '/publikasi/bulletin', label: 'Bulletin' },
  { href: '/berita-kegiatan', label: 'Berita & Kegiatan' },
];

export default function ProfilSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 self-start rounded-xl border border-slate-200 bg-white p-2 lg:sticky lg:top-24 lg:w-64">
      {SIDEBAR_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${
                active ? 'bg-blue-900 font-medium text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </Link>
            {item.children && (
              <div className="ml-4 border-l border-slate-100 pl-2">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-lg px-4 py-2 text-sm ${
                        childActive ? 'font-medium text-blue-900' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}