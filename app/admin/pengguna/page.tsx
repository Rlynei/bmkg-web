'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Pencil, Trash2, X, ShieldCheck, Settings, PenLine } from 'lucide-react';
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  type UserItem,
  type AdminUser,
} from '@/lib/api';

type FilterRole = 'all' | 'superadmin' | 'admin' | 'editor';
type ModalState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: UserItem };

const ROLE_META = {
  superadmin: { label: 'Super Admin', icon: ShieldCheck, badge: 'bg-rose-50 text-rose-600' },
  admin: { label: 'Admin', icon: Settings, badge: 'bg-blue-50 text-blue-600' },
  editor: { label: 'Editor', icon: PenLine, badge: 'bg-emerald-50 text-emerald-600' },
} as const;

export default function PenggunaListPage() {
  const router = useRouter();
  const [me, setMe] = useState<AdminUser | null>(null);
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterRole>('all');
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('bmkg_token') : null;

  useEffect(() => {
    const stored = localStorage.getItem('bmkg_user');
    if (stored) setMe(JSON.parse(stored));
  }, []);

  async function loadData() {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await getUserList(token));
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

  // Halaman ini khusus Super Admin — kalau bukan, tendang keluar
  useEffect(() => {
    if (me && me.role !== 'superadmin') {
      router.push('/admin');
    }
  }, [me, router]);

  async function handleDelete(id: number, name: string) {
    if (!token) return;
    if (!confirm(`Hapus akun "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteUser(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus pengguna.');
    }
  }

  async function handleToggleActive(item: UserItem) {
    if (!token) return;
    try {
      const updated = await updateUser(token, item.id, { is_active: !item.is_active });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch {
      alert('Gagal mengubah status akun.');
    }
  }

  const filtered = items
    .filter((item) => filter === 'all' || item.role === filter)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.username.toLowerCase().includes(query.toLowerCase())
    );

  if (!me || me.role !== 'superadmin') return null;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500">Kelola akun dan hak akses pengguna sistem.</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau username..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-900"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'superadmin', 'admin', 'editor'] as FilterRole[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === f ? 'bg-blue-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {f === 'all' ? 'Semua' : ROLE_META[f].label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">PENGGUNA</th>
              <th className="px-4 py-3 font-medium">ROLE</th>
              <th className="px-4 py-3 font-medium">STATUS</th>
              <th className="px-4 py-3 font-medium">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Memuat data...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Tidak ada data.</td></tr>
            )}
            {filtered.map((item) => {
              const meta = ROLE_META[item.role];
              const isMe = item.id === me.id;
              return (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-400 text-sm font-semibold text-white">
                        {item.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">
                          {item.name} {isMe && <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">Anda</span>}
                        </p>
                        <p className="text-xs text-slate-400">@{item.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}>
                      <meta.icon size={12} /> {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => !isMe && handleToggleActive(item)}
                      disabled={isMe}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      } ${isMe ? 'cursor-not-allowed opacity-60' : 'hover:opacity-80'}`}
                    >
                      {item.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModal({ mode: 'edit', item })} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={16} />
                      </button>
                      {!isMe && (
                        <button onClick={() => handleDelete(item.id, item.name)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal.mode !== 'closed' && (
        <UserModal
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

function UserModal({
  mode,
  item,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  item?: UserItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [role, setRole] = useState<UserItem['role']>(item?.role ?? 'admin');
  const [isActive, setIsActive] = useState(item?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('bmkg_token');
    if (!token) return;

    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      name: form.get('name'),
      email: form.get('email'),
      username: form.get('username'),
      role,
      is_active: isActive,
    };
    const password = form.get('password') as string;
    if (password) payload.password = password;

    try {
      if (mode === 'create') {
        await createUser(token, payload);
      } else if (item) {
        await updateUser(token, item.id, payload);
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
            {mode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Lengkap">
              <input name="name" defaultValue={item?.name} required className="input" placeholder="Nama lengkap..." />
            </Field>
            <Field label="Email">
              <input type="email" name="email" defaultValue={item?.email} required className="input" placeholder="email@bmkg.go.id" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Username">
              <input name="username" defaultValue={item?.username} required className="input" placeholder="username..." />
            </Field>
            <Field label={mode === 'edit' ? 'Password (kosongkan jika tetap)' : 'Password'}>
              <input type="password" name="password" required={mode === 'create'} className="input" placeholder="Password..." />
            </Field>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-slate-500">ROLE</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(ROLE_META) as UserItem['role'][]).map((r) => {
                const meta = ROLE_META[r];
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm ${
                      active ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <meta.icon size={18} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <span className="text-xs font-medium tracking-wide text-slate-500">STATUS AKUN</span>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  isActive ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-2 text-sm text-slate-600">
              Batal
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60">
              {loading ? 'Menyimpan...' : mode === 'create' ? 'Tambah Pengguna' : 'Simpan Perubahan'}
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