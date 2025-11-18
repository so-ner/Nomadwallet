'use client';

import React from 'react';

interface BorderlessTextareaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function BorderlessTextarea({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
}: BorderlessTextareaProps) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 border-none outline-none bg-transparent text-body-1 text-grayscale-900 focus:outline-none resize-none placeholder:text-grayscale-400 ${className}`}
    />
  );
}

