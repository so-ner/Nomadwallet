'use client';

export default function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex items-center justify-center w-6 h-6 rounded-full border ${
        checked ? 'bg-[#0F2B4F] border-[#0F2B4F] text-white' : 'border-[#D0D5DD] text-transparent'
      }`}
    >
      ✓
    </span>
  );
}

