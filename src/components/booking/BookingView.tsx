import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, MessageCircle, AlertCircle } from 'lucide-react';
import { Court } from '../../types';
import { Button } from '../ui/Button';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { globalBookings } from '../../data';

interface BookingViewProps {
  court: Court;
  onClose: () => void;
  isAdmin?: boolean;
}

// Generate next 14 days
const generateDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    days.push(addDays(today, i));
  }
  return days;
};

// All slots are available by default now, so admin has full control over disabling them
const MOCK_SLOTS = [
  '14:00',
  '15:30',
  '17:00',
  '18:30',
  '20:00',
  '21:30',
  '23:00',
];

export function BookingView({ court, onClose, isAdmin = false }: BookingViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: time selection, 2: confirmation
  const [, setTrigger] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const days = generateDays();

  const scroll = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const dateKey = `${court.id}_${format(selectedDate, 'yyyy-MM-dd')}`;
  const bookedSlots = globalBookings[dateKey] || [];

  const handleSlotClick = (time: string) => {
    if (isAdmin) {
      if (!globalBookings[dateKey]) {
        globalBookings[dateKey] = [];
      }
      
      const index = globalBookings[dateKey].indexOf(time);
      if (index > -1) {
        // Es un turno inhabilitado, habilitarlo de nuevo
        globalBookings[dateKey].splice(index, 1);
      } else {
        // Es un turno habilitado, inhabilitarlo
        globalBookings[dateKey].push(time);
        if (selectedTime === time) {
          setSelectedTime(null);
        }
      }
      setTrigger(t => t + 1);
    } else {
      setSelectedTime(time);
    }
  };

  const handleConfirm = () => {
    if (selectedTime && !isAdmin) {
      setStep(2);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/40 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        className="w-full max-w-6xl bg-cream rounded-[2rem] shadow-2xl relative flex flex-col md:flex-row overflow-hidden min-h-[600px]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Calendar & Time Selection */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          {step === 1 ? (
            <>
              {isAdmin && (
                <div className="mb-6 p-4 bg-terra/10 border border-terra/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-terra shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-terra">Modo Administrador</h3>
                    <p className="text-sm text-terra/80 mt-1">Has activado el modo admin. Toca en cualquier horario para inhabilitarlo (bloquear) o habilitarlo (desbloquear) manualmente para el pùblico.</p>
                  </div>
                </div>
              )}
            
              <h2 className="font-serif text-3xl font-medium text-charcoal mb-2">Seleccioná tu turno</h2>
              <p className="text-charcoal-light mb-10">Elegí la fecha y horario para jugar en {court.name}.</p>
              
              {/* Custom Horizontal Calendar */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center text-charcoal">
                    <CalendarIcon className="w-5 h-5 mr-2 text-terra" />
                    {format(selectedDate, 'MMMM yyyy', { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => scroll(-200)} className="w-8 h-8 rounded-full border border-sand flex items-center justify-center hover:bg-sand transition-colors text-charcoal">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => scroll(200)} className="w-8 h-8 rounded-full border border-sand flex items-center justify-center hover:bg-sand transition-colors text-charcoal">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x scroll-smooth">
                  {days.map((day, i) => {
                    const isSelected = isSameDay(day, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime(null);
                        }}
                        className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all snap-start ${
                          isSelected 
                            ? 'bg-terra text-white shadow-md scale-105' 
                            : 'bg-white text-charcoal hover:border-terra border border-transparent'
                        }`}
                      >
                        <span className="text-xs uppercase font-medium tracking-wider mb-1 opacity-80">
                          {format(day, 'EEE', { locale: es })}
                        </span>
                        <span className="text-2xl font-serif">{format(day, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Time Slots */}
              <div>
                <h3 className="font-medium flex items-center text-charcoal mb-4">
                  <Clock className="w-5 h-5 mr-2 text-terra" />
                  Horarios disponibles
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {MOCK_SLOTS.map((time, i) => {
                    const isBooked = bookedSlots.includes(time);
                    const isAvailable = !isBooked;
                    
                    return (
                      <button
                        key={i}
                        disabled={!isAdmin && !isAvailable}
                        onClick={() => handleSlotClick(time)}
                        className={`h-12 rounded-xl text-sm font-medium transition-all ${
                          !isAvailable 
                            ? isAdmin 
                              ? 'bg-terra text-white shadow-md border-2 border-terra' // Admin ve inhabilitado claramente coloreado
                              : 'bg-terra/10 text-terra/40 cursor-not-allowed line-through' 
                            : selectedTime === time
                              ? 'bg-sage text-white shadow-md border-2 border-sage'
                              : isAdmin
                                ? 'bg-white text-charcoal shadow-sm border border-sand hover:bg-sand/30'
                                : 'bg-white text-charcoal border border-sand hover:border-sage hover:text-sage'
                        }`}
                      >
                        {time} hs
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Check className="w-10 h-10 text-sage" />
              </div>
              <h2 className="font-serif text-3xl font-medium text-charcoal mb-4">Gestionar Reserva</h2>
              <p className="text-charcoal-light mb-8">
                Te redireccionaremos a WhatsApp para finalizar los detalles de tu turno en <strong>{court.name}</strong>.
              </p>
              <div className="bg-white p-6 rounded-2xl text-left border border-sand mb-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-sand">
                  <span className="text-charcoal-light">Fecha</span>
                  <span className="font-medium text-charcoal capitalize">{format(selectedDate, 'EEEE d MMMM', { locale: es })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-light">Horario</span>
                  <span className="font-medium text-charcoal">{selectedTime} hs (90 min)</span>
                </div>
              </div>
              
              {(() => {
                const dayStringRaw = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
                const dayString = dayStringRaw.charAt(0).toUpperCase() + dayStringRaw.slice(1);
                const message = `Hola! Te hablo para gestionar mi reserva a ${court.name} el ${dayString} a las ${selectedTime}. Saludos!`;
                
                return (
                  <Button 
                    size="lg" 
                    className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white shadow-md mb-4"
                    onClick={() => window.open(`https://wa.me/5491169331861?text=${encodeURIComponent(message)}`, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Ir a WhatsApp
                  </Button>
                );
              })()}

              <Button size="lg" variant="outline" onClick={onClose} className="w-full">
                Volver al inicio
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Court Details Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-l border-sand flex flex-col flex-shrink-0">
          <div className="h-48 md:h-64 relative">
            <img src={court.imageUrl} alt={court.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="bg-olive/90 text-cream text-xs font-semibold px-2 py-1 rounded-md mb-2 inline-block">
                {court.sport}
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">{court.name}</h3>
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-light text-sm">Superficie</span>
                <span className="font-medium text-charcoal">{court.surface}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-light text-sm">Ubicación</span>
                <span className="font-medium text-charcoal">{court.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-light text-sm">Duración</span>
                <span className="font-medium text-charcoal">90 minutos</span>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-sand">
              <div className="flex justify-between items-end mb-6">
                <span className="text-charcoal font-medium">Total a pagar</span>
                <span className="font-serif text-3xl text-terra font-semibold">${(court.pricePerHour * 1.5).toLocaleString()}</span>
              </div>
              
              {step === 1 && !isAdmin && (
                <div className="flex flex-col gap-2">
                  <Button 
                    size="lg" 
                    className="w-full shadow-md bg-terra hover:bg-terra/90 text-white"
                    disabled={!selectedTime}
                    onClick={handleConfirm}
                  >
                    Gestionar Reserva
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
