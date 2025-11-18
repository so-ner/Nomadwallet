import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuItemProps {
  title: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function MenuItem({ title, children, href, onClick }: MenuItemProps) {
  const content = (
    <div className="flex items-center justify-between bg-white py-[1.8rem] px-[2rem]">
      <span className="text-headline-4 text-grayscale-900" style={{ fontSize: '18px' }}>
        {title}
      </span>
      <div className="text-body-4 text-[#9EA0A3]">
        {children ? (
          children
        ) : (
          <Image
            src="/icons/icon-arrow_right-24.svg"
            alt="arrow"
            width={24}
            height={24}
          />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full">
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
}

