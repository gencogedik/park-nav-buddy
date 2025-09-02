import React, { useState } from 'react';
import ParkingMap from '../components/ParkingMap';
import MapOverlay from '../components/MapOverlay';
import BottomPanel from '../components/BottomPanel';
import ParkingSpotsList from '../components/ParkingSpotsList';
import CreateParkingSpot from '../components/CreateParkingSpot';
import { toast } from '../hooks/use-toast';
import { ParkingSpot, CreateParkingSpotData } from '@/types/parking';
import { parkingApi } from '@/lib/supabase';

const Index = () => {
  const [showCampaign, setShowCampaign] = useState(true);
  const [isPanelClosed, setIsPanelClosed] = useState(false);
  const [showParkingList, setShowParkingList] = useState(false);
  const [showCreateParking, setShowCreateParking] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isMapClickEnabled, setIsMapClickEnabled] = useState(false);

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

  const handleFindParkingClick = async () => {
    try {
      const spots = await parkingApi.getNearbyParkingSpots(41.0082, 28.9784);
      setParkingSpots(spots || []);
      setShowParkingList(true);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Park yerleri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleCreateParkingClick = () => {
    setIsMapClickEnabled(true);
    toast({
      title: "Konum Seçin",
      description: "Haritada park alanı oluşturmak istediğiniz yeri tıklayın.",
    });
  };

  const handleMapClick = (coordinates: [number, number], address: string) => {
    if (isMapClickEnabled) {
      setSelectedCoordinates(coordinates);
      setSelectedAddress(address);
      setShowCreateParking(true);
      setIsMapClickEnabled(false);
    }
  };

  const handleSpotSelect = (spot: ParkingSpot) => {
    setShowParkingList(false);
    toast({
      title: spot.title,
      description: `${spot.address} - ${spot.price_per_hour}₺/saat`,
    });
  };

  const handleCreateParkingSubmit = async (data: CreateParkingSpotData) => {
    try {
      let imageUrl;
      
      if (data.image) {
        const fileName = `${Date.now()}-${data.image.name}`;
        imageUrl = await parkingApi.uploadParkingImage(data.image, fileName);
      }

      const newSpot = await parkingApi.createParkingSpot({
        coordinates: data.coordinates,
        title: data.title,
        description: data.description,
        price_per_hour: data.price_per_hour,
        address: data.address,
        image_url: imageUrl
      });

      setShowCreateParking(false);
      setSelectedCoordinates(null);
      
      toast({
        title: "Başarılı!",
        description: "Park alanınız başarıyla oluşturuldu.",
      });
      
      // Refresh parking spots list
      const spots = await parkingApi.getAllParkingSpots();
      setParkingSpots(spots || []);
      
    } catch (error) {
      console.error('Error creating parking spot:', error);
      toast({
        title: "Hata",
        description: "Park alanı oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map container */}
      <div className="absolute inset-0">
        <ParkingMap 
          onMapClick={handleMapClick}
          isMapClickEnabled={isMapClickEnabled}
          parkingSpots={parkingSpots}
        />
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
      <BottomPanel 
        onPanelStateChange={handlePanelStateChange}
        onFindParkingClick={handleFindParkingClick}
        onCreateParkingClick={handleCreateParkingClick}
      />

      {/* Parking spots list modal */}
      {showParkingList && (
        <ParkingSpotsList
          spots={parkingSpots}
          onSpotSelect={handleSpotSelect}
          onClose={() => setShowParkingList(false)}
        />
      )}

      {/* Create parking spot modal */}
      {showCreateParking && selectedCoordinates && (
        <CreateParkingSpot
          coordinates={selectedCoordinates}
          address={selectedAddress}
          onSubmit={handleCreateParkingSubmit}
          onClose={() => {
            setShowCreateParking(false);
            setSelectedCoordinates(null);
            setIsMapClickEnabled(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
