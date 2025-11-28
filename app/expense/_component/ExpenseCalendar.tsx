import { useMemo } from 'react';
import { ymd, weekdayShort, getDaysInMonth, getFirstWeekday, nfmt } from './utils';

interface CalendarCell {
  label?: number;
  dateISO?: string;
  outside?: boolean;
  prevMonth?: boolean;
}

interface DayData {
  expense: number;
  income: number;
}

interface ExpenseCalendarProps {
  year: number;
  month: number;
  dayMap: Record<string, DayData & { items: any[] }>;
  selectedDateISO: string | null;
  onDateClick: (iso?: string) => void;
}

export default function ExpenseCalendar({
  year,
  month,
  dayMap,
  selectedDateISO,
  onDateClick,
}: ExpenseCalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);

  const cells = useMemo<CalendarCell[]>(() => {
    const arr: CalendarCell[] = [];
    
    // 이전 달의 마지막 날짜들 계산
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevDaysInMonth = getDaysInMonth(prevYear, prevMonth);
    
    // 이전 달의 마지막 날짜들 추가
    for (let i = 0; i < firstWeekday; i++) {
      const day = prevDaysInMonth - firstWeekday + i + 1;
      const iso = ymd(new Date(prevYear, prevMonth, day));
      arr.push({ label: day, dateISO: iso, outside: true, prevMonth: true });
    }
    
    // 현재 달의 날짜들 추가
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = ymd(new Date(year, month, d));
      arr.push({ label: d, dateISO: iso });
    }
    
    // 다음 달의 날짜들 추가 (42개 셀을 채우기 위해)
    const remainingCells = 42 - arr.length;
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const iso = ymd(new Date(nextYear, nextMonth, d));
      arr.push({ label: d, dateISO: iso, outside: true });
    }
    
    return arr;
  }, [firstWeekday, daysInMonth, month, year]);

  return (
    <div className="py-[2.2rem] px-[1.6rem] rounded-[12px] bg-white">
      <div className="grid grid-cols-7 gap-x-[1.4rem] gap-y-[1.4rem]">
        {/* 요일 라인 */}
        {weekdayShort.map((w) => (
          <div key={w} className="text-center text-body-5 font-medium text-grayscale-700">
            {w}
          </div>
        ))}
        
        {/* 날짜 셀들 */}
        {cells.map((c, i) => {
            const val = c.dateISO ? dayMap[c.dateISO] : undefined;
            const isToday = c.dateISO === ymd(new Date());
            const isSelected = c.dateISO === selectedDateISO;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onDateClick(c.dateISO)}
                className="flex flex-col items-center bg-white cursor-pointer p-0 transition-colors min-h-[4.8rem]"
              >
                {c.label ? (
                  <div className={`w-[3.2rem] h-[3.2rem] flex items-center justify-center text-body-5 font-medium rounded-full ${
                    c.prevMonth || c.outside
                      ? 'text-grayscale-400' 
                      : isToday
                        ? 'bg-primary-500 text-text-on-color'
                        : isSelected
                          ? 'bg-primary-200 text-grayscale-900'
                          : 'text-grayscale-900'
                  }`}>
                    {c.label}
                  </div>
                ) : null}

                {val && (val.expense > 0 || val.income > 0) && (
                  <div className="flex flex-col gap-0.5 items-center mt-0.5">
                    {val.expense > 0 && (
                      <div 
                        className="text-center font-medium"
                        style={{
                          color: 'var(--spend, #FF3C40)',
                          fontSize: '10px',
                          lineHeight: '16px',
                          letterSpacing: '-0.25px',
                        }}
                      >
                        -{new Intl.NumberFormat('ko-KR').format(val.expense)}
                      </div>
                    )}
                    {val.income > 0 && (
                      <div 
                        className="text-center font-medium"
                        style={{
                          color: 'var(--income, #5C97E9)',
                          fontSize: '10px',
                          lineHeight: '16px',
                          letterSpacing: '-0.25px',
                        }}
                      >
                        +{new Intl.NumberFormat('ko-KR').format(val.income)}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}

