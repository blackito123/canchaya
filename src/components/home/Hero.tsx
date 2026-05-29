import React, { useState } from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import heroImage from '../../assets/images/padel_sunny_court_1779971336754.png';
import { cn } from '../../lib/utils';

const SPORTS = ['Pádel', 'Fútbol 5', 'Tenis', 'Básquet', 'Vóley', 'Hockey'];
const BARRIOS = [
  'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito', 
  'Chacarita', 'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 
  'La Boca', 'La Paternal', 'Liniers', 'Mataderos', 'Monte Castro', 'Montserrat', 
  'Nueva Pompeya', 'Nuñez', 'Palermo', 'Parque Avellaneda', 'Parque Chacabuco', 
  'Parque Chas', 'Parque Patricios', 'Puerto Madero', 'Recoleta', 'Retiro', 
  'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Versalles', 
  'Villa Crespo', 'Villa Devoto', 'Villa General Mitre', 'Villa Lugano', 'Villa Luro', 
  'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita', 
  'Villa Soldati', 'Villa Urquiza', 'Villa del Parque', 'Vélez Sarsfield'
];

interface HeroProps {
  onSearch: (sport: string, location: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const today = new Date().toISOString().split('T')[0];
  
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 14);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const handleSearch = () => {
    onSearch(sport, location);
    document.getElementById('canchas-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-12 pt-8 pb-16">
      <div className="max-w-7xl mx-auto relative h-[60vh] min-h-[500px]">
        {/* Background container that clips the image */}
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden z-10">
          <div className="absolute inset-0 bg-charcoal/20 z-20" />
          <img 
            src={heroImage} 
            alt="Cancha soleada" 
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        </div>
        
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-cream/90 text-olive text-sm font-medium mb-6 uppercase tracking-wider">
            Premium Sports Booking
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-white max-w-3xl leading-tight mb-6 drop-shadow-md">
            Encontrá y reservá tu cancha ideal
          </h1>
          <p className="text-cream text-lg md:text-xl max-w-xl mb-10 drop-shadow">
            Descubrí los mejores espacios deportivos con disponibilidad en tiempo real. Sin llamados, todo en un solo lugar.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-5xl bg-cream p-3 md:p-4 rounded-[1.5rem] shadow-medium flex flex-col md:flex-row items-center gap-4">
            
            {/* Deportes Dropdown */}
            <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-r border-sand py-2 md:py-0 relative group cursor-pointer h-12 hover:z-50 focus-within:z-50">
              <Search className="w-5 h-5 text-terra mr-3 flex-shrink-0" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span className={cn("text-charcoal font-sans truncate", !sport && "text-charcoal-light/70")}>
                  {sport || "¿Qué querés jugar?"}
                </span>
                <ChevronDown className="w-4 h-4 text-charcoal-light opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="absolute top-[110%] left-0 w-full min-w-[200px] bg-white rounded-[1rem] shadow-xl border border-sand/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 origin-top transform scale-95 group-hover:scale-100 z-50">
                {SPORTS.map(s => (
                  <div 
                    key={s} 
                    className="px-5 py-2 hover:bg-sand/30 text-charcoal text-sm text-left transition-colors"
                    onClick={() => setSport(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Ubicación Dropdown */}
            <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-r border-sand py-2 md:py-0 relative group cursor-pointer h-12 hover:z-50 focus-within:z-50">
              <MapPin className="w-5 h-5 text-terra mr-3 flex-shrink-0" />
              <div className="flex-1 text-left flex items-center justify-between">
                <span className={cn("text-charcoal font-sans truncate", !location && "text-charcoal-light/70")}>
                  {location || "¿Dónde?"}
                </span>
                <ChevronDown className="w-4 h-4 text-charcoal-light opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="absolute top-[110%] left-0 w-[240px] md:w-full bg-white rounded-[1rem] shadow-xl border border-sand/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 max-h-[300px] overflow-y-auto origin-top transform scale-95 group-hover:scale-100 hide-scrollbar z-50">
                {BARRIOS.map(b => (
                  <div 
                    key={b} 
                    className="px-5 py-2 hover:bg-sand/30 text-charcoal text-sm text-left transition-colors"
                    onClick={() => setLocation(b)}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-center w-full px-4 mb-3 md:mb-0 h-12">
              <Calendar className="w-5 h-5 text-terra mr-3 flex-shrink-0" />
              <input 
                type="date" 
                min={today}
                max={maxDate}
                className="w-full bg-transparent border-none focus:outline-none text-charcoal placeholder:text-charcoal-light/70 font-sans cursor-pointer"
              />
            </div>
            <Button size="lg" onClick={handleSearch} className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
              Buscar canchas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
