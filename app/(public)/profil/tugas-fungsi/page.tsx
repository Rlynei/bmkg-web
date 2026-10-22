const FUNGSI = [
  { emoji: '⛅', title: 'Pengamatan Cuaca', desc: 'Melaksanakan pengamatan meteorologi secara terus-menerus di seluruh wilayah kerja.' },
  { emoji: '🌊', title: 'Informasi Maritim', desc: 'Menyediakan informasi cuaca dan gelombang laut untuk keselamatan pelayaran dan nelayan.' },
  { emoji: '🌡️', title: 'Klimatologi', desc: 'Menganalisis data iklim dan memprakirakan musim hujan dan kemarau.' },
  { emoji: '🌍', title: 'Geofisika', desc: 'Memantau aktivitas gempa bumi, tsunami, petir, dan magnet bumi.' },
  { emoji: '⚠️', title: 'Peringatan Dini', desc: 'Mengeluarkan peringatan dini cuaca ekstrem, tsunami, dan bencana hidrometeorologi.' },
  { emoji: '📡', title: 'Jaringan Observasi', desc: 'Mengelola jaringan stasiun pengamatan otomatis (AWS) di seluruh wilayah kerja.' },
];

export default function TugasFungsiPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-900">Tugas Pokok</p>
        <p className="text-sm leading-relaxed text-slate-600">
          Berdasarkan UU No. 31 Tahun 2009, BMKG mempunyai tugas pemerintahan di bidang Meteorologi,
          Klimatologi, Kualitas Udara, dan Geofisika sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FUNGSI.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-2xl">
              {item.emoji}
            </div>
            <p className="mb-1 font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}