import React, { useState } from 'react';
import ParkingMap from '../components/ParkingMap';
import MapOverlay from '../components/MapOverlay';
import BottomPanel from '../components/BottomPanel';
import { toast } from '../hooks/use-toast';

const Index = () => {
  const [showCampaign, setShowCampaign] = useState(true);
  const [isPanelClosed, setIsPanelClosed] = useState(false);

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

  const handlePanelStateChange = (isOpen: boolean) => {
    setIsPanelClosed(!isOpen);
  };

  const handleLocationSelect = () => {
    toast({
      title: "Konum Seçimi",
      description: "Haritadan istediğiniz konumu seçebilirsiniz.",
    });
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
        isPanelClosed={isPanelClosed}
        onLocationSelect={handleLocationSelect}
      />

      {/* Bottom panel */}
      <BottomPanel onPanelStateChange={handlePanelStateChange} />
    </div>
  );
};

export default Index;
