'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Travel} from '@/types/travel';
import BudgetCard from '@/component/budget/BudgetCard';
import NavigationBar from '@/component/NavigationBar';
import TopAreaMain from '@/component/top_area/TopAreaMain';
import {getTravels} from '@/lib/api/travel';

const BudgetPage: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchTravels = async () => {
    try {
      const data = await getTravels();
      setTravels(data.travels || []);
    } catch (_e) {
      setTravels([]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getTravels();
        if (isMounted) {
          setTravels(data.travels || []);
        }
      } catch (_e) {
        if (isMounted) {
          setTravels([]);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const hasData = travels.length > 0;

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-40px)]">
      <TopAreaMain title="NOMAD WALLET" />
      <main className="py-[35px] px-[20px] flex-1 flex flex-col gap-[16px]">
        {!hasData ? (
          <div className="flex flex-col items-center pt-40 px-4 pb-12 text-center">
            <div className="mb-8 flex items-center justify-center">
              <Image
                src="/empty-list-b.png"
                alt="바다표범"
                width={200}
                height={200}
                priority
                className="grayscale"
              />
            </div>
            <h2 className="text-headline-1 text-grayscale-600 mt-[32px] mb-2">예산 목록이 없어요</h2>
            <p className="text-body-3 text-grayscale-600 mt-[12px]">첫 예산을 추가해</p>
            <p className="text-body-3 text-grayscale-600">지출을 스마트하게 관리해볼까요?</p>
          </div>
        ) : (
          travels.map((t) => (
            <BudgetCard key={t.travel_id} budget={t} onDelete={fetchTravels} />
          ))
        )}
      </main>
      
      <div className="fixed bottom-[120px] right-5 z-[90] flex flex-col items-end md:right-[calc(50vw-300px+20px)]">
        {/* 예산 추가 버튼 (메뉴가 열렸을 때) */}
        {isMenuOpen && (
          <Link
            href="/budget/new"
            onClick={() => setIsMenuOpen(false)}
            className="mb-[18px] w-[150px] h-[51px] px-[16px] py-[15px] bg-white border-2 rounded-[12px] shadow-[0_8px_36px_0_rgba(0,0,0,0.16)] inline-flex items-center gap-[9px] text-text-primary"
          >
            <Image
              src="/icons/icon-plus2-20.svg"
              alt="추가"
              width={20}
              height={20}
            />
            <span className="text-headline-5 font-text-primary">예산 추가</span>
          </Link>
        )}
        
        {/* 메인 플로팅 버튼 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-[62px] h-[62px] bg-primary-500 rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center hover:bg-primary-600"
          aria-label="add-budget"
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
      
      <NavigationBar />
    </div>
  );
};

export default BudgetPage;


