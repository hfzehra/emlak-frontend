﻿import React from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * Telefon numarasını görsel formatta gösterir: 0(5XX) XXX XX XX
 * 11 haneli (0 ile başlar, 5 ile devam eder)
 */
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11); // Maksimum 11 hane
  if (digits.length === 0) return '0(5';
  
  // İlk rakam her zaman 0 olmalı
  let normalized = digits;
  if (digits[0] !== '0') {
    normalized = '0' + digits;
  }
  normalized = normalized.slice(0, 11);
  
  // İkinci rakam her zaman 5 olmalı
  if (normalized.length >= 2 && normalized[1] !== '5') {
    normalized = normalized[0] + '5' + normalized.slice(2);
  }
  if (normalized.length === 1) {
    normalized = normalized + '5';
  }
  
  // Formatla
  if (normalized.length <= 1) return '0(5';
  if (normalized.length <= 4) return `${normalized[0]}(${normalized.slice(1)}`;
  if (normalized.length <= 7) return `${normalized[0]}(${normalized.slice(1, 4)}) ${normalized.slice(4)}`;
  if (normalized.length <= 9) return `${normalized[0]}(${normalized.slice(1, 4)}) ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
  return `${normalized[0]}(${normalized.slice(1, 4)}) ${normalized.slice(4, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = '0(5XX) XXX XX XX',
  className,
  required,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Kullanıcı inputu al
    let inputValue = e.target.value;
    
    // Sadece rakamları al
    let raw = inputValue.replace(/\D/g, '');
    
    // İlk rakam 0 değilse ya da boşsa, 0 ile başlat
    if (raw.length === 0 || raw[0] !== '0') {
      raw = '0' + raw.replace(/^0+/, '');
    }
    
    // İkinci rakam 5 değilse, 5 yap
    if (raw.length >= 2 && raw[1] !== '5') {
      raw = raw[0] + '5' + raw.slice(2);
    } else if (raw.length === 1) {
      raw = '05';
    }
    
    // Maksimum 11 hane
    raw = raw.slice(0, 11);
    
    onChange(raw);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace/Delete haricinde, 0(5 kısmını silmeyi engelle
    const cursorPos = (e.target as HTMLInputElement).selectionStart || 0;
    if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPos <= 4) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="tel"
      value={formatPhoneDisplay(value)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      required={required}
      maxLength={17} // Format: 0(XXX) XXX XX XX = 17 karakter
    />
  );
};

