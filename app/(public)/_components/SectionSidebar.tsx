'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';

type Item = { href: string; label: string };

export default function SectionSidebar({ items, overviewHref }: { items: Item[]; overviewHref: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 self-start rounded-xl border border-slate-200 bg-white p-2 lg:sticky lg:top-24 lg:w-64">
      <Link
        href={overviewHref}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${
          pathname === overviewHref ? 'bg-blue-900 font-medium text-white' : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        <LayoutGrid size={16} /> Overview
      </Link>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-4 py-2.5 text-sm ${
              active ? 'bg-blue-900 font-medium text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}