const OFFSET_TZ: Record<string, { tz: string; label: string }> = {
  '+07:00': { tz: 'Asia/Jakarta', label: 'WIB' },
  '+08:00': { tz: 'Asia/Makassar', label: 'WITA' },
  '+09:00': { tz: 'Asia/Jayapura', label: 'WIT' },
};

export function formatCapTime(iso: string | null) {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const zone = OFFSET_TZ[iso.slice(-6)];
  const text = date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: zone?.tz,
  });
  return zone ? `${text} ${zone.label}` : text;
}