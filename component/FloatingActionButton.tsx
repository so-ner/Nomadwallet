'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  label: string;
  href?: string; // href가 없으면 onClick 사용
  onClick?: () => void; // 클릭 핸들러 (선택사항)
  icon?: string; // 아이콘 경로 (선택사항)
}

interface FloatingActionButtonProps {
  menuItems: MenuItem[];
  buttonColor?: string;
  buttonHoverColor?: string;
  ariaLabel?: string;
}

export default function FloatingActionButton({
  menuItems,
  buttonColor = 'bg-[#4A6B87]',
  buttonHoverColor = 'hover:bg-[#3d5a73]',
  ariaLabel = 'add-action',
}: FloatingActionButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 백그라운드 (메뉴가 열렸을 때) */}
      {isMenuOpen && (
        <div
          className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-[85] bg-black/70 transition-opacity pointer-events-auto"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <div className="fixed bottom-[120px] right-5 z-[90] flex flex-col items-end md:right-[calc(50vw-300px+20px)]">
        {/* 메뉴 항목들 (메뉴가 열렸을 때) */}
        {isMenuOpen && menuItems.length > 0 && (
          <div className="mb-[18px] w-[150px] bg-white rounded-xl shadow-[0_8px_36px_0_rgba(0,0,0,0.16)] overflow-hidden">
            {menuItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === menuItems.length - 1;
              const paddingY = isFirst || isLast ? 'pt-[1.5rem] pb-[1.5rem]' : 'py-[1.4rem]';
              
              return (
                <React.Fragment key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-[1.6rem] ${paddingY} text-text-primary no-underline transition-colors hover:bg-gray-50`}
                    >
                      <Image
                        src={item.icon || "/icons/icon-plus2-20.svg"}
                        alt={item.label}
                        width={20}
                        height={20}
                      />
                      <span className="text-headline-5 font-semibold text-text-primary">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        item.onClick?.();
                      }}
                      className={`w-full flex items-center gap-3 px-[1.6rem] ${paddingY} text-text-primary bg-transparent border-none cursor-pointer transition-colors hover:bg-gray-50 text-left`}
                    >
                      <Image
                        src={item.icon || "/icons/icon-plus2-20.svg"}
                        alt={item.label}
                        width={20}
                        height={20}
                      />
                      <span className="text-headline-5 font-semibold text-text-primary">{item.label}</span>
                    </button>
                  )}
                  {index < menuItems.length - 1 && (
                    <div className="h-px bg-[#E0E0E0] mx-[1.6rem]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
        
        {/* 메인 플로팅 버튼 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-[62px] h-[62px] ${buttonColor} rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center border-none cursor-pointer ${buttonHoverColor}`}
          aria-label={ariaLabel}
        >
          <Image
            src="/icons/icon-plus2-20.svg"
            alt={isMenuOpen ? "닫기" : "열기"}
            width={24}
            height={24}
            className={`transition-transform ${isMenuOpen ? 'rotate-45' : ''}`}
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </button>
      </div>
    </>
  );
}

