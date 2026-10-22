import { MapPin, Phone, Mail, Clock } from 'lucide-react';

type Props = {
  nama: string;
  tupoksi: string;
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: string;
};

export default function StasiunDetail({ nama, tupoksi, alamat, telepon, email, jamOperasional }: Props) {
  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-blue-900">{nama}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
              <MapPin size={20} />
            </span>
            <div>
              <p className="font-semibold text-slate-900">{nama}</p>
              <p className="text-sm text-slate-500">Tupoksi: {tupoksi}</p>
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-100 pt-5">
            <InfoRow icon={MapPin} label="Alamat" value={alamat} />
            <InfoRow icon={Phone} label="Telepon" value={telepon} />
            <InfoRow icon={Mail} label="Email" value={email} isEmail />
            <InfoRow icon={Clock} label="Jam Operasional" value={jamOperasional} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="mb-3 font-semibold text-slate-900">Lokasi Stasiun</p>
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <MapPin size={22} className="mb-2 text-blue-900" />
              <p className="text-xs">Peta lokasi tersedia di aplikasi</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-1 text-sm font-semibold text-amber-800">Darurat / Peringatan Dini</p>
            <p className="text-sm text-amber-700">Hubungi 24 jam: {telepon}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isEmail,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  isEmail?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        {isEmail ? (
          <a href={`mailto:${value}`} className="text-sm text-blue-900 hover:underline">{value}</a>
        ) : (
          <p className="text-sm text-slate-700">{value}</p>
        )}
      </div>
    </div>
  );
}