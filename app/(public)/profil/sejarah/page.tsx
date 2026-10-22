const TIMELINE = [
  { year: '1866', desc: 'Berdirinya lembaga meteorologi pertama di Batavia oleh pemerintah Belanda.' },
  { year: '1945', desc: 'Lembaga beralih ke pemerintah Republik Indonesia pasca kemerdekaan.' },
  { year: '1972', desc: 'Dibentuk Badan Meteorologi dan Geofisika (BMG) sebagai lembaga pemerintah non-departemen.' },
  { year: '2002', desc: 'Penambahan fungsi Klimatologi, menjadi Badan Meteorologi, Klimatologi dan Geofisika (BMKG).' },
  { year: '2009', desc: 'BMKG ditetapkan sebagai instansi pemerintah berdasarkan UU No. 31 Tahun 2009.' },
  { year: '2014', desc: 'Peresmian penambahan unit pelaksana teknis di berbagai wilayah Indonesia.' },
  { year: '2024', desc: 'Transformasi digital pelayanan informasi cuaca, iklim, dan geofisika berbasis data real-time.' },
];

export default function SejarahPage() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
      <h1 className="mb-8 text-xl font-bold text-slate-900">Sejarah BMKG</h1>

      <div className="relative pl-2">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-200" />

        <div className="space-y-8">
          {TIMELINE.map((item, i) => (
            <div key={item.year} className="relative flex gap-5">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <p className="mb-1 text-lg font-bold text-blue-900">{item.year}</p>
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}