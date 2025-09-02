export interface ParkingSpot {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
  price_per_hour: number;
  available: boolean;
  image_url?: string;
  owner_id: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateParkingSpotData {
  coordinates: [number, number];
  title: string;
  description: string;
  price_per_hour: number;
  image?: File;
  address: string;
}