import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase ortam değişkenleri bulunamadı. Lütfen Supabase entegrasyonunu kontrol edin.');
}

// Create a mock client if credentials are not available
const createSupabaseClient = () => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Return a mock client with basic functionality
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: new Error('Supabase bağlantısı yok') }),
    then: (resolve: any) => resolve({ data: [], error: new Error('Supabase bağlantısı yok') })
  };

  return {
    from: () => mockQueryBuilder,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase bağlantısı yok') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    }
  } as any;
};

export const supabase = createSupabaseClient();

// Parking spots database functions
export const parkingApi = {
  // Fetch all parking spots
  async getAllParkingSpots() {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase bağlantısı yok - demo data döndürülüyor');
      return [
        {
          id: '1',
          coordinates: [41.0092, 28.9794],
          title: 'Güvenli Otopark',
          description: 'Kapalı güvenli park alanı',
          price_per_hour: 15,
          available: true,
          address: 'Taksim, İstanbul',
          owner_id: 'demo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase bağlantısı gerekli. Lütfen Supabase entegrasyonunu aktifleştirin.');
    }

    try {
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
    } catch (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
  },

  // Upload image to Supabase Storage
  async uploadParkingImage(file: File, fileName: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase bağlantısı gerekli. Lütfen Supabase entegrasyonunu aktifleştirin.');
    }

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
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase bağlantısı yok - demo data döndürülüyor');
      return [
        {
          id: '1',
          coordinates: [41.0092, 28.9794],
          title: 'Demo Park Yeri',
          description: 'Bu bir demo park yeridir',
          price_per_hour: 10,
          available: true,
          address: 'Demo Adres, İstanbul',
          owner_id: 'demo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    try {
      // For now, return all spots - in production, use PostGIS for proximity
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase query error:', error);
      return [];
    }
  }
};