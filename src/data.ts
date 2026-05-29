import { Court } from './types';
import padelImg from './assets/images/padel_sunny_court_1779971336754.png';
import footballImg from './assets/images/football_clay_court_1779971361853.png';
import tennisImg from './assets/images/tennis_clay_action_1779971376841.png';
import basketballImg from './assets/images/basketball_parquet_1779971396317.png';

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

const SPORT_TYPES = [
  { name: 'Pádel', surface: 'Césped Sintético', img: padelImg, price: 15000 },
  { name: 'Fútbol 5', surface: 'Arcilla / Tierra', img: footballImg, price: 22000 },
  { name: 'Tenis', surface: 'Polvo de Ladrillo', img: tennisImg, price: 18000 },
  { name: 'Básquet', surface: 'Madera (Parquet)', img: basketballImg, price: 25000 },
  { name: 'Vóley', surface: 'Madera (Parquet)', img: basketballImg, price: 20000 },
  { name: 'Hockey', surface: 'Césped Sintético', img: padelImg, price: 28000 }
];

const ADJECTIVES = ['Club', 'Polideportivo', 'Centro', 'Canchas', 'Estadio', 'Complejo'];
const SUFFIXES = ['Sport', 'Pro', 'Elite', 'Premium', 'Central', 'Avenue'];

const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const generatedCourts: Court[] = [];

BARRIOS.forEach((barrio, i) => {
  // Asegurar que cada deporte tenga su cancha en cada barrio
  SPORT_TYPES.forEach((sport, j) => {
    const adj = ADJECTIVES[(i + j) % ADJECTIVES.length];
    
    generatedCourts.push({
      id: `c_${i}_${j}`,
      name: `${adj} ${sport.name} ${barrio}`,
      location: `${barrio}, CABA`,
      surface: sport.surface,
      sport: sport.name,
      rating: 4.0 + (Math.abs(getHash(barrio + j)) % 10) / 10,
      reviews: 20 + (Math.abs(getHash(barrio + sport.name)) % 200),
      pricePerHour: sport.price + (Math.abs(getHash(barrio + sport.name)) % 4) * 1000,
      imageUrl: sport.img,
    });
  });
});

export const courts: Court[] = generatedCourts;

// In-memory store for reserved slots (key: courtId_yyyy-mm-dd)
export const globalBookings: Record<string, string[]> = {};
