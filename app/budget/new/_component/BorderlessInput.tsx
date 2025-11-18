'use client';

import React from 'react';

interface BorderlessInputProps {
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel' | 'url' | 'search' | 'decimal';
  className?: string;
}

export default function BorderlessInput({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  inputMode,
  className = '',
}: BorderlessInputProps) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      className={`w-full px-4 py-3 border-none outline-none bg-transparent text-body-1 text-grayscale-900 placeholder:text-grayscale-400 focus:outline-none ${className}`}
    />
  );
}

