import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Court } from '../../types';
import { motion } from 'motion/react';

interface CourtCardProps {
  key?: React.Key;
  court: Court;
  onClick: (court: Court) => void;
}

export function CourtCard({ court, onClick }: CourtCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[1.5rem] overflow-hidden shadow-soft hover:shadow-medium transition-all cursor-pointer group"
      onClick={() => onClick(court)}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={court.imageUrl} 
          alt={court.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-20 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-terra fill-terra" />
          <span className="text-sm font-medium text-charcoal">{court.rating}</span>
          <span className="text-xs text-charcoal-light">({court.reviews})</span>
        </div>
        <div className="absolute top-4 left-4 z-20 bg-olive text-cream px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-sans">
          {court.sport}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{court.name}</h3>
        
        <div className="flex items-center text-charcoal-light text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-terra/70" />
          {court.location}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-sand">
          <div className="flex flex-col">
            <span className="text-xs text-charcoal-light uppercase tracking-wider font-medium">Superficie</span>
            <span className="text-sm font-medium text-charcoal">{court.surface}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-serif text-terra font-semibold">${court.pricePerHour.toLocaleString()}</span>
            <span className="text-xs text-charcoal-light">por hora</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
