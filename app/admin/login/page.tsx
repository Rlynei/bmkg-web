// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api';

const DEMO_ACCOUNTS = [
  { username: 'superadmin', password: 'bmkg2024', role: 'Super Admin', color: 'text-rose-600' },
  { username: 'admin', password: 'admin123', role: 'Admin', color: 'text-amber-600' },
  { username: 'editor.jurnal', password: 'editor123', role: 'Editor', color: 'text-slate-500' },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, token } = await loginAdmin(username, password);
      localStorage.setItem('bmkg_token', token);
      localStorage.setItem('bmkg_user', JSON.stringify(user));
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoUsername: string, demoPassword: string) {
    setUsername(demoUsername);
    setPassword(demoPassword);
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Panel kiri — branding */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-teal-700 px-8 py-10 text-white lg:w-1/2 lg:px-16 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-900" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight">BMKG</p>
            <p className="text-xs text-white/70 leading-tight">
              Badan Meteorologi, Klimatologi, dan Geofisika
            </p>
          </div>
        </div>

        <div className="max-w-md">
          <p className="mb-3 text-xs tracking-widest text-white/60">ADMIN PORTAL</p>
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight lg:text-5xl">
            Sistem Manajemen Publikasi BMKG
          </h1>
          <p className="text-white/75 leading-relaxed">
            Platform terpadu untuk mengelola jurnal ilmiah, buletin, berita, dan
            kegiatan resmi Badan Meteorologi, Klimatologi, dan Geofisika.
          </p>
        </div>

        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} BMKG — Hak Cipta Dilindungi
        </p>
      </div>

      {/* Panel kanan — form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">Masuk ke Akun</h2>
          <p className="mb-8 text-sm text-slate-500">
            Masukkan kredensial Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-medium tracking-wide text-slate-500">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium tracking-wide text-slate-500">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-900 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs tracking-wide text-slate-400">AKUN DEMO</p>
            <ul className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <li key={acc.username} className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => fillDemo(acc.username, acc.password)}
                    className="font-mono text-slate-700 hover:underline"
                  >
                    {acc.username} / {acc.password}
                  </button>
                  <span className={`text-xs ${acc.color}`}>{acc.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}