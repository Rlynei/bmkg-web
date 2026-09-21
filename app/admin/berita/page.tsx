'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Newspaper, X } from 'lucide-react';
import {
  getBeritaList,
  createBerita,
  updateBerita,
  deleteBerita,
  type BeritaItem,
} from '@/lib/api';

type FilterStatus = 'all' | 'publish' | 'draft';
type ModalState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: BeritaItem };

export default function BeritaListPage() {
  const [items, setItems] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('bmkg_token') : null;

  async function loadData() {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await getBeritaList(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number, judul: string) {
    if (!token) return;
    if (!confirm(`Hapus "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteBerita(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Gagal menghapus data.');
    }
  }

  const filtered = items
    .filter((item) => filter === 'all' || item.status === filter)
    .filter((item) => item.judul.toLowerCase().includes(query.toLowerCase()));

  const total = items.length;
  const totalPublish = items.filter((i) => i.status === 'publish').length;
  const totalDraft = items.filter((i) => i.status === 'draft').length;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Berita</h1>
          <p className="text-sm text-slate-500">Kelola berita dan siaran pers resmi dari BMKG.</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          <Plus size={16} /> Tambah Baru
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-900"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'publish', 'draft'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === f ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'publish' ? 'Terbit' : 'Draf'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Total: {total}</span>
        <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-600">Terbit: {totalPublish}</span>
        <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-500">Draf: {totalDraft}</span>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">JUDUL / KATEGORI</th>
              <th className="px-4 py-3 font-medium">TANGGAL</th>
              <th className="px-4 py-3 font-medium">DILIHAT</th>
              <th className="px-4 py-3 font-medium">STATUS</th>
              <th className="px-4 py-3 font-medium">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Memuat data...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Tidak ada data.</td></tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{item.judul}</p>
                  {item.kategori && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                      <Newspaper size={12} /> {item.kategori}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(item.tanggal_publish).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-slate-500">{item.dilihat}x</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === 'publish' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status === 'publish' ? 'Terbit' : 'Draf'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModal({ mode: 'edit', item })} className="text-blue-600 hover:text-blue-800">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.judul)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.mode !== 'closed' && (
        <BeritaModal
          mode={modal.mode}
          item={modal.mode === 'edit' ? modal.item : undefined}
          onClose={() => setModal({ mode: 'closed' })}
          onSaved={() => {
            setModal({ mode: 'closed' });
            loadData();
          }}
        />
      )}
    </div>
  );
}

function BeritaModal({
  mode,
  item,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  item?: BeritaItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('bmkg_token');
    if (!token) return;

    const formData = new FormData(e.currentTarget);

    try {
      if (mode === 'create') {
        await createBerita(token, formData);
      } else if (item) {
        if (!(formData.get('thumbnail') as File)?.size) formData.delete('thumbnail');
        await updateBerita(token, item.id, formData);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'Tambah Berita' : 'Edit Berita'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Judul">
            <input name="judul" defaultValue={item?.judul} required className="input" placeholder="Masukkan judul..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori (opsional)">
              <input name="kategori" defaultValue={item?.kategori ?? ''} className="input" placeholder="cth: Humas BMKG" />
            </Field>
            <Field label="Tanggal Publish">
              <input
                type="date"
                name="tanggal_publish"
                defaultValue={item?.tanggal_publish?.slice(0, 10)}
                required
                className="input"
              />
            </Field>
          </div>

          <Field label="Isi Berita">
            <textarea
              name="isi"
              defaultValue={item?.isi ?? ''}
              rows={6}
              required
              className="input"
              placeholder="Tulis isi berita lengkap..."
            />
          </Field>

          <Field label="Thumbnail (opsional)">
            <input type="file" name="thumbnail" accept="image/*" className="input" />
          </Field>

          <Field label="Status">
            <select name="status" defaultValue={item?.status ?? 'draft'} required className="input">
              <option value="draft">Draf</option>
              <option value="publish">Terbit</option>
            </select>
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-2 text-sm text-slate-600">
              Batal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60">
              {loading ? 'Menyimpan...' : mode === 'create' ? 'Tambah Berita' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium tracking-wide text-slate-500">{label.toUpperCase()}</label>
      {children}
    </div>
  );
}