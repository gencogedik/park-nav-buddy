import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Parking spots database functions
export const parkingApi = {
  // Fetch all parking spots
  async getAllParkingSpots() {
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create a new parking spot
  async createParkingSpot(spotData: {
    coordinates: [number, number];
    title: string;
    description: string;
    price_per_hour: number;
    address: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('parking_spots')
      .insert([{
        ...spotData,
        available: true,
        owner_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload image to Supabase Storage
  async uploadParkingImage(file: File, fileName: string) {
    const { data, error } = await supabase.storage
      .from('parking-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('parking-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // Get parking spots near a location
  async getNearbyParkingSpots(lat: number, lng: number, radius: number = 5) {
    // For now, return all spots - in production, use PostGIS for proximity
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};