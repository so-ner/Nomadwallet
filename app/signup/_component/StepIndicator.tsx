'use client';

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-headline-5 font-semibold border-[0.2rem] border-[#B5E6F3] box-border ${
            current === step
              ? 'bg-[#326789] text-white'
              : 'bg-[#87C4DB] text-white'
          }`}
        >
          {step}
        </span>
      ))}
    </div>
  );
}

