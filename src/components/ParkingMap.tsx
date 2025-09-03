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
        (error) => {
          console.log("Geolocation error:", error);
          // Kadıköy koordinatları olarak varsayılan konum ayarla
          setUserLocation([40.9884, 29.0261]);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Yandex haritasını başlat
    const initMap = async () => {
      if (!mapRef.current) return;

      // @ts-ignore
      if (window.ymaps) {
        // @ts-ignore
        window.ymaps.ready(() => {
          if (mapInstance.current) {
            mapInstance.current.destroy();
          }

          // @ts-ignore
          const map = new window.ymaps.Map(mapRef.current, {
            center: userLocation,
            zoom: 15,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstance.current = map;

          // Kullanıcı konumu işareti
          // @ts-ignore
          const userPlacemark = new window.ymaps.Placemark(
            userLocation,
            { balloonContent: "Benim Konumum" },
            { preset: "islands#blueCircleIcon" }
          );
          map.geoObjects.add(userPlacemark);

          // Park noktaları ekle
          parkingSpots.forEach((spot) => {
            // @ts-ignore
            const placemark = new window.ymaps.Placemark(
              spot.coordinates,
              {
                balloonContent: `
                  <div style="padding: 8px; max-width: 200px;">
                    <b>${spot.title}</b><br/>
                    <p style="margin: 5px 0; font-size: 12px;">${spot.description}</p>
                    <p style="margin: 5px 0;"><strong>Fiyat:</strong> ${spot.price_per_hour}₺/saat</p>
                    <p style="margin: 5px 0;"><strong>Durum:</strong> ${spot.available ? '<span style="color: green;">Müsait</span>' : '<span style="color: red;">Dolu</span>'}</p>
                    ${
                      spot.available
                        ? '<button style="padding:6px 12px;margin-top:8px;background:#22C55E;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">Rezerve Et</button>'
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
          if (onMapClick && isMapClickEnabled) {
            map.events.add('click', async (e: any) => {
              const coords = e.get('coords');
              // Daha gerçekçi bir adres oluştur
              const address = `Seçilen Konum - ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
              onMapClick([coords[0], coords[1]], address);
            });
          }
        });
      } else {
        // Yandex Maps henüz yüklenmediyse, biraz bekle ve tekrar dene
        setTimeout(() => initMap(), 500);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [userLocation, parkingSpots, onMapClick, isMapClickEnabled]);

  return <div ref={mapRef} className="w-full h-full absolute inset-0" />;
};

export default ParkingMap;
