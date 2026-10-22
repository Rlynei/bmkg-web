const MISI = [
  'Mengamati dan memahami fenomena meteorologi, klimatologi, kualitas udara dan geofisika.',
  'Menyediakan data, informasi dan jasa meteorologi, klimatologi, kualitas udara dan geofisika yang handal dan terpercaya.',
  'Mengkoordinasikan dan memfasilitasi kegiatan di bidang meteorologi, klimatologi, kualitas udara dan geofisika.',
  'Berpartisipasi aktif dalam kegiatan internasional di bidang meteorologi, klimatologi, kualitas udara dan geofisika.',
  'Meningkatkan kualitas sumber daya manusia di bidang meteorologi, klimatologi, kualitas udara dan geofisika.',
];

export default function VisiMisiPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-900">Visi</p>
        <p className="mx-auto max-w-2xl text-xl font-bold leading-relaxed text-slate-900 md:text-2xl">
          &ldquo;Mewujudkan BMKG yang handal, tanggap dan mampu dalam rangka mendukung keselamatan
          masyarakat serta keberhasilan pembangunan nasional.&rdquo;
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-blue-900">Misi</p>
        <ol className="space-y-4">
          {MISI.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-900">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-slate-600">{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}