'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getExpenses } from '@/lib/api/expense';
import { Expense } from '@/types/expense';
import NavigationBar from '@/component/NavigationBar';
import TopAreaMain from '@/component/top_area/TopAreaMain';
import FloatingActionButton from '@/component/FloatingActionButton';
import CalendarNavigation from './CalendarNavigation';
import ExpenseCalendar from './ExpenseCalendar';
import MonthlySummary from './MonthlySummary';
import DayDetailBottomSheet from './DayDetailBottomSheet';
import DateSelectBottomSheet from '@/component/BottomSheet/select/DateSelectBottomSheet';
import { useMonthlySummary, useDayMap } from './hooks';
import { apiFetch } from '@/lib/api/fetch';

interface ExpensePageClientProps {
  initialExpenses: Expense[];
  initialYear: number;
  initialMonth: number;
}

export default function ExpensePageClient({ 
  initialExpenses, 
  initialYear, 
  initialMonth 
}: ExpensePageClientProps) {
  const router = useRouter();
  const [cursor, setCursor] = useState<Date>(() => new Date(initialYear, initialMonth - 1, 1));
  const [openISO, setOpenISO] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDateSelectOpen, setIsDateSelectOpen] = useState(false);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  useEffect(() => {
    // 년/월이 변경될 때마다 데이터 로드 (초기 년/월 포함)
    const load = async () => {
      try {
        const { expenses: data } = await getExpenses({ year, month: month + 1 });
        setExpenses(data);
      } catch (error) {
        console.error('지출 데이터 로드 실패:', error);
        setExpenses([]);
      }
    };
    load();
  }, [year, month]);

  const calendarMonth = cursor.getMonth(); // 캘린더 표시용 (0-11)

  const summary = useMonthlySummary(year, month, expenses);
  const dayMap = useDayMap(expenses);

  const handlePrev = () => setCursor(new Date(year, calendarMonth - 1, 1));
  const handleNext = () => setCursor(new Date(year, calendarMonth + 1, 1));
  const monthLabel = `${year}.${String(month + 1).padStart(2, '0')}`;
  const openFor = (iso?: string) => {
    if (iso) setOpenISO(iso);
  };
  const close = () => setOpenISO(null);
  
  const handleDateSelect = async (dateStr: string) => {
    // dateStr 형식: "YYYY-MM" 또는 "YYYY-MM-DD"
    const parts = dateStr.split('-').map(Number);
    const selectedYear = parts[0];
    const selectedMonth = parts[1] || 1; // month는 1-12
    
    // 선택한 년/월로 cursor 업데이트 (month는 1-12이므로 0-11로 변환)
    setCursor(new Date(selectedYear, selectedMonth - 1, 1));
    
    // 데이터 다시 로드 (로딩 메시지 없이 자연스럽게 업데이트)
    try {
      const { expenses: data } = await getExpenses({ year: selectedYear, month: selectedMonth });
      setExpenses(data);
    } catch (error) {
      console.error('지출 데이터 로드 실패:', error);
      setExpenses([]);
    }
  };

  const selected = openISO ? dayMap[openISO] : undefined;
  // openISO가 "YYYY-MM-DD" 형식일 때 로컬 타임존으로 파싱
  const selectedDate = openISO ? (() => {
    const [year, month, day] = openISO.split('-').map(Number);
    return new Date(year, month - 1, day);
  })() : null;
  const selectedItems = selected ? selected.items : [];
  const selectedExpenseSum = selected ? selected.expense : 0;
  const selectedIncomeSum = selected ? selected.income : 0;

  const handleReceiptScanClick = () => {
    receiptFileInputRef.current?.click();
  };

  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiFetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('OCR 응답:', data);

      // OCR 성공 시 세션 스토리지에 저장하고 지출 추가 페이지로 이동
      if (data.success && data.data) {
        sessionStorage.setItem('ocrData', JSON.stringify({
          store: data.data.store,
          total: data.data.total,
          date: data.data.date,
        }));
        router.push('/expense/new');
      } else {
        // OCR 실패 시 에러 메시지 표시
        alert(data.message || '영수증 인식에 실패했습니다.');
      }
    } catch (error) {
      console.error('OCR 요청 실패:', error);
      alert('영수증 인식에 실패했습니다.');
    } finally {
      // 파일 input 초기화
      if (receiptFileInputRef.current) {
        receiptFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f7f7] flex flex-col pb-16 mb-[10rem]">
      <TopAreaMain />
      
      {/* 달력과 월지출/월수입 영역 */}
      <div className="flex flex-col gap-[1rem] px-[2rem] py-[1rem]">
        {/* 달력 공간 */}
        <div className="flex flex-col gap-[1.6rem]">
          <CalendarNavigation
            monthLabel={monthLabel}
            onPrev={handlePrev}
            onNext={handleNext}
            onDateClick={() => setIsDateSelectOpen(true)}
          />
          <ExpenseCalendar
            year={year}
            month={calendarMonth}
            dayMap={dayMap}
            selectedDateISO={openISO}
            onDateClick={openFor}
          />
        </div>

        {/* 월지출 월수입 영역 */}
        <MonthlySummary expense={summary.expense} income={summary.income} />
      </div>

      {/* 날짜 상세 Bottom Sheet */}
      <DayDetailBottomSheet
        isOpen={!!openISO}
        selectedDate={selectedDate}
        selectedDateISO={openISO}
        selectedItems={selectedItems}
        selectedExpenseSum={selectedExpenseSum}
        selectedIncomeSum={selectedIncomeSum}
        onClose={close}
      />

      {/* 날짜 선택 Bottom Sheet */}
      <DateSelectBottomSheet
        isOpen={isDateSelectOpen}
        onClose={() => setIsDateSelectOpen(false)}
        selectedDate={`${year}-${String(month + 1).padStart(2, '0')}`}
        onSelect={handleDateSelect}
        title="캘린더 날짜 선택"
        mode="year-month"
      />

      {/* 플로팅 버튼 */}
      <FloatingActionButton
        menuItems={[
          { 
            label: '영수증 스캔', 
            icon: '/icons/icon-scan-22.svg',
            onClick: handleReceiptScanClick
          },
          { 
            label: '내역 추가', 
            href: '/expense/new',
            icon: '/icons/icon-plus2-20.svg'
          }
        ]}
        buttonColor="bg-[#4A6B87]"
        buttonHoverColor="hover:bg-[#3d5a73]"
        ariaLabel="add-expense"
      />

      {/* 숨겨진 파일 input */}
      <input
        ref={receiptFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReceiptFileChange}
      />

      <NavigationBar />
    </div>
  );
}

