import React, { useState } from 'react';
import { Menu, Navigation, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import UserLoginPanel from './UserLoginPanel';

interface MapOverlayProps {
  onMenuClick: () => void;
  onLocationClick: () => void;
  showCampaign?: boolean;
  onCloseCampaign?: () => void;
  isPanelClosed?: boolean;
  onLocationSelect?: () => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ 
  onMenuClick, 
  onLocationClick, 
  showCampaign = true,
  onCloseCampaign,
  isPanelClosed = false,
  onLocationSelect
}) => {
  const [isLocationSelectMode, setIsLocationSelectMode] = useState(false);
  return (
    <>
      {/* Top overlay - Menu button */}
      <div className="absolute top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="glass-morphism rounded-full w-12 h-12 shadow-lg hover:scale-105 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Kullanıcı Girişi</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <UserLoginPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Campaign Banner */}
      {showCampaign && (
        <div className="absolute top-4 left-20 right-4 z-10">
          <div className="campaign-banner rounded-lg p-3 text-white shadow-lg flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium">
                🎉 İlk park rezervasyonunuzda %50 indirim!
              </p>
            </div>
            {onCloseCampaign && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-auto"
                onClick={onCloseCampaign}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Nereye button - Center when panel is closed */}
      {isPanelClosed && (
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <Button
            className="glass-morphism rounded-full px-6 py-3 shadow-lg hover:scale-105 transition-transform bg-parking-primary hover:bg-parking-primary/90 text-white"
            onClick={() => {
              setIsLocationSelectMode(true);
              onLocationSelect?.();
            }}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Nereye?
          </Button>
        </div>
      )}

      {/* Location button - Bottom right */}
      <div className="absolute bottom-32 right-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="glass-morphism rounded-full w-12 h-12 shadow-lg hover:scale-105 transition-transform"
          onClick={onLocationClick}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Location selection mode overlay */}
      {isLocationSelectMode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="glass-morphism rounded-lg p-4 mx-4">
            <p className="text-foreground mb-4">Haritadan konum seçin</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsLocationSelectMode(false)}
              >
                İptal
              </Button>
              <Button
                className="bg-parking-primary hover:bg-parking-primary/90"
                onClick={() => setIsLocationSelectMode(false)}
              >
                Onayla
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapOverlay;