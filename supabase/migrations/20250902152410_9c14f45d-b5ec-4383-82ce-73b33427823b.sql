-- Create parking_spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coordinates FLOAT[] NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT true,
  image_url TEXT,
  owner_id TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for parking images
INSERT INTO storage.buckets (id, name, public)
VALUES ('parking-images', 'parking-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload images
CREATE POLICY "Users can upload parking images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'parking-images');

-- Create policy for anyone to view parking images
CREATE POLICY "Anyone can view parking images" ON storage.objects
FOR SELECT USING (bucket_id = 'parking-images');

-- Enable RLS on parking_spots table
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to view parking spots
CREATE POLICY "Anyone can view parking spots" ON parking_spots
FOR SELECT USING (true);

-- Create policy for authenticated users to create parking spots
CREATE POLICY "Authenticated users can create parking spots" ON parking_spots
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for owners to update their parking spots
CREATE POLICY "Users can update their own parking spots" ON parking_spots
FOR UPDATE USING (auth.uid()::text = owner_id);

-- Create policy for owners to delete their parking spots
CREATE POLICY "Users can delete their own parking spots" ON parking_spots
FOR DELETE USING (auth.uid()::text = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_parking_spots_updated_at
    BEFORE UPDATE ON parking_spots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();