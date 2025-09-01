import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface ParkingSpot {
  id: string;
  coordinates: [number, number];
  available: boolean;
  price?: string;
}

const ParkingMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([41.0082, 28.9784]); // Istanbul coordinates as default
  
  // Mock parking spots data
  const parkingSpots: ParkingSpot[] = [
    { id: '1', coordinates: [41.0092, 28.9794], available: true, price: '5₺/saat' },
    { id: '2', coordinates: [41.0072, 28.9774], available: false, price: '8₺/saat' },
    { id: '3', coordinates: [41.0102, 28.9804], available: true, price: '6₺/saat' },
    { id: '4', coordinates: [41.0062, 28.9764], available: true, price: '7₺/saat' },
    { id: '5', coordinates: [41.0112, 28.9814], available: false, price: '9₺/saat' },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default Istanbul coordinates
        }
      );
    }

    // Initialize map with a placeholder token (user will need to add their own)
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [userLocation[1], userLocation[0]],
      zoom: 16,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Add user location marker
    const userMarker = new mapboxgl.Marker({
      color: '#3B82F6',
      scale: 1.2,
    })
      .setLngLat([userLocation[1], userLocation[0]])
      .addTo(map.current);

    // Add parking spot markers
    parkingSpots.forEach((spot) => {
      const markerElement = document.createElement('div');
      markerElement.className = `parking-marker ${spot.available ? 'available' : 'occupied'}`;
      markerElement.innerHTML = `
        <div class="parking-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z" fill="${spot.available ? '#22C55E' : '#EF4444'}" stroke="white" stroke-width="2"/>
            <path d="M9 8H13C14.1046 8 15 8.89543 15 10V11C15 12.1046 14.1046 13 13 13H11V16H9V8ZM11 10V11H13V10H11Z" fill="white"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([spot.coordinates[1], spot.coordinates[0]])
        .addTo(map.current!);

      // Add popup on click
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="parking-popup">
            <h3>${spot.available ? 'Müsait Park Yeri' : 'Dolu Park Yeri'}</h3>
            <p>Fiyat: ${spot.price}</p>
            ${spot.available ? '<button class="reserve-btn">Rezerve Et</button>' : ''}
          </div>
        `);

      marker.getElement().addEventListener('click', () => {
        popup.setLngLat([spot.coordinates[1], spot.coordinates[0]]).addTo(map.current!);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default ParkingMap;
