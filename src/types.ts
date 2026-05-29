export interface Court {
  id: string;
  name: string;
  location: string;
  surface: string;
  sport: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  imageUrl: string;
}

export interface BookingSlot {
  time: string;
  available: boolean;
}
