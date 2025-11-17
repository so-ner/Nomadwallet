'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Button from '@/component/Button';
import {fetchTerms, TermItem} from '@/lib/api/terms';
import {submitConsents, ConsentPayload} from '@/lib/api/onboard';
import {useToast} from '@/context/ToastContext';

function CheckIcon({checked}: { checked: boolean }) {
  return (
    <span
      className={`flex items-center justify-center w-6 h-6 rounded-full border ${checked ? 'bg-[#0F2B4F] border-[#0F2B4F] text-white' : 'border-[#D0D5DD] text-transparent'}`}
    >
      ✓
    </span>
  );
}

interface TermRowProps {
  term: TermItem;
  checked: boolean;
  onToggle: () => void;
}

function TermRow({term, checked, onToggle}: TermRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center w-full py-4 border-b border-[#EEF1F5] text-left"
    >
      <CheckIcon checked={checked}/>
      <div className="flex-1 ml-3">
        <p className={`text-[15px] font-semibold ${checked ? 'text-[#0F2B4F]' : 'text-[#1F2933]'}`}>
          {term.title}
        </p>
        {term.summary && (
          <p className="text-xs text-[#616161] mt-1">{term.summary}</p>
        )}
      </div>
      <span className="text-[#CBD2D9]">›</span>
    </button>
  );
}

export default function TermsPage() {
  const router = useRouter();
  const {showToast} = useToast();
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchTerms()
      .then((items) => {
        if (!mounted) return;
        setTerms(items);
        const initial: Record<number, boolean> = {};
        items.forEach((term) => {
          initial[term.id] = term.isRequired;
        });
        setSelected(initial);
      })
      .catch((err) => {
        console.error(err);
        showToast(err?.message ?? '약관 정보를 불러오지 못했습니다.');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [showToast]);

  const requiredChecked = useMemo(() => {
    const requiredTerms = terms.filter((term) => term.isRequired);
    return requiredTerms.every((term) => selected[term.id]);
  }, [terms, selected]);

  const allChecked = useMemo(() => {
    if (!terms.length) return false;
    return terms.every((term) => selected[term.id]);
  }, [terms, selected]);

  const toggleTerm = (id: number) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    const updated: Record<number, boolean> = {};
    terms.forEach((term) => {
      updated[term.id] = next;
    });
    setSelected(updated);
  };

  const handleSubmit = async () => {
    if (!requiredChecked) {
      showToast('필수 약관에 동의해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const consents: ConsentPayload[] = terms
        .filter((term) => selected[term.id])
        .map((term) => ({termsId: term.id}));
      await submitConsents(consents);
      showToast('약관 동의가 완료되었습니다.');
      router.push('/permissions');
    } catch (err: any) {
      showToast(err?.message ?? '약관 동의에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-5 py-8 bg-white">
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="text-[20px] text-[#212121]">
            ←
          </button>
          <Link href="/" className="text-sm text-[#4B5563]">로그인으로 돌아가기</Link>
        </div>

        <div style={{padding: '0 2rem', marginTop: '1.5rem'}}>
          <h1 className="text-[24px] font-bold text-[#111827] leading-[32px]">
            NomadWallet 서비스
            <br/>
            이용약관을 확인해주세요
          </h1>
        </div>

        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center w-full px-5 py-4 border-b border-[#E5E7EB] text-left"
          >
            <CheckIcon checked={allChecked}/>
            <span className={`ml-3 text-[16px] font-semibold ${allChecked ? 'text-[#0F2B4F]' : 'text-[#1F2933]'}`}>
              모두 동의
            </span>
          </button>
          <div className="px-5">
            {loading ? (
              <p className="py-6 text-sm text-center text-[#6B7280]">약관을 불러오는 중...</p>
            ) : (
              terms.map((term) => (
                <TermRow
                  key={term.id}
                  term={term}
                  checked={!!selected[term.id]}
                  onToggle={() => toggleTerm(term.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="px-5 mt-8">
          <Button type="button" variant={requiredChecked ? 'default' : 'disabled'} disabled={!requiredChecked || submitting} onClick={handleSubmit}>
            {submitting ? '처리 중...' : '다음'}
          </Button>
        </div>
      </div>
    </div>
  );
}
