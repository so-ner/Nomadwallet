'use client';

import React from 'react';
import Image from 'next/image';
import dayjs from '@/lib/dayjs';

interface DateSelectFieldProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  placeholder?: string;
}

export default function DateSelectField({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  placeholder = '시작일 ~ 종료일',
}: DateSelectFieldProps) {
  const formattedStartDate = startDate ? dayjs(startDate).format('YY.MM.DD') : '';
  const formattedEndDate = endDate ? dayjs(endDate).format('YY.MM.DD') : '';
  const hasDates = formattedStartDate && formattedEndDate;

  return (
    <div className="relative">
      <div className="w-full px-4 py-3 border border-grayscale-300 rounded-lg text-body-1 text-grayscale-900 flex items-center justify-between bg-white">
        <span className={hasDates ? 'text-grayscale-900' : 'text-grayscale-400'}>
          {hasDates ? `${formattedStartDate} ~ ${formattedEndDate}` : placeholder}
        </span>
        <Image
          src="/icons/icon-arrow_right-24.svg"
          alt="선택"
          width={24}
          height={24}
        />
      </div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        required
      />
    </div>
  );
}

