const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export type AdminUser = {
  id: number;
  name: string;
  username: string;
  role: 'superadmin' | 'admin' | 'editor';
};

export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data.errors?.username?.[0] || data.message || 'Username atau password salah.';
    throw new Error(message);
  }

  return data as { user: AdminUser; token: string };
}

export type DashboardStats = {
  counts: Record<
    'jurnal_artikel' | 'bulletin' | 'berita' | 'kegiatan',
    { label: string; total: number; publish: number }
  >;
  recent: {
    judul: string;
    subjudul: string;
    kategori: string;
    status: 'draft' | 'publish';
    tanggal: string;
  }[];
};

export async function getDashboardStats(token: string) {
  const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Gagal memuat statistik dashboard');
  return (await res.json()) as DashboardStats;
}
export type JurnalArtikel = {
  id: number;
  judul: string;
  slug: string;
  penulis: string;
  abstrak: string | null;
  file_pdf: string;
  thumbnail: string | null;
  tanggal_terbit: string;
  status: 'draft' | 'publish';
  dilihat: number;
};

export async function getJurnalArtikelList(token: string) {
  const res = await fetch(`${API_URL}/admin/jurnal-artikel?per_page=100`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data jurnal & artikel');
  const json = await res.json();
  return json.data as JurnalArtikel[];
}

export async function createJurnalArtikel(token: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/jurnal-artikel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
  return data as JurnalArtikel;
}

export async function updateJurnalArtikel(token: string, id: number, formData: FormData) {
  formData.append('_method', 'PUT'); // Laravel method-spoofing, wajib untuk PUT + file upload
  const res = await fetch(`${API_URL}/admin/jurnal-artikel/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data');
  return data as JurnalArtikel;
}

export async function deleteJurnalArtikel(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/jurnal-artikel/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal menghapus data');
  return res.json();
}
export type BulletinItem = {
  id: number;
  judul: string;
  slug: string;
  jenis: 'cuaca' | 'iklim' | 'geofisika' | 'maritim';
  periode: string;
  file_pdf: string;
  thumbnail: string | null;
  status: 'draft' | 'publish';
};

export async function getBulletinList(token: string) {
  const res = await fetch(`${API_URL}/admin/bulletin?per_page=100`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data bulletin');
  const json = await res.json();
  return json.data as BulletinItem[];
}

export async function createBulletin(token: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/bulletin`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
  return data as BulletinItem;
}

export async function updateBulletin(token: string, id: number, formData: FormData) {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_URL}/admin/bulletin/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data');
  return data as BulletinItem;
}

export async function deleteBulletin(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/bulletin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal menghapus data');
  return res.json();
}
export type BeritaItem = {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  thumbnail: string | null;
  kategori: string | null;
  tanggal_publish: string;
  status: 'draft' | 'publish';
  dilihat: number;
};

export async function getBeritaList(token: string) {
  const res = await fetch(`${API_URL}/admin/berita?per_page=100`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data berita');
  const json = await res.json();
  return json.data as BeritaItem[];
}

export async function createBerita(token: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/berita`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
  return data as BeritaItem;
}

export async function updateBerita(token: string, id: number, formData: FormData) {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_URL}/admin/berita/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data');
  return data as BeritaItem;
}

export async function deleteBerita(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/berita/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal menghapus data');
  return res.json();
}
export type KegiatanItem = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  lokasi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  thumbnail: string | null;
  status: 'draft' | 'publish';
};

export async function getKegiatanList(token: string) {
  const res = await fetch(`${API_URL}/admin/kegiatan?per_page=100`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data kegiatan');
  const json = await res.json();
  return json.data as KegiatanItem[];
}

export async function createKegiatan(token: string, formData: FormData) {
  const res = await fetch(`${API_URL}/admin/kegiatan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
  return data as KegiatanItem;
}

export async function updateKegiatan(token: string, id: number, formData: FormData) {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_URL}/admin/kegiatan/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data');
  return data as KegiatanItem;
}

export async function deleteKegiatan(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/kegiatan/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal menghapus data');
  return res.json();
}
export type UserItem = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  is_active: boolean;
  created_at: string;
};

export async function getUserList(token: string) {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data pengguna');
  return (await res.json()) as UserItem[];
}

export async function createUser(token: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.message || data.errors?.username?.[0] || data.errors?.email?.[0] || 'Gagal menyimpan pengguna'
    );
  }
  return data as UserItem;
}

export async function updateUser(token: string, id: number, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui pengguna');
  return data as UserItem;
}

export async function deleteUser(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus pengguna');
  return data;
}