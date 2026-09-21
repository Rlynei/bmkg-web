// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid, FileText, BookOpen, Newspaper, CalendarDays, Users, LogOut,
} from 'lucide-react';
import type { AdminUser } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/jurnal-artikel', label: 'Jurnal & Artikel', icon: FileText },
  { href: '/admin/bulletin', label: 'Bulletin', icon: BookOpen },
  { href: '/admin/berita', label: 'Berita', icon: Newspaper },
  { href: '/admin/kegiatan', label: 'Kegiatan', icon: CalendarDays },
];

const ROLE_LABEL: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    const stored = localStorage.getItem('bmkg_user');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    setUser(JSON.parse(stored));
    setChecked(true);
  }, [router, isLoginPage]);

  // Halaman login: render langsung tanpa sidebar/topbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked || !user) return null;

  const currentLabel = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col justify-between bg-slate-900 text-white">
        <div>
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-sm font-semibold">BMKG</p>
            <p className="text-xs text-white/50">Admin Portal</p>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-white/10 font-medium text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {user.role === 'superadmin' && (
            <div className="px-3 pt-2">
              <p className="px-3 pb-2 text-xs tracking-wide text-white/40">ADMINISTRASI</p>
              <Link
              href="/admin/pengguna"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                pathname === '/admin/pengguna'
                ? 'bg-white/10 font-medium text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              >
                <Users size={18} />
                Pengguna
                </Link>
                </div>
              )}
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-400 text-sm font-semibold text-white">
            {user.name.charAt(0)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-rose-400">{ROLE_LABEL[user.role]}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('bmkg_token');
              localStorage.removeItem('bmkg_user');
              router.push('/admin/login');
            }}
            aria-label="Logout"
            className="text-white/50 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-500">
            Beranda / <span className="font-medium text-slate-900">{currentLabel}</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
              {ROLE_LABEL[user.role]}
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-400 text-sm font-semibold text-white">
              {user.name.charAt(0)}
            </span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}