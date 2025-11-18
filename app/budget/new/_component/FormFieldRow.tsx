'use client';

import React from 'react';

interface FormFieldRowProps {
  label: string;
  children: React.ReactNode;
  labelWidth?: '80px' | '100px' | '120px';
  className?: string;
  align?: 'center' | 'start';
}

export default function FormFieldRow({
  label,
  children,
  labelWidth = '80px',
  className = '',
  align = 'center',
}: FormFieldRowProps) {
  const gridColsClass = {
    '80px': 'grid-cols-[80px_1fr]',
    '100px': 'grid-cols-[100px_1fr]',
    '120px': 'grid-cols-[120px_1fr]',
  }[labelWidth];

  const alignClass = align === 'start' ? 'items-start' : 'items-center';

  return (
    <div className={`mb-6 grid ${gridColsClass} gap-4 ${alignClass} ${className}`}>
      <label className="text-body-2 text-grayscale-700 whitespace-nowrap">{label}</label>
      {children}
    </div>
  );
}

