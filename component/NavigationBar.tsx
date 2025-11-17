'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: '/icons/icon-chat.svg',
      text: '지출',
      url: '/expense',
    },
    {
      icon: '/icons/icon-budget.svg',
      text: '예산',
      url: '/budget',
    },
    {
      icon: '/icons/icon-account.svg',
      text: '마이페이지',
      url: '/mypage',
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '0.6rem',
        paddingBottom: '3.5rem',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E0E0E0',
      }}
      className="md:max-w-[600px] md:left-1/2 md:-translate-x-1/2"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6.6rem',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.url}
              href={item.url}
              style={{
                textDecoration: 'none',
              }}
            >
              <Navigation
                icon={item.icon}
                text={item.text}
                isOn={isActive}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

