'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AlertMap({ polygons }: { polygons: [number, number][][] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || polygons.length === 0) return;

    const map = L.map(ref.current);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const group = L.featureGroup(
      polygons.map((coords) =>
        L.polygon(coords, { color: 'red', fillColor: 'orange', fillOpacity: 0.5, weight: 1 })
      )
    ).addTo(map);

    map.fitBounds(group.getBounds());

    return () => {
      map.remove();
    };
  }, [polygons]);

  // z-0 membuat peta punya stacking context sendiri, supaya tidak menimpa navbar sticky
  return <div ref={ref} className="relative z-0 h-96 w-full rounded-xl border border-slate-200" />;
}