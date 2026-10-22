'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { getPublicBulletinBySlug, getFileUrl, JENIS_LABEL, type PublicBulletin } from '@/lib/api';

export default function BulletinDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [item, setItem] = useState<PublicBulletin | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicBulletinBySlug(slug)
      .then(setItem)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-slate-500">Bulletin tidak ditemukan.</p>
        <Link href="/publikasi/bulletin" className="mt-4 inline-block text-sm text-blue-900 hover:underline">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  if (!item) return <p className="px-6 py-20 text-center text-sm text-slate-400">Memuat...</p>;

  const thumb = getFileUrl(item.thumbnail);
  const pdfUrl = getFileUrl(item.file_pdf);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/publikasi/bulletin" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900">
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={item.judul} className="h-full w-full object-cover" />
        ) : (
          <BookOpen size={56} className="text-slate-300" />
        )}
      </div>

      <span className="mb-3 inline-block rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-600">
        {JENIS_LABEL[item.jenis]}
      </span>

      <h1 className="mb-3 text-2xl font-bold text-slate-900">{item.judul}</h1>

      <p className="mb-6 flex items-center gap-1 text-sm text-slate-500">
        <Calendar size={14} /> Periode: {item.periode}
      </p>

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
        >
          <Download size={16} /> Unduh PDF
        </a>
      )}
    </div>
  );
}