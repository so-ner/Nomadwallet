'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import TopAreaSub from '@/component/top_area/TopAreaSub';
import { useToast } from '@/context/ToastContext';
import { submitConsents, ConsentPayload } from '@/lib/api/onboard';
import { fetchTerms, TermItem } from '@/lib/api/terms';
import TermsStep from './TermsStep';
import NameStep from './NameStep';
import AccountStep from './AccountStep';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{\};:'",.<>/?]).{8,20}$/;

// 랜덤 닉네임 생성 함수
const adjectives = [
  '까칠한',
  '상냥한',
  '조용한',
  '엉뚱한',
  '활발한',
  '침착한',
  '용감한',
  '게으른',
  '차가운',
  '따뜻한',
  '느긋한',
  '솔직한',
  '냉철한',
  '귀여운',
  '시끄러운',
];

const animals = [
  '강아지',
  '고양이',
  '여우',
  '호랑이',
  '토끼',
  '펭귄',
  '부엉이',
  '돌고래',
  '하마',
  '다람쥐',
  '판다',
  '앵무새',
  '곰',
  '늑대',
  '고릴라',
];

function getRandomNickname() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}

interface SignUpContentProps {
  initialTerms?: TermItem[];
}

export default function SignUpContent({ initialTerms = [] }: SignUpContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forcedStep = searchParams.get('step');
  const { showToast } = useToast();

  const initialStep = useMemo(() => {
    const parsed = Number(forcedStep);
    if (parsed >= 1 && parsed <= 3) return parsed;
    return 1;
  }, [forcedStep]);

  const [currentStep, setCurrentStep] = useState(initialStep);

  // 쿼리 파라미터 step이 변경되면 currentStep 업데이트 (UI 테스트용)
  useEffect(() => {
    const stepFromQuery = searchParams.get('step');
    if (stepFromQuery) {
      const parsed = Number(stepFromQuery);
      if (parsed >= 1 && parsed <= 3) {
        setCurrentStep(parsed);
      }
    } else {
      setCurrentStep(1);
    }
  }, [searchParams]);
  // 서버에서 가져온 약관 데이터를 바로 사용 (서버에서 못 가져온 경우에만 클라이언트에서 업데이트)
  const [terms, setTerms] = useState<TermItem[]>(initialTerms);
  // 서버에서 이미 가져왔으므로 로딩 없음 (서버에서 못 가져온 경우에만 true)
  const [termsLoading, setTermsLoading] = useState(initialTerms.length === 0);
  const [termsAgreed, setTermsAgreed] = useState<Record<number, boolean>>(() => {
    // 초기 약관 동의 상태 설정
    const initialAgreed: Record<number, boolean> = {};
    initialTerms.forEach((term) => {
      initialAgreed[term.id] = false;
    });
    return initialAgreed;
  });
  const [nameValue, setNameValue] = useState('');
  const [nameError, setNameError] = useState('');

  const [accountLoading, setAccountLoading] = useState(false);
  const [accountErrors, setAccountErrors] = useState<{ email?: string; password?: string; confirm?: string; general?: string }>({});
  const [accountValues, setAccountValues] = useState<{ email: string; password: string; confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [accountSuccess, setAccountSuccess] = useState<{ email?: boolean; confirm?: boolean }>({});

  // 서버에서 약관을 가져오지 못한 경우에만 클라이언트에서 재시도
  useEffect(() => {
    if (initialTerms.length > 0) {
      // 서버에서 이미 가져온 경우 아무것도 하지 않음
      return;
    }

    // 서버에서 가져오지 못한 경우에만 클라이언트에서 재시도
    let mounted = true;
    const loadTerms = async () => {
      try {
        setTermsLoading(true);
        const fetchedTerms = await fetchTerms();
        if (!mounted) return;
        
        setTerms(fetchedTerms);
        
        // 약관 동의 상태 초기화
        const initialAgreed: Record<number, boolean> = {};
        fetchedTerms.forEach((term) => {
          initialAgreed[term.id] = false;
        });
        setTermsAgreed(initialAgreed);
      } catch (err: any) {
        console.error('약관 목록 로드 실패:', err);
        showToast(err?.message ?? '약관 정보를 불러오는데 실패했습니다.');
      } finally {
        if (mounted) setTermsLoading(false);
      }
    };

    loadTerms();
    return () => {
      mounted = false;
    };
  }, [initialTerms.length, showToast]);


  const validateAccountFields = useMemo(() => {
    const { email, password, confirmPassword } = accountValues;
    const errors: typeof accountErrors = {};
    const success: typeof accountSuccess = {};

    if (email) {
      if (!emailRegex.test(email)) {
        errors.email = '잘못된 이메일 형식입니다.';
      } else {
        success.email = true;
      }
    }

    if (password) {
      if (!passwordRegex.test(password)) {
        errors.password = '영문, 숫자, 특수문자를 포함한 8~20자로 입력해주세요.';
      }
    }

    if (confirmPassword) {
      if (password && password !== confirmPassword) {
        errors.confirm = '비밀번호가 일치하지 않습니다.';
      } else if (password && password === confirmPassword) {
        success.confirm = true;
      }
    }

    return {
      errors,
      success,
      isValid:
        Object.keys(errors).length === 0 &&
        email &&
        password &&
        confirmPassword &&
        password === confirmPassword &&
        emailRegex.test(email) &&
        passwordRegex.test(password),
    };
  }, [accountValues]);

  // 실시간 검증 결과를 상태에 반영
  useEffect(() => {
    if (accountValues.email || accountValues.password || accountValues.confirmPassword) {
      setAccountErrors(validateAccountFields.errors);
      setAccountSuccess(validateAccountFields.success);
    }
  }, [validateAccountFields, accountValues]);

  const toggleTerm = (id: number) => {
    setTermsAgreed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allTermsChecked = useMemo(() => {
    if (!terms.length) return false;
    return terms.every((term) => termsAgreed[term.id]);
  }, [terms, termsAgreed]);

  const toggleAllTerms = () => {
    const next = !allTermsChecked;
    const updated: Record<number, boolean> = {};
    terms.forEach((term) => {
      updated[term.id] = next;
    });
    setTermsAgreed(updated);
  };

  const requiredTermsChecked = useMemo(() => {
    const requiredTerms = terms.filter((term) => term.isRequired);
    return requiredTerms.every((term) => termsAgreed[term.id]);
  }, [terms, termsAgreed]);

  const handleTermsNext = () => {
    if (!requiredTermsChecked) {
      showToast('필수 약관에 동의해주세요.');
      return;
    }

    // 약관 동의는 계정 생성 후 저장하므로 여기서는 다음 단계로만 이동
    setCurrentStep(2);
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = (formData.get('fullName') as string | null)?.trim() ?? '';
    if (!value) {
      setNameError('실명을 입력해주세요.');
      return;
    }
    setNameValue(value);
    setCurrentStep(3);
  };

  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, confirmPassword } = accountValues;

    if (!validateAccountFields.isValid) {
      setAccountErrors(validateAccountFields.errors);
      setAccountSuccess({});
      return;
    }

    setAccountLoading(true);
    setAccountErrors({});
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        name: nameValue,
      });

      if (res?.error) {
        setAccountErrors({ general: res.error });
        return;
      }


      // 약관 동의 1차 저장 (회원가입 완료 후, 프로필 설정 이전)
      try {
        const consents: ConsentPayload[] = terms.filter((term) => termsAgreed[term.id]).map((term) => ({
          termsId: term.id,
        }));
        await submitConsents(consents);
      } catch (err: any) {
        console.error('약관 동의 저장 실패:', err);
        showToast('약관 동의 저장에 실패했습니다. 나중에 다시 시도해주세요.');
        // 약관 동의 저장 실패해도 프로필 설정 단계로 진행
      }

      // 프로필 설정 페이지로 리다이렉트 (replace로 깜박임 방지, 로딩 상태 유지)
      // 로딩 상태를 유지하면서 리다이렉트하여 부드러운 전환
      router.replace('/signup/profile');
    } catch (err: any) {
      setAccountLoading(false);
      // 에러는 이미 accountErrors에 설정됨
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/');
      return;
    }
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <TermsStep
          terms={terms}
          termsLoading={termsLoading}
          termsAgreed={termsAgreed}
          onToggleTerm={toggleTerm}
          onToggleAll={toggleAllTerms}
          onNext={handleTermsNext}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <NameStep
          nameValue={nameValue}
          nameError={nameError}
          onNameChange={setNameValue}
          onNameErrorChange={setNameError}
          onSubmit={handleNameSubmit}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <AccountStep
          accountValues={accountValues}
          accountErrors={accountErrors}
          accountSuccess={accountSuccess}
          accountLoading={accountLoading}
          onAccountChange={(field, value) => {
            setAccountValues((prev) => ({ ...prev, [field === 'confirmPassword' ? 'confirmPassword' : field]: value }));
          }}
          onSubmit={handleAccountSubmit}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      <div className="w-full flex flex-col">
        <TopAreaSub onBack={handleBack} />
        {renderStep()}
      </div>
    </div>
  );
}

