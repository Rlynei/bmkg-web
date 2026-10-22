'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Newspaper } from 'lucide-react';
import { getPublicBeritaBySlug, getFileUrl, type PublicBerita } from '@/lib/api';

export default function BeritaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [item, setItem] = useState<PublicBerita | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicBeritaBySlug(slug).then(setItem).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-slate-500">Berita tidak ditemukan.</p>
        <Link href="/berita-kegiatan" className="mt-4 inline-block text-sm text-blue-900 hover:underline">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  if (!item) return <p className="px-6 py-20 text-center text-sm text-slate-400">Memuat...</p>;

  const thumb = getFileUrl(item.thumbnail);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/berita-kegiatan" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900">
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <div className="mb-6 flex h-64 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={item.judul} className="h-full w-full object-cover" />
        ) : (
          <Newspaper size={56} className="text-slate-300" />
        )}
      </div>

      {item.kategori && (
        <span className="mb-3 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
          {item.kategori}
        </span>
      )}

      <h1 className="mb-3 text-2xl font-bold text-slate-900">{item.judul}</h1>

      <div className="mb-8 flex items-center gap-5 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(item.tanggal_publish).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} /> {item.dilihat} dilihat
        </span>
      </div>

      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{item.isi}</div>
    </div>
  );
}