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
    40.9884, 29.0261, // Kadıköy default - sample data merkezinde
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
          // Kadıköy koordinatlarını varsayılan olarak kullan
          setUserLocation([40.9884, 29.0261]);
        }
      );
    }

    // Yandex haritasını başlat
    const initMap = () => {
      if (!mapRef.current) return;

      // @ts-ignore
      if (typeof window.ymaps !== 'undefined') {
        // @ts-ignore
        window.ymaps.ready(() => {
          if (mapInstance.current) {
            mapInstance.current.destroy();
          }

          // @ts-ignore
          const map = new window.ymaps.Map(mapRef.current, {
            center: [userLocation[0], userLocation[1]],
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstance.current = map;

          // Kullanıcı konumu işareti
          // @ts-ignore
          const userPlacemark = new window.ymaps.Placemark(
            [userLocation[0], userLocation[1]],
            { 
              balloonContent: "Mevcut Konumum",
              hintContent: "Buradasınız"
            },
            { 
              preset: "islands#blueCircleIcon",
              iconColor: '#007ACC'
            }
          );
          map.geoObjects.add(userPlacemark);

          // Park noktaları ekle
          parkingSpots.forEach((spot) => {
            // @ts-ignore
            const placemark = new window.ymaps.Placemark(
              [spot.coordinates[0], spot.coordinates[1]],
              {
                balloonContent: `
                  <div style="padding:8px; max-width:200px;">
                    <h4 style="margin:0 0 8px 0; font-size:14px; font-weight:bold;">${spot.title}</h4>
                    <p style="margin:0 0 8px 0; font-size:12px; color:#666;">${spot.description}</p>
                    <div style="margin:4px 0;">
                      <strong style="color:#22C55E;">₺${spot.price_per_hour}/saat</strong>
                    </div>
                    <div style="margin:4px 0;">
                      <span style="color:${spot.available ? '#22C55E' : '#EF4444'}; font-weight:bold;">
                        ${spot.available ? '✓ Müsait' : '✗ Dolu'}
                      </span>
                    </div>
                    <div style="margin:4px 0; font-size:11px; color:#999;">
                      📍 ${spot.address}
                    </div>
                    ${spot.available ? 
                      '<button style="padding:6px 12px; margin-top:8px; background:#22C55E; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:12px;">Rezerve Et</button>' 
                      : ''}
                  </div>
                `,
                hintContent: `${spot.title} - ₺${spot.price_per_hour}/saat`
              },
              {
                preset: spot.available ? "islands#greenDotIcon" : "islands#redDotIcon"
              }
            );
            map.geoObjects.add(placemark);
          });

          // Harita tıklama olayı
          if (onMapClick && isMapClickEnabled) {
            map.events.add('click', async (e: any) => {
              const coords = e.get('coords');
              
              // Yandex Geocoder ile gerçek adres al (opsiyonel)
              const address = `Seçilen Konum, İstanbul (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`;
              onMapClick([coords[0], coords[1]], address);
            });
            
            // Harita imlecini değiştir
            map.cursors.push('crosshair');
          } else {
            map.cursors.push('grab');
          }
        });
      } else {
        // Yandex Maps henüz yüklenmemişse, biraz bekleyip tekrar dene
        setTimeout(() => {
          initMap();
        }, 1000);
      }
    };

    // Haritayı başlat
    const timeoutId = setTimeout(() => {
      initMap();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [userLocation, parkingSpots, isMapClickEnabled, onMapClick]);

  return <div ref={mapRef} className="w-full h-full absolute inset-0" />;
};

export default ParkingMap;