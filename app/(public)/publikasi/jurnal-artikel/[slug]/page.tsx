'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, Download, ArrowLeft, FileText } from 'lucide-react';
import { getPublicJurnalArtikelBySlug, getFileUrl, type PublicJurnalArtikel } from '@/lib/api';

export default function JurnalArtikelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [item, setItem] = useState<PublicJurnalArtikel | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicJurnalArtikelBySlug(slug)
      .then(setItem)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-slate-500">Publikasi tidak ditemukan.</p>
        <Link href="/publikasi/jurnal-artikel" className="mt-4 inline-block text-sm text-blue-900 hover:underline">
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
      <Link href="/publikasi/jurnal-artikel" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-900">
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={item.judul} className="h-full w-full object-cover" />
        ) : (
          <FileText size={56} className="text-slate-300" />
        )}
      </div>

      <h1 className="mb-3 text-2xl font-bold text-slate-900">{item.judul}</h1>

      <div className="mb-6 flex flex-wrap items-center gap-5 text-sm text-slate-500">
        <span>Oleh <strong className="text-slate-700">{item.penulis}</strong></span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(item.tanggal_terbit).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} /> {item.dilihat} dilihat
        </span>
      </div>

      {item.abstrak && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Abstrak</p>
          <p className="text-sm leading-relaxed text-slate-600">{item.abstrak}</p>
        </div>
      )}

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