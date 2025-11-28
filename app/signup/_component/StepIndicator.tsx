'use client';

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
            current === step ? 'bg-[#0F2B4F] text-white' : 'bg-[#D7E3EC] text-[#0F2B4F]'
          }`}
        >
          {step}
        </span>
      ))}
    </div>
  );
}

