'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {Travel} from '@/types/travel';
import BudgetCard from '@/component/budget/BudgetCard';
import NavigationBar from '@/component/NavigationBar';
import TopAreaMain from '@/component/top_area/TopAreaMain';
import FloatingActionButton from '@/component/FloatingActionButton';
import {getTravels} from '@/lib/api/travel';

const BudgetPage: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);

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
      
      {/* 플로팅 버튼 */}
      <FloatingActionButton
        menuItems={[
          { label: '예산 추가', href: '/budget/new' }
        ]}
        buttonColor="bg-primary-500"
        buttonHoverColor="hover:bg-primary-600"
        ariaLabel="add-budget"
      />
      
      <NavigationBar />
    </div>
  );
};

export default BudgetPage;


