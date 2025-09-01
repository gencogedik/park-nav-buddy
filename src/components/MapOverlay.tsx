import React from 'react';
import { Menu, Navigation, X } from 'lucide-react';
import { Button } from './ui/button';

interface MapOverlayProps {
  onMenuClick: () => void;
  onLocationClick: () => void;
  showCampaign?: boolean;
  onCloseCampaign?: () => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ 
  onMenuClick, 
  onLocationClick, 
  showCampaign = true,
  onCloseCampaign 
}) => {
  return (
    <>
      {/* Top overlay - Menu button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="glass-morphism rounded-full w-12 h-12 shadow-lg hover:scale-105 transition-transform"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
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
    </>
  );
};

export default MapOverlay;