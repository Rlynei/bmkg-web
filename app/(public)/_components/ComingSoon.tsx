import { Clock } from 'lucide-react';

export default function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <Clock size={24} />
      </span>
      <p className="mb-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 inline-block">Segera Hadir</p>
      <h2 className="mb-2 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto max-w-md text-sm text-slate-500">{desc}</p>
    </div>
  );
}