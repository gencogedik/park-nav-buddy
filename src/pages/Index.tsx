import React, { useState } from 'react';
import ParkingMap from '../components/ParkingMap';
import MapOverlay from '../components/MapOverlay';
import BottomPanel from '../components/BottomPanel';
import { toast } from '../hooks/use-toast';

const Index = () => {
  const [showCampaign, setShowCampaign] = useState(true);

  const handleMenuClick = () => {
    toast({
      title: "Menü",
      description: "Menü özelliği yakında eklenecek!",
    });
  };

  const handleLocationClick = () => {
    toast({
      title: "Konum",
      description: "Konumunuz güncelleniyor...",
    });
  };

  const handleCloseCampaign = () => {
    setShowCampaign(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map container */}
      <div className="absolute inset-0">
        <ParkingMap />
      </div>

      {/* Map overlay elements */}
      <MapOverlay
        onMenuClick={handleMenuClick}
        onLocationClick={handleLocationClick}
        showCampaign={showCampaign}
        onCloseCampaign={handleCloseCampaign}
      />

      {/* Bottom panel */}
      <BottomPanel />

      {/* Mapbox token notice - remove this after adding your token */}
      <div className="absolute top-20 left-4 right-4 z-40">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <p className="text-sm">
            <strong>Geliştirici Notu:</strong> Mapbox API anahtarınızı ekleyin. 
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              mapbox.com
            </a> adresinden token alabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
