﻿import React from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * Telefon numarasını görsel formatta gösterir: 5(XXX) XXX XX XX
 * Başında 0 olmadan, tam 10 haneli
 */
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10); // Maksimum 10 hane
  if (digits.length === 0) return '';
  if (digits.length <= 1) return digits;
  if (digits.length <= 4) return `${digits[0]}(${digits.slice(1)}`;
  if (digits.length <= 7) return `${digits[0]}(${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `${digits[0]}(${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `${digits[0]}(${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 10)}`;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = '5(XXX) XXX XX XX',
  className,
  required,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakamları al, maksimum 10 hane
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(raw);
  };

  return (
    <input
      type="tel"
      value={formatPhoneDisplay(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      maxLength={17} // Format: 5(XXX) XXX XX XX = 17 karakter
    />
  );
};

