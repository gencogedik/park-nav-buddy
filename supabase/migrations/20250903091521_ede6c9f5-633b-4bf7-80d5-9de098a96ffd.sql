-- Add sample parking spots for Kadıköy area (fixed array syntax)
INSERT INTO parking_spots (coordinates, title, description, price_per_hour, address, owner_id, available) VALUES
('{40.9884, 29.0261}', 'Kadıköy İskele Otopark', 'Sahile yakın güvenli otopark alanı. 24/7 güvenlik var.', 15.00, 'Kadıköy İskele Meydanı, İstanbul', 'system', true),
('{40.9897, 29.0285}', 'Bahariye Caddesi Park Yeri', 'Alışveriş merkezine yürüme mesafesinde park alanı.', 12.50, 'Bahariye Cd. No:45, Kadıköy/İstanbul', 'system', true),
('{40.9871, 29.0334}', 'Moda Sahil Park', 'Moda sahiline çok yakın, temiz ve güvenli park alanı.', 18.00, 'Moda Cd., Caferağa, Kadıköy/İstanbul', 'system', true),
('{40.9832, 29.0198}', 'Haydarpaşa İstasyonu Yakını', 'Tarihi istasyon yakınında uygun fiyatlı park yeri.', 10.00, 'Haydarpaşa Cd., Kadıköy/İstanbul', 'system', true),
('{40.9912, 29.0301}', 'Kadıköy Çarşı İçi', 'Çarşı alışverişi için ideal konum, kameralarla korumalı.', 14.00, 'Serasker Cd., Kadıköy/İstanbul', 'system', true),
('{40.9856, 29.0267}', 'Fenerbahçe Park Yeri', 'Fenerbahçe semtinde sakin bir park alanı.', 13.50, 'Fenerbahçe Cd., Kadıköy/İstanbul', 'system', false),
('{40.9889, 29.0245}', 'Rıhtım Park Alanı', 'Deniz manzaralı, hava almak için ideal park yeri.', 16.50, 'Rıhtım Cd., Kadıköy/İstanbul', 'system', true);