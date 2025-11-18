'use client';

import React from 'react';

interface NotificationToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function NotificationToggle({
  label,
  enabled,
  onChange,
  disabled = false,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between bg-white py-[1.8rem] px-[2rem]">
      <span className="text-headline-4 text-grayscale-900" style={{ fontSize: '18px' }}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-500' : 'bg-grayscale-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

