import { useEffect, useRef, useState } from 'react';

/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

// Google Maps API script yükleme
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=tr`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script yüklenemedi'));
    document.head.appendChild(script);
  });
};

export const GoogleAddressInput = ({ value, onChange, placeholder }: GoogleAddressInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Maps API Key - .env dosyasından alınacak
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API Key tanımlanmamış. Lütfen .env dosyasına VITE_GOOGLE_MAPS_API_KEY ekleyin.');
      setIsLoading(false);
      return;
    }

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(() => {
        if (!inputRef.current) return;

        // Autocomplete oluştur - Sadece Türkiye adresleri
        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'tr' },
          fields: ['address_components', 'formatted_address', 'geometry'],
          types: ['address']
        });

        // Adres seçildiğinde
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (!place || !place.formatted_address) return;

          // Tam adresten kısa adres çıkar (il ve ilçe hariç)
          let shortAddress = place.formatted_address;
          
          // Posta kodu ve ülkeyi temizle
          shortAddress = shortAddress.replace(/\d{5}/g, '').replace(/Türkiye/gi, '').replace(/Turkey/gi, '');
          
          // İl ve ilçeyi temizle (zaten başka alanlarda var)
          const addressComponents = place.address_components || [];
          const city = addressComponents.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('administrative_area_level_1'))?.long_name;
          const district = addressComponents.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('administrative_area_level_2'))?.long_name;
          
          if (city) shortAddress = shortAddress.replace(city, '');
          if (district) shortAddress = shortAddress.replace(district, '');
          
          // Virgül ve boşlukları temizle
          shortAddress = shortAddress.replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '').trim();

          onChange(shortAddress);
        });

        setIsLoading(false);
      })
      .catch(err => {
        console.error('Google Maps yükleme hatası:', err);
        setError('Google Maps yüklenemedi. Manuel olarak adres girebilirsiniz.');
        setIsLoading(false);
      });

    return () => {
      if (autocompleteRef.current && typeof window !== 'undefined' && window.google?.maps) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);

  if (error) {
    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Adres giriniz'}
          style={{ width: '100%' }}
        />
        <small style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
          ⚠️ {error}
        </small>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Adres aramaya başlayın...'}
        disabled={isLoading}
        style={{ width: '100%' }}
      />
      {isLoading && (
        <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
          🔄 Google Maps yükleniyor...
        </small>
      )}
      {!isLoading && !error && (
        <small style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
          ✅ Adres aramaya başlayın, öneriler otomatik gelecek
        </small>
      )}
    </div>
  );
};

