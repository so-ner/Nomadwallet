'use client';

import React from 'react';

type TravelType = 'domestic' | 'international';

interface CountryRadioButtonsProps {
  value: TravelType;
  onChange: (type: TravelType) => void;
}

export default function CountryRadioButtons({
  value,
  onChange,
}: CountryRadioButtonsProps) {
  const isDomestic = value === 'domestic';

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('international')}
        className={`flex-1 px-4 py-3 rounded-full text-body-2 font-medium transition-colors ${
          !isDomestic
            ? 'bg-primary-500 text-white'
            : 'bg-grayscale-200 text-grayscale-600'
        }`}
      >
        해외
      </button>
      <button
        type="button"
        onClick={() => onChange('domestic')}
        className={`flex-1 px-4 py-3 rounded-full text-body-2 font-medium transition-colors ${
          isDomestic
            ? 'bg-primary-500 text-white'
            : 'bg-grayscale-200 text-grayscale-600'
        }`}
      >
        국내
      </button>
    </div>
  );
}

