'use client';

import Image from 'next/image';

export default function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <Image
      src={checked ? '/icons/check-on.svg' : '/icons/check-off.svg'}
      alt={checked ? '체크됨' : '체크 안됨'}
      width={24}
      height={24}
    />
  );
}

