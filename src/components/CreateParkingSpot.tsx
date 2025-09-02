import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { CreateParkingSpotData } from '@/types/parking';

interface CreateParkingSpotProps {
  coordinates: [number, number];
  onSubmit: (data: CreateParkingSpotData) => void;
  onClose: () => void;
  address: string;
}

const CreateParkingSpot: React.FC<CreateParkingSpotProps> = ({
  coordinates,
  onSubmit,
  onClose,
  address,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !pricePerHour) return;

    setIsSubmitting(true);
    
    const data: CreateParkingSpotData = {
      coordinates,
      title,
      description,
      price_per_hour: parseFloat(pricePerHour),
      address,
      image: image || undefined,
    };

    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Park yeri oluşturma hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Park Alanı Oluştur</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Konum bilgisi */}
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <MapPin className="h-4 w-4 mt-0.5 text-parking-primary" />
            <div className="text-sm">
              <div className="font-medium">Seçilen Konum</div>
              <div className="text-muted-foreground">{address}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fotoğraf yükleme */}
            <div className="space-y-2">
              <Label htmlFor="image">Park Yeri Fotoğrafı</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Park yeri önizleme"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Fotoğraf Seç
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Park yerinin net bir fotoğrafını ekleyin
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Park yeri başlığı */}
            <div className="space-y-2">
              <Label htmlFor="title">Park Yeri Başlığı *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="örn: Güvenli Kapalı Otopark"
                required
              />
            </div>

            {/* Açıklama */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Park yeri hakkında detayları yazın..."
                rows={3}
                required
              />
            </div>

            {/* Saatlik ücret */}
            <div className="space-y-2">
              <Label htmlFor="price">Saatlik Ücret (₺) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.5"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="10.00"
                required
              />
            </div>

            {/* Submit butonu */}
            <Button
              type="submit"
              className="w-full bg-parking-primary hover:bg-parking-primary/90"
              disabled={isSubmitting || !title || !description || !pricePerHour}
            >
              {isSubmitting ? 'Oluşturuluyor...' : 'Park Alanını Oluştur'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateParkingSpot;