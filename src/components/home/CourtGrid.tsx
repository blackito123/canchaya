import React, { useState, useEffect } from 'react';
import { CourtCard } from './CourtCard';
import { courts } from '../../data';
import { Court } from '../../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

interface CourtGridProps {
  isLoading?: boolean;
  onSelectCourt: (court: Court) => void;
  activeSportFilter: string;
  setActiveSportFilter: (sport: string) => void;
  activeLocationFilter: string;
  setActiveLocationFilter: (loc: string) => void;
}

const CATEGORIES = ['Todos', 'Pádel', 'Fútbol 5', 'Tenis', 'Básquet', 'Vóley', 'Hockey'];
const ITEMS_PER_PAGE = 8;

export function CourtGrid({ 
  isLoading,
  onSelectCourt,
  activeSportFilter,
  setActiveSportFilter,
  activeLocationFilter,
  setActiveLocationFilter
}: CourtGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSportFilter, activeLocationFilter]);

  const filteredCourts = courts.filter(court => {
    const matchSport = activeSportFilter === 'Todos' ? true : court.sport === activeSportFilter;
    const matchLocation = activeLocationFilter === '' ? true : court.location.toLowerCase().includes(activeLocationFilter.toLowerCase());
    return matchSport && matchLocation;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / ITEMS_PER_PAGE));
  const paginatedCourts = filteredCourts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <section id="canchas-grid" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal mb-3">
            Para jugar hoy
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-charcoal-light text-lg">
              Las canchas mejor valoradas elegidas para vos.
            </p>
            {activeLocationFilter && (
              <span className="inline-flex items-center gap-1 bg-terra/10 text-terra px-3 py-1 rounded-full text-sm font-medium">
                {activeLocationFilter}
                <button onClick={() => setActiveLocationFilter('')} className="hover:text-terra-dark">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((filter) => (
            <button 
              key={filter}
              onClick={() => {
                setActiveSportFilter(filter);
                setActiveLocationFilter(''); // clear location filter when clicking generic tags
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSportFilter === filter 
                  ? 'bg-terra text-white shadow-md' 
                  : 'bg-sand/50 text-charcoal hover:bg-sand/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[1.5rem] overflow-hidden shadow-soft flex flex-col h-[400px]">
              <Skeleton className="h-64 w-full rounded-none rounded-t-[1.5rem]" />
              <div className="p-6 flex flex-col flex-1">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-auto" />
                <div className="flex justify-between pt-4 mt-6 border-t border-sand">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : paginatedCourts.length > 0 ? (
          paginatedCourts.map(court => (
            <CourtCard key={court.id} court={court} onClick={onSelectCourt} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-charcoal-light">
            No encontramos canchas para esta categoría y filtro.
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-sand text-charcoal hover:bg-sand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  currentPage === pageNum 
                    ? 'bg-terra text-white shadow-md' 
                    : 'bg-white border border-sand text-charcoal hover:bg-sand/20'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-sand text-charcoal hover:bg-sand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
