import { supabase } from '@/integrations/supabase/client';

// Parking spots database functions
export const parkingApi = {
  // Fetch all parking spots
  async getAllParkingSpots() {
    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(spot => ({
        ...spot,
        coordinates: spot.coordinates as [number, number]
      })) || [];
    } catch (error) {
      console.error('Supabase query error:', error);
      return [];
    }
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
    try {
      // Get current user or use a fallback ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || `anonymous_${Date.now()}`;

      const { data, error } = await supabase
        .from('parking_spots')
        .insert([{
          ...spotData,
          available: true,
          owner_id: userId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        coordinates: data.coordinates as [number, number]
      };
    } catch (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
  },

  // Upload image to Supabase Storage
  async uploadParkingImage(file: File, fileName: string) {
    try {
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
    } catch (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }
  },

  // Get parking spots near a location
  async getNearbyParkingSpots(lat: number, lng: number, radius: number = 5) {
    try {
      // For now, return all spots - in production, use PostGIS for proximity
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(spot => ({
        ...spot,
        coordinates: spot.coordinates as [number, number]
      })) || [];
    } catch (error) {
      console.error('Supabase query error:', error);
      return [];
    }
  }
};