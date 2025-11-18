import React from 'react';

interface AccountActionItemProps {
  title: string;
  onClick?: () => void;
  textColor?: string;
}

export default function AccountActionItem({ title, onClick, textColor = 'text-grayscale-500' }: AccountActionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full"
    >
      <div className="flex items-center justify-between bg-white py-[1.8rem] px-[2rem]">
        <span className={`text-headline-4 ${textColor}`} style={{ fontSize: '18px' }}>
          {title}
        </span>
      </div>
    </button>
  );
}

