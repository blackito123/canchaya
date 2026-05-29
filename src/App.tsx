import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { PartnerSection } from './components/home/PartnerSection';
import { CourtGrid } from './components/home/CourtGrid';
import { BookingView } from './components/booking/BookingView';
import { Modal } from './components/ui/Modal';
import { Court } from './types';
import { globalBookings, courts } from './data';
import { Lightbulb, X } from 'lucide-react';

export default function App() {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [activeSportFilter, setActiveSportFilter] = useState('Todos');
  const [activeLocationFilter, setActiveLocationFilter] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'info' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTestMessage, setShowTestMessage] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (sport: string, location: string) => {
    setIsLoading(true);
    setActiveSportFilter(sport || 'Todos');
    setActiveLocationFilter(location || '');
    setTimeout(() => setIsLoading(false), 800);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedCourt || activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCourt, activeModal]);

  // Derived bookings for the Modal
  const myBookings: { courtName: string, date: string, time: string, image: string }[] = [];
  Object.keys(globalBookings).forEach(key => {
    const separatorIdx = key.indexOf('_');
    const courtId = key.substring(0, separatorIdx);
    const dateStr = key.substring(separatorIdx + 1);
    const court = courts.find(c => c.id === courtId);
    if (court) {
      globalBookings[key].forEach(time => {
        myBookings.push({
          courtName: court.name,
          date: dateStr,
          time,
          image: court.imageUrl
        });
      });
    }
  });

  return (
    <div className="min-h-screen bg-cream selection:bg-terra/20 selection:text-terra-dark relative">
      <Navbar 
        onOpenModal={(modal) => setActiveModal(modal)} 
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />
      
      <main>
        <Hero onSearch={handleSearch} />
        <PartnerSection />
        <CourtGrid 
          isLoading={isLoading}
          onSelectCourt={setSelectedCourt} 
          activeSportFilter={activeSportFilter}
          setActiveSportFilter={setActiveSportFilter}
          activeLocationFilter={activeLocationFilter}
          setActiveLocationFilter={setActiveLocationFilter}
        />
      </main>

      {/* Footer simple */}
      <footer className="border-t border-sand bg-cream-dark py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center text-charcoal-light gap-4">
          <p className="font-serif text-2xl italic text-charcoal">CanchaYA</p>
          <p className="text-sm">Tu espacio deportivo, a un click de distancia.</p>
          
          <div className="w-full max-w-2xl mt-6 pt-6 border-t border-sand flex flex-col gap-2">
            <p className="text-sm font-medium text-charcoal">&copy; {new Date().getFullYear()} CanchaYA. Todos los derechos reservados.</p>
            <p className="text-xs text-charcoal-light/70 leading-relaxed">
              El contenido, diseño, logotipos y código fuente de esta aplicación están protegidos por leyes internacionales de propiedad intelectual y derechos de autor (Copyright). Queda estrictamente prohibida la copia, reproducción, modificación, distribución o explotación comercial total o parcial sin autorización previa, expresa y por escrito de sus desarrolladores.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showTestMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur shadow-xl border border-sand rounded-2xl p-4 pr-10 max-w-sm flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-terra/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-terra" />
            </div>
            <div className="flex flex-col pt-0.5">
              <span className="font-medium text-charcoal text-sm mb-0.5">¡Aviso importante!</span>
              <p className="text-sm text-charcoal-light leading-snug">
                Esta es una página de prueba. Las reservas no funcionan realmente.
              </p>
            </div>
            <button 
              onClick={() => setShowTestMessage(false)}
              className="absolute top-3 right-3 text-charcoal-light hover:text-charcoal hover:bg-sand/30 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {selectedCourt && (
          <BookingView 
            court={selectedCourt} 
            onClose={() => setSelectedCourt(null)}
            isAdmin={isAdmin} 
          />
        )}
        
        {activeModal === 'info' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Cómo funciona">
            <div className="space-y-6 text-charcoal-light">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-terra/20 text-terra font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Buscá tu cancha</h4>
                  <p className="text-sm">Elegí tu deporte favorito, tu ubicación y encontrá las mejores opciones cerca tuyo.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sage/20 text-sage font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">Elegí el horario</h4>
                  <p className="text-sm">Seleccioná la fecha y el horario disponible que mejor te sirva. Todo en tiempo real.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sand-dark/50 text-charcoal font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium text-charcoal mb-1">¡A jugar!</h4>
                  <p className="text-sm">Apretá "Gestionar Reserva" para abrir WhatsApp y arreglar los detalles directo con la cancha. Solo te queda disfrutar del partido.</p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

