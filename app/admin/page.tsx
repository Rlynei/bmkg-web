// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, BookOpen, Newspaper, CalendarDays } from 'lucide-react';
import { getDashboardStats, type DashboardStats } from '@/lib/api';

const CARD_META = [
  { key: 'jurnal_artikel', href: '/admin/jurnal-artikel', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600' },
  { key: 'bulletin', href: '/admin/bulletin', icon: BookOpen, bg: 'bg-teal-50', text: 'text-teal-600' },
  { key: 'berita', href: '/admin/berita', icon: Newspaper, bg: 'bg-amber-50', text: 'text-amber-600' },
  { key: 'kegiatan', href: '/admin/kegiatan', icon: CalendarDays, bg: 'bg-purple-50', text: 'text-purple-600' },
] as const;

const BADGE_KATEGORI: Record<string, string> = {
  'Jurnal & Artikel': 'bg-blue-50 text-blue-600',
  Bulletin: 'bg-teal-50 text-teal-600',
  Berita: 'bg-amber-50 text-amber-600',
  Kegiatan: 'bg-purple-50 text-purple-600',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bmkg_token');
    if (!token) return;

    getDashboardStats(token)
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-sm text-slate-400">Memuat data...</p>;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_META.map(({ key, icon: Icon, bg, text }) => {
          const data = stats.counts[key];
          return (
            <div key={key} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <p className="text-xs tracking-wide text-slate-400">{data.label.toUpperCase()}</p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${text}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{data.total}</p>
              <p className="text-xs text-slate-400">{data.publish} terbit</p>
            </div>
          );
        })}
      </div>

      {/* Akses cepat */}
      <div>
        <p className="mb-3 text-xs tracking-wide text-slate-400">AKSES CEPAT</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARD_META.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{stats.counts[key].label}</p>
                <p className="text-xs text-slate-400">Kelola {stats.counts[key].label.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Publikasi terbaru */}
      <div>
        <p className="mb-3 text-xs tracking-wide text-slate-400">PUBLIKASI TERBARU</p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">JUDUL</th>
                <th className="px-4 py-3 font-medium">KATEGORI</th>
                <th className="px-4 py-3 font-medium">STATUS</th>
                <th className="px-4 py-3 font-medium">TANGGAL</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{item.judul}</p>
                    <p className="text-xs text-slate-400">{item.subjudul}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${BADGE_KATEGORI[item.kategori]}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === 'publish'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status === 'publish' ? 'Terbit' : 'Draf'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}