import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface MapWidgetProps {
  lat: number;
  lng: number;
  name: string;
}

export function MapWidget({ lat, lng, name }: MapWidgetProps) {
  return (
    <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden border border-blue-100 flex flex-col">
      <div className="flex-1 relative bg-neutral-100">
        <iframe
          title="map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.5}%2C${lat - 0.5}%2C${lng + 0.5}%2C${lat + 0.5}&layer=mapnik&marker=${lat}%2C${lng}`}
          style={{ pointerEvents: 'none' }}
        ></iframe>
      </div>
      <div className="p-2 bg-blue-600 text-white text-[9px] font-bold text-center uppercase tracking-widest">
        Confirming Destination: {name}
      </div>
    </div>
  );
}
