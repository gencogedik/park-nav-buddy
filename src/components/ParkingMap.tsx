import React, { useEffect, useRef, useState } from "react";
import { ParkingSpot } from '@/types/parking';

interface ParkingMapProps {
  onMapClick?: (coordinates: [number, number], address: string) => void;
  isMapClickEnabled?: boolean;
  parkingSpots?: ParkingSpot[];
}

const ParkingMap: React.FC<ParkingMapProps> = ({ 
  onMapClick, 
  isMapClickEnabled = false,
  parkingSpots = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([
    41.0082, 28.9784, // İstanbul default
  ]);

  const mapInstance = useRef<any | null>(null);

  useEffect(() => {
    // Kullanıcı konumunu al
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.log("Geolocation error:", error)
      );
    }

    // Mapbox haritasını başlat
    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;

      // Geçici olarak Mapbox token olmadan yandex haritasını kullan
      // @ts-ignore
      if (window.ymaps) {
        // @ts-ignore
        window.ymaps.ready(() => {
          // @ts-ignore
          const map = new window.ymaps.Map(mapRef.current, {
            center: [userLocation[0], userLocation[1]],
            zoom: 15,
          });

          // Kullanıcı konumu işareti
          // @ts-ignore
          const userPlacemark = new window.ymaps.Placemark(
            [userLocation[0], userLocation[1]],
            { balloonContent: "Benim Konumum" },
            { preset: "islands#blueCircleIcon" }
          );
          map.geoObjects.add(userPlacemark);

          // Park noktaları ekle
          parkingSpots.forEach((spot) => {
            // @ts-ignore
            const placemark = new window.ymaps.Placemark(
              [spot.coordinates[0], spot.coordinates[1]],
              {
                balloonContent: `
                  <div>
                    <b>${spot.title}</b><br/>
                    ${spot.description}<br/>
                    Fiyat: ${spot.price_per_hour}₺/saat<br/>
                    ${spot.available ? 'Müsait' : 'Dolu'}<br/>
                    ${
                      spot.available
                        ? "<button style='padding:4px 8px;margin-top:4px;background:#22C55E;color:#fff;border:none;border-radius:4px;'>Rezerve Et</button>"
                        : ""
                    }
                  </div>
                `,
              },
              {
                preset: spot.available
                  ? "islands#greenDotIcon"
                  : "islands#redDotIcon",
              }
            );
            map.geoObjects.add(placemark);
          });

          // Harita tıklama olayı
          if (onMapClick) {
            map.events.add('click', async (e: any) => {
              if (isMapClickEnabled) {
                const coords = e.get('coords');
                // Reverse geocoding için basit bir adres oluştur
                const address = `Seçilen Konum (${coords[0].toFixed(6)}, ${coords[1].toFixed(6)})`;
                onMapClick([coords[0], coords[1]], address);
              }
            });
          }
        });
      }
    };

    initMap();
  }, [userLocation]);

  return <div ref={mapRef} className="w-full h-full absolute inset-0" />;
};

export default ParkingMap;
