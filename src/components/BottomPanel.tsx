import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Plus, Clock, CreditCard } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface BottomPanelProps {
  onPanelStateChange?: (isOpen: boolean) => void;
  onFindParkingClick: () => void;
  onCreateParkingClick: () => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({ 
  onPanelStateChange, 
  onFindParkingClick, 
  onCreateParkingClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [panelHeight, setPanelHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const minHeight = 80;
  const maxHeight = window.innerHeight * 0.8;

  // Handle drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(panelHeight);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(panelHeight);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      setPanelHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.touches[0].clientY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      // Snap to positions
      if (panelHeight < 120) {
        setPanelHeight(minHeight);
        setIsExpanded(false);
        onPanelStateChange?.(false);
      } else if (panelHeight > maxHeight * 0.4) {
        setPanelHeight(maxHeight);
        setIsExpanded(true);
        onPanelStateChange?.(true);
      } else {
        setPanelHeight(200);
        setIsExpanded(false);
        onPanelStateChange?.(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startY, startHeight, panelHeight, maxHeight, onPanelStateChange]);

  const actionCards = [
    {
      id: 'find-parking',
      title: 'Park Yeri Bul',
      description: 'Yakınınızdaki müsait park yerlerini görün',
      icon: MapPin,
      color: 'bg-parking-primary',
    },
    {
      id: 'create-parking',
      title: 'Park Alanı Oluştur',
      description: 'Kendi park alanınızı paylaşın',
      icon: Plus,
      color: 'bg-parking-secondary',
    },
    {
      id: 'recent-parking',
      title: 'Son Kullanılan',
      description: 'Geçmiş park rezervasyonlarınız',
      icon: Clock,
      color: 'bg-parking-success',
    },
    {
      id: 'payment',
      title: 'Ödeme Yöntemleri',
      description: 'Kartlarınızı yönetin',
      icon: CreditCard,
      color: 'bg-muted',
    },
  ];

  return (
    <div 
      ref={panelRef}
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{ height: `${panelHeight}px` }}
    >
      {/* Handle bar */}
      <div 
        className="flex justify-center py-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-12 h-1 bg-muted-foreground/50 rounded-full"></div>
      </div>

      {/* Panel content */}
      <div className="glass-morphism rounded-t-3xl px-6 pb-6 h-full overflow-y-auto">
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Nereye?"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-11 h-12 text-base rounded-xl border-0 bg-white/80 shadow-sm"
          />
        </div>

        {/* Action cards grid */}
        <div className="grid grid-cols-2 gap-4">
          {actionCards.map((card) => {
            const IconComponent = card.icon;
            
            const handleCardClick = () => {
              if (card.id === 'find-parking') {
                onFindParkingClick();
              } else if (card.id === 'create-parking') {
                onCreateParkingClick();
              }
            };
            
            return (
              <Card 
                key={card.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 bg-white/90"
                onClick={handleCardClick}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Expanded content */}
        {panelHeight > 300 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="space-y-4">
              <Button 
                className="w-full h-12 rounded-xl bg-parking-primary hover:bg-parking-primary/90 text-white font-medium"
              >
                Hemen Park Et
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-10 rounded-lg"
                >
                  Rezervasyonlarım
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10 rounded-lg"
                >
                  Favorilerim
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;