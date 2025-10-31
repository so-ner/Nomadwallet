'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getExpenses } from '@/lib/api/expense';
import { Expense, DayExpenseSummary } from '@/types/expense';
import BottomTabBar from '@/component/bottom/BottomTabBar';


const ymd = (d: Date) => d.toISOString().slice(0, 10);
const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirstWeekday = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0=Sun
const WEEKDAY_LABEL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const weekdayShort = ['일', '월', '화', '수', '목', '금', '토'];
const nfmt = (n: number) => new Intl.NumberFormat('ko-KR').format(n) + '원';


function useMonthlySummary(year: number, month: number, expenses: Expense[]) {
  return useMemo(() => {
    let total = 0;
    expenses.forEach((exp) => {
      const d = new Date(exp.expense_date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        total += exp.amount;
      }
    });
    return { expense: total, total: -total };
  }, [year, month, expenses]);
}

function useDayMap(expenses: Expense[]): Record<string, DayExpenseSummary> {
  return useMemo(() => {
    const map: Record<string, DayExpenseSummary> = {};
    expenses.forEach((exp) => {
      const dateStr = exp.expense_date;
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, total: 0, items: [] };
      }
      map[dateStr].items.push(exp);
      map[dateStr].total += exp.amount;
    });
    return map;
  }, [expenses]);
}


export default function ExpensePage() {
  const router = useRouter();
  const now = new Date();
  const [cursor, setCursor] = useState<Date>(() => new Date(now.getFullYear(), now.getMonth(), 1)); // 현재 날짜 기준
  const [openISO, setOpenISO] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();


  useEffect(() => {
    const load = async () => {
      try {
        const { expenses: data } = await getExpenses({ year, month });
        setExpenses(data);
      } catch (error) {
        console.error('지출 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [year, month]);

  const calendarMonth = cursor.getMonth(); // 캘린더 표시용 (0-11)
  const daysInMonth = getDaysInMonth(year, calendarMonth);
  const firstWeekday = getFirstWeekday(year, calendarMonth);

  const summary = useMonthlySummary(year, month, expenses);
  const dayMap = useDayMap(expenses);


  const cells = useMemo(() => {
    const arr: { label?: number; dateISO?: string; outside?: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) arr.push({ outside: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = ymd(new Date(year, calendarMonth, d));
      arr.push({ label: d, dateISO: iso });
    }
    while (arr.length < 42) arr.push({ outside: true });
    return arr;
  }, [firstWeekday, daysInMonth, calendarMonth, year]);

  const handlePrev = () => setCursor(new Date(year, calendarMonth - 1, 1));
  const handleNext = () => setCursor(new Date(year, calendarMonth + 1, 1));
  const monthLabel = `${year}년 ${month}월`;
  const openFor = (iso?: string) => {
    if (iso) setOpenISO(iso);
  };
  const close = () => setOpenISO(null);

  const selected = openISO ? dayMap[openISO] : undefined;
  const selectedDate = openISO ? new Date(openISO) : null;
  const selectedCount = selected ? selected.items.length : 0;
  const selectedExpenseSum = selected ? selected.total : 0;

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>로딩중...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <button className={styles.navButton} onClick={handlePrev} aria-label="이전 달">
            ←
          </button>
          <div className={styles.monthLabel}>{monthLabel}</div>
          <button className={styles.navButton} onClick={handleNext} aria-label="다음 달">
            →
          </button>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>지출</span>
          <span className={styles.summaryExpense}>{nfmt(summary.expense)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>합계</span>
          <span className={styles.summaryTotal}>{nfmt(Math.abs(summary.total))}</span>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.weekdayHeader}>
          {weekdayShort.map((w) => (
            <div key={w} className={styles.weekdayCell}>
              {w}
            </div>
          ))}
        </div>
        <div className={styles.calendar}>
          <div className={styles.calendarGrid}>
            {cells.map((c, i) => {
              const val = c.dateISO ? dayMap[c.dateISO] : undefined;
              const isToday = c.dateISO === ymd(new Date());
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => openFor(c.dateISO)}
                  className={`${styles.calendarCell} ${c.outside ? styles.cellOutside : styles.cellInside}`}
                >
                  {c.label ? (
                    <div className={`${styles.dayLabel} ${isToday ? styles.dayToday : ''}`}>
                      {c.label}
                    </div>
                  ) : null}

                  {val && val.total !== 0 ? (
                    <div className={styles.dayAmount}>
                      <div className={styles.amountText}>{nfmt(val.total)}</div>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {openISO && (
        <div
          className={`${styles.backdrop} ${styles.backdropOpen}`}
          onClick={close}
        />
      )}

      {openISO && (
        <div className={`${styles.bottomSheet} ${styles.bottomSheetOpen}`}>
        <div className={styles.bottomSheetHeader}>
          <div className={styles.bottomSheetDrag} />
          <button onClick={close} aria-label="닫기" className={styles.closeButton}>
            ✕
          </button>
        </div>

        {selectedDate ? (
          <div className={styles.bottomSheetTitle}>
            <div className={styles.selectedDateLabel}>
              {selectedDate.getDate()}일 {WEEKDAY_LABEL[selectedDate.getDay()]}
            </div>
            <div className={styles.selectedDateSummary}>
              <div className={styles.summaryCount}>총 {selectedCount}건</div>
              <div className={styles.summaryExpenseAmount}>-{nfmt(selectedExpenseSum)}</div>
            </div>
          </div>
        ) : null}

        <div className={styles.bottomSheetContent}>
          {selected && selected.items.length > 0 ? (
            <ul className={styles.expenseList}>
              {selected.items.map((it, idx) => (
                <li key={idx} className={styles.expenseItem}>
                  <button
                    className={styles.expenseItemButton}
                    onClick={() => {
                      close();
                      router.push(`/expense/${it.expense_id}`);
                    }}
                  >
                    <div className={styles.expenseItemLeft}>
                      <div className={styles.expenseIcon} />
                      <div>
                        <div className={styles.expenseMemo}>{it.category}</div>
                        <div className={styles.expenseMeta}>
                          {it.category}
                        </div>
                      </div>
                    </div>
                    <div className={styles.expenseAmount}>-{nfmt(it.amount)}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>내역이 없습니다.</div>
          )}
        </div>
        
        {openISO && (
          <div className={styles.bottomSheetFooter}>
            <Link 
              href={`/expense/new?date=${openISO}`}
              className={styles.addButton}
              onClick={close}
            >
              지출 추가
            </Link>
          </div>
        )}
        </div>
      )}

      <Link href="/expense/new" className={styles.floatingButton} aria-label="add-expense">
        <span className={styles.floatingIconText}>➕</span>
      </Link>

      <BottomTabBar />
    </div>
  );
}

