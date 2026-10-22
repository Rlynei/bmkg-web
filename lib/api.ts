const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const STORAGE_URL = API_URL.replace(/\/api$/, '');

export function getFileUrl(path: string | null) {
  if (!path) return null;
  return `${STORAGE_URL}/storage/${path}`;
}

export type PublicJurnalArtikel = {
  id: number;
  judul: string;
  slug: string;
  penulis: string;
  abstrak: string | null;
  file_pdf: string;
  thumbnail: string | null;
  tanggal_terbit: string;
  dilihat: number;
};

export async function getPublicJurnalArtikelList() {
  const res = await fetch(`${API_URL}/jurnal-artikel?per_page=100`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data jurnal & artikel');
  const json = await res.json();
  return json.data as PublicJurnalArtikel[];
}

export async function getPublicJurnalArtikelBySlug(slug: string) {
  const res = await fetch(`${API_URL}/jurnal-artikel/${slug}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return (await res.json()) as PublicJurnalArtikel;
}

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
export type WilayahItem = {
  id: number;
  kode_adm4: string;
  nama_kelurahan: string;
  nama_kecamatan: string;
  nama_kabupaten: string;
  nama_provinsi: string;
};

export async function searchWilayah(query: string) {
  const res = await fetch(`${API_URL}/wilayah/search?q=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal mencari wilayah');
  return (await res.json()) as WilayahItem[];
}

export type CuacaSlot = {
  datetime: string;
  local_datetime: string;
  t: number;
  hu: number;
  ws: number;
  wd: string;
  tcc: number;
  vs_text: string;
  weather_desc: string;
  image: string;
};

export type CuacaLokasi = {
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lat?: number;
  lon?: number;
  timezone?: string;
};

export type CuacaData = {
  lokasi: CuacaLokasi;
  data: { cuaca: CuacaSlot[][] }[];
};

export async function getCuacaDetail(kodeAdm4: string): Promise<CuacaData> {
  const res = await fetch(`${API_URL}/cuaca/${kodeAdm4}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal memuat data cuaca');
  const json = await res.json();
  // Sampel README membaca `lokasi` di level atas, sedangkan respons yang kita tangkap
  // sebelumnya terbungkus di dalam `data`. Helper ini menangani kedua bentuk.
  return (json.data && !Array.isArray(json.data) ? json.data : json) as CuacaData;
}

export type CuacaResponse = {
  data: {
    lokasi: {
      provinsi: string;
      kotkab: string;
      kecamatan: string;
      desa: string;
    };
    data: {
      cuaca: CuacaSlot[][];
    }[];
  };
};

export async function getCuaca(kodeAdm4: string) {
  const res = await fetch(`${API_URL}/cuaca/${kodeAdm4}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal memuat data cuaca');
  return (await res.json()) as CuacaResponse;
}

export type PublicListItem = {
  id: number;
  judul: string;
  slug: string;
};

export async function getLatestBerita() {
  const res = await fetch(`${API_URL}/berita?per_page=3`, { headers: { Accept: 'application/json' } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as (PublicListItem & { tanggal_publish: string })[];
}

export async function getLatestKegiatan() {
  const res = await fetch(`${API_URL}/kegiatan?per_page=3`, { headers: { Accept: 'application/json' } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as (PublicListItem & { tanggal_mulai: string })[];
}
export type PublicBulletin = {
  id: number;
  judul: string;
  slug: string;
  jenis: 'cuaca' | 'iklim' | 'geofisika' | 'maritim';
  periode: string;
  file_pdf: string;
  thumbnail: string | null;
};

const JENIS_LABEL: Record<PublicBulletin['jenis'], string> = {
  cuaca: 'Cuaca',
  iklim: 'Iklim',
  geofisika: 'Geofisika',
  maritim: 'Maritim',
};

export { JENIS_LABEL };

export async function getPublicBulletinList() {
  const res = await fetch(`${API_URL}/bulletin?per_page=100`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data bulletin');
  const json = await res.json();
  return json.data as PublicBulletin[];
}

export async function getPublicBulletinBySlug(slug: string) {
  const res = await fetch(`${API_URL}/bulletin/${slug}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return (await res.json()) as PublicBulletin;
}

export type PublicBerita = {
  id: number;
  judul: string;
  slug: string;
  isi: string;
  thumbnail: string | null;
  kategori: string | null;
  tanggal_publish: string;
  dilihat: number;
};

export async function getPublicBeritaList() {
  const res = await fetch(`${API_URL}/berita?per_page=100`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data berita');
  const json = await res.json();
  return json.data as PublicBerita[];
}

export async function getPublicBeritaBySlug(slug: string) {
  const res = await fetch(`${API_URL}/berita/${slug}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return (await res.json()) as PublicBerita;
}

export type PublicKegiatan = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  lokasi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  thumbnail: string | null;
};

export async function getPublicKegiatanList() {
  const res = await fetch(`${API_URL}/kegiatan?per_page=100`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data kegiatan');
  const json = await res.json();
  return json.data as PublicKegiatan[];
}

export async function getPublicKegiatanBySlug(slug: string) {
  const res = await fetch(`${API_URL}/kegiatan/${slug}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return (await res.json()) as PublicKegiatan;
}

export type PeringatanItem = {
  kode: string;
  title: string;
  event: string;
  provinsi: string;
  description: string;
  pub_date: string | null;
};

export async function getPeringatanDini(): Promise<PeringatanItem[]> {
  const res = await fetch(`${API_URL}/peringatan-dini`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat peringatan dini cuaca');
  return res.json();
}

export type PeringatanArea = {
  area_desc: string;
  polygons: [number, number][][];
};

export type PeringatanDetail = {
  kode: string;
  headline: string;
  event: string;
  urgency: string;
  severity: string;
  certainty: string;
  effective: string;
  expires: string;
  sender_name: string;
  description: string;
  web: string | null;
  areas: PeringatanArea[];
};

export async function getPeringatanDetail(kode: string): Promise<PeringatanDetail> {
  const res = await fetch(`${API_URL}/peringatan-dini/${encodeURIComponent(kode)}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (res.status === 404) throw new Error('Peringatan tidak ditemukan atau sudah berakhir');
  if (!res.ok) throw new Error('Gagal memuat detail peringatan');
  return res.json();
}

export type GempaItem = {
  tanggal: string | null;
  jam: string | null;
  datetime: string | null;
  magnitude: number | null;
  kedalaman: string | null;
  lintang: string | null;
  bujur: string | null;
  coordinates: { lat: number; lon: number } | null;
  wilayah: string | null;
  potensi: string | null;
  dirasakan: string | null;
  shakemap_url: string | null;
};

async function fetchGempa(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Gagal memuat data gempabumi');
  return res.json();
}

export const getGempaTerkini = () => fetchGempa('/gempabumi/terkini') as Promise<GempaItem>;
export const getGempaM5 = () => fetchGempa('/gempabumi/m5') as Promise<GempaItem[]>;
export const getGempaDirasakan = () => fetchGempa('/gempabumi/dirasakan') as Promise<GempaItem[]>;