import React from 'react';
import { Search, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

const SoccerBall = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7l-3.5 2 1.5 4h4l1.5-4Z" />
    <path d="M12 7V2" />
    <path d="M8.5 9l-4.5-2" />
    <path d="M15.5 9l4.5-2" />
    <path d="M10 13l-3.5 4.5" />
    <path d="M14 13l3.5 4.5" />
  </svg>
);

interface NavbarProps {
  onOpenModal: (m: 'reservas' | 'info' | 'perfil') => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export function Navbar({ onOpenModal, isAdmin, onToggleAdmin }: NavbarProps) {
  const scrollToCanchas = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('canchas-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-charcoal text-cream border-b border-charcoal-light shadow-md">
      <div className="max-w-7xl px-6 md:px-12 h-20 mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <SoccerBall className="w-6 h-6 text-cream" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-cream">
            CanchaYA
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-cream/80">
          <a href="#canchas-grid" onClick={scrollToCanchas} className="hover:text-white transition-colors">Canchas</a>
          <button onClick={() => onOpenModal('info')} className="hover:text-white transition-colors">Cómo funciona</button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleAdmin}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isAdmin ? 'bg-terra text-white' : 'bg-white/10 text-cream/50 hover:text-white hover:bg-white/20'}`}
            title={isAdmin ? "Desactivar Modo Admin" : "Activar Modo Admin"}
          >
            <Shield className="w-4 h-4" />
          </button>
          <Button variant="outline" size="sm" className="hidden md:flex bg-transparent border-cream/30 text-cream hover:bg-cream/10" onClick={scrollToCanchas}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </nav>
  );
}
