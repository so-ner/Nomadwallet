'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UpdateExpense } from '@/types/expense';
import { getExpense, updateExpense } from '@/lib/api/expense';
import { getCategories } from '@/lib/api/category';
import { getTravelsForExpense } from '@/lib/api/travel';
import { getExchangeRate } from '@/lib/api/exchangeRate';
import { CurrencyCode } from '@/types/travel';

interface ExpenseFormState {
  expense_date: string;
  category: string;
  amount: string;
  travel_id: number | null;
  currency: number;
  exchange_rate: string;
  memo: string;
}

const CURRENCY_OPTIONS = [
  { code: CurrencyCode.KRW, name: '원화 (KRW)', symbol: 'KRW' },
  { code: CurrencyCode.JPY, name: '엔화 (JPY)', symbol: 'JPY' },
  { code: CurrencyCode.USD, name: '달러 (USD)', symbol: 'USD' },
];

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const expenseId = Number(params?.id);

  const [formState, setFormState] = useState<ExpenseFormState>({
    expense_date: '',
    category: '',
    amount: '',
    travel_id: null,
    currency: CurrencyCode.KRW,
    exchange_rate: '',
    memo: '',
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [travels, setTravels] = useState<{ travel_id: number; travel_title: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [{ categories: cats }, { travels: travelList }, { expense }] = await Promise.all([
          getCategories(),
          getTravelsForExpense(),
          getExpense(expenseId),
        ]);

        if (mounted) {
          setCategories(cats);
          setTravels(travelList.map((t) => ({ travel_id: t.travel_id, travel_title: t.travel_title })));

          setFormState({
            expense_date: expense.expense_date,
            category: expense.category,
            amount: String(expense.amount),
            travel_id: expense.travel_id,
            currency: expense.currency,
            exchange_rate: expense.exchange_rate ? String(expense.exchange_rate) : '',
            memo: '',
          });
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [expenseId]);

  useEffect(() => {
    if (formState.currency !== CurrencyCode.KRW && formState.currency) {
      const loadRate = async () => {
        try {
          const { exchange_rate } = await getExchangeRate(formState.currency);
          setFormState((prev) => ({ ...prev, exchange_rate: String(exchange_rate.rate) }));
        } catch (error) {
          console.error('환율 로드 실패:', error);
        }
      };
      loadRate();
    } else {
      setFormState((prev) => ({ ...prev, exchange_rate: '' }));
    }
  }, [formState.currency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setFormState((prev) => ({ ...prev, amount: numericValue }));
  };

  const handleTravelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const travelId = e.target.value === '' ? null : Number(e.target.value);
    setFormState((prev) => ({
      ...prev,
      travel_id: travelId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend: UpdateExpense = {
        amount: parseFloat(formState.amount) || 0,
        currency: formState.currency,
        exchange_rate: formState.exchange_rate ? parseFloat(formState.exchange_rate) : null,
        category: formState.category,
        expense_date: formState.expense_date || new Date().toISOString().slice(0, 10),
      };

      // await updateExpense(expenseId, dataToSend);
      router.push('/expense');
    } catch (error) {
      alert(error instanceof Error ? error.message : '지출 수정에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-5 py-5 border-b border-grayscale-300">
        <span className="text-headline-3 text-text-primary">지출 수정</span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col pb-32">
        <h2 className="px-5 pt-5 pb-4 text-headline-4 text-text-primary">지출 수정</h2>

        <button type="button" className="mx-5 mb-4 px-4 py-3 border border-grayscale-300 rounded-lg text-body-2 text-text-primary bg-white">
          영수증 사진 업로드
        </button>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="expense_date">
            날짜
          </label>
          <input
            id="expense_date"
            name="expense_date"
            type="date"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none bg-white"
            value={formState.expense_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="category">
            카테고리
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none bg-white"
            value={formState.category}
            onChange={handleInputChange}
            required
          >
            <option value="">선택하세요</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="amount">
            금액
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="numeric"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500 bg-white"
            value={formState.amount ? parseInt(formState.amount).toLocaleString('ko-KR') : ''}
            onChange={handleAmountChange}
            placeholder="금액을 입력하세요"
            required
          />
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="travel_id">
            예산
          </label>
          <select
            id="travel_id"
            name="travel_id"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none bg-white"
            value={formState.travel_id || ''}
            onChange={handleTravelChange}
          >
            <option value="">선택 안 함</option>
            {travels.map((travel) => (
              <option key={travel.travel_id} value={travel.travel_id}>
                {travel.travel_title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="currency">
            통화
          </label>
          <select
            id="currency"
            name="currency"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none bg-white"
            value={formState.currency}
            onChange={(e) => {
              setFormState((prev) => ({ ...prev, currency: Number(e.target.value) }));
            }}
            required
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="exchange_rate">
            환율
          </label>
          <input
            id="exchange_rate"
            name="exchange_rate"
            type="text"
            inputMode="decimal"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500 bg-white disabled:bg-grayscale-50"
            value={formState.exchange_rate}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              setFormState((prev) => ({ ...prev, exchange_rate: value }));
            }}
            placeholder="환율을 입력하세요"
            disabled={formState.currency === CurrencyCode.KRW}
          />
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-4 items-center px-5 py-5">
          <label className="text-headline-5 text-button-primary whitespace-nowrap" htmlFor="memo">
            메모
          </label>
          <input
            id="memo"
            name="memo"
            type="text"
            className="w-full px-4 py-3 border-none rounded-lg text-body-2 text-text-primary focus:outline-none placeholder:text-grayscale-500 bg-white"
            value={formState.memo}
            onChange={handleInputChange}
            placeholder="메모를 입력하세요"
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-5 border-t border-grayscale-300 bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-3 border border-grayscale-300 rounded-lg text-body-2 text-text-primary bg-white"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-button-primary text-white rounded-lg text-body-2 font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '지출 수정'}
          </button>
        </div>
      </form>
    </div>
  );
}

