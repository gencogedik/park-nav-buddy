import React from 'react';
import { MapPin, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ParkingSpot } from '@/types/parking';

interface ParkingSpotsListProps {
  spots: ParkingSpot[];
  onSpotSelect: (spot: ParkingSpot) => void;
  onClose: () => void;
}

const ParkingSpotsList: React.FC<ParkingSpotsListProps> = ({
  spots,
  onSpotSelect,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full max-h-[80vh] bg-white rounded-t-3xl">
        <div className="sticky top-0 bg-white p-6 border-b rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Yakındaki Park Yerleri</h2>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {spots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Yakınınızda park yeri bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-4">
              {spots.map((spot) => (
                <Card
                  key={spot.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onSpotSelect(spot)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {spot.image_url && (
                        <img
                          src={spot.image_url}
                          alt={spot.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{spot.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {spot.address}
                            </p>
                            <p className="text-sm">{spot.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-parking-primary">
                              {spot.price_per_hour}₺/saat
                            </div>
                            <div className={`text-sm ${spot.available ? 'text-green-600' : 'text-red-600'}`}>
                              {spot.available ? 'Müsait' : 'Dolu'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>5 dk yürüyüş</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Popüler</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingSpotsList;