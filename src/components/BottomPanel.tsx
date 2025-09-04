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

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
    onPanelStateChange?.(!isExpanded);
  };

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
    <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out ${
      isExpanded ? 'h-[80vh]' : 'h-[240px]'
    }`}>
      {/* Handle bar */}
      <div 
        className="flex justify-center py-2 cursor-pointer active:scale-95 transition-transform"
        onClick={togglePanel}
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
        {isExpanded && (
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