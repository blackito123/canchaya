import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-lg bg-cream rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[80vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal hover:bg-sand-dark transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="p-8 overflow-y-auto">
          <h2 className="font-serif text-3xl font-medium text-charcoal mb-6">{title}</h2>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
