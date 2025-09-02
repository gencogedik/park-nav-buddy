import React, { useEffect, useRef, useState } from "react";

interface ParkingSpot {
  id: string;
  coordinates: [number, number];
  available: boolean;
  price?: string;
}

const ParkingMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([
    41.0082, 28.9784, // İstanbul default
  ]);

  // Örnek park alanları
  const parkingSpots: ParkingSpot[] = [
    { id: "1", coordinates: [41.0092, 28.9794], available: true, price: "5₺/saat" },
    { id: "2", coordinates: [41.0072, 28.9774], available: false, price: "8₺/saat" },
    { id: "3", coordinates: [41.0102, 28.9804], available: true, price: "6₺/saat" },
    { id: "4", coordinates: [41.0062, 28.9764], available: true, price: "7₺/saat" },
    { id: "5", coordinates: [41.0112, 28.9814], available: false, price: "9₺/saat" },
  ];

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

    // Yandex haritayı başlat
    const initMap = () => {
      if (!mapRef.current) return;

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
                <b>${spot.available ? "Müsait Park Yeri" : "Dolu Park Yeri"}</b><br/>
                Fiyat: ${spot.price}<br/>
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
              ? "islands#greenCircleIcon"
              : "islands#redCircleIcon",
          }
        );
        map.geoObjects.add(placemark);
      });
    };

    // @ts-ignore
    if (window.ymaps) {
      // @ts-ignore
      window.ymaps.ready(initMap);
    }
  }, [userLocation]);

  return <div ref={mapRef} className="w-full h-full absolute inset-0" />;
};

export default ParkingMap;
