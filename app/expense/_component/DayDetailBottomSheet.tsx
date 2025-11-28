import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Expense, CategoryMajor, categoryOptions } from '@/types/expense';
import BottomSheet from '@/component/BottomSheet/core/BottomSheet';
import { WEEKDAY_LABEL, nfmt } from './utils';

// 카테고리 메이저 이름 가져오기
const getCategoryMajorLabel = (categoryMajor: CategoryMajor | string | null | undefined): string => {
  if (!categoryMajor) return '';
  const option = categoryOptions.find(opt => opt.value === categoryMajor);
  return option?.label || '';
};

// 카테고리 타입을 아이콘 경로로 매핑
const getCategoryIconPath = (categoryMajor: CategoryMajor | string | null | undefined): string => {
  const iconMap: Record<string, string> = {
    FOOD: '/category-icon/type=food.svg',
    HOUSING: '/category-icon/type=house.svg',
    FIXED: '/category-icon/type=fixed-cost.svg',
    SAVINGS_INVESTMENT: '/category-icon/type=saving.svg',
    TRANSPORTATION: '/category-icon/type=transportation.svg',
    LIVING_SHOPPING: '/category-icon/type=shopping.svg',
    ENTERTAINMENT: '/category-icon/type=cultural-life.svg',
    OTHERS: '/category-icon/type=etc.svg',
  };
  
  if (!categoryMajor || !(categoryMajor in iconMap)) {
    return '/category-icon/type=etc.svg'; // 기본값
  }
  
  return iconMap[categoryMajor];
};

interface DayDetailBottomSheetProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedDateISO: string | null;
  selectedItems: Expense[];
  selectedExpenseSum: number;
  selectedIncomeSum: number;
  onClose: () => void;
}

export default function DayDetailBottomSheet({
  isOpen,
  selectedDate,
  selectedDateISO,
  selectedItems,
  selectedExpenseSum,
  selectedIncomeSum,
  onClose,
}: DayDetailBottomSheetProps) {
  const router = useRouter();
  const selectedCount = selectedItems.length;

  // selectedDateISO에서 직접 날짜와 요일 추출 (타임존 문제 방지)
  const displayDate = selectedDateISO ? (() => {
    const [year, month, day] = selectedDateISO.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return {
      day: day,
      weekday: WEEKDAY_LABEL[date.getDay()],
    };
  })() : null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-[2rem] px-[2rem]">
        {/* 일자 + 요일, 엑스버튼 */}
        <div className="flex justify-between items-center">
          <h2 className="text-subhead-1 font-normal text-text-primary">
            {displayDate ? `${displayDate.day}일 ${displayDate.weekday}` : '지출 상세'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2"
            aria-label="닫기"
          >
            <Image 
              src="/icons/icon-close-small-24.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 총 n건, +500원 -20,500원 */}
        {displayDate && (
          <div className="flex justify-between items-center">
            <div className="text-grayscale-600 text-body-4">총 {selectedCount}건</div>
            <div className="flex items-center gap-[1.2rem]">
              {selectedIncomeSum > 0 && (
                <div className="text-body-4 font-semibold text-[#60BA63]">+{nfmt(selectedIncomeSum)}</div>
              )}
              {selectedExpenseSum > 0 && (
                <div className="text-text-primary font-semibold text-body-4">-{nfmt(selectedExpenseSum)}</div>
              )}
            </div>
          </div>
        )}

        {/* grayscale-300 라인 */}
        <div className="h-[1px] bg-grayscale-300" />

        {/* 지출 아이템들, 내역 추가 버튼 */}
        <div className="flex flex-col gap-[2.2rem] pb-[2rem]">
          {/* Expense List */}
          {selectedItems.length > 0 && (
            <div className="flex-1 overflow-y-auto min-h-0">
              <ul className="list-none p-0 m-0">
                {selectedItems.map((it, idx) => {
                  const categoryMajor = it.category;
                  
                  // 두번째 줄 텍스트 구성 (대카테고리 | 서브카테고리 | 예산명 | 지출/수입)
                  const secondLineParts = [];
                  if (categoryMajor) secondLineParts.push(categoryMajor);
                  // 지출/수입 여부 추가
                  secondLineParts.push(it.type === 'EXPENSE' ? '지출' : '수입');
                  
                  return (
                    <li key={idx} className="p-0 border-b border-grayscale-300 last:border-b-0">
                      <button
                        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left hover:bg-grayscale-50 transition-colors"
                        onClick={() => {
                          onClose();
                          router.push(`/expense/${it.expense_id}`);
                        }}
                      >
                        {/* 왼쪽 영역: 아이콘 + 텍스트들 */}
                        <div className="flex items-center gap-[0.8rem]">
                          {/* 아이콘 영역 */}
                          <div className="w-[4rem] h-[4rem] rounded-full bg-grayscale-200 flex items-center justify-center flex-shrink-0">
                            <Image 
                              src={getCategoryIconPath(categoryMajor || it.category)}
                              alt={categoryMajor || it.category || '카테고리'}
                              width={20}
                              height={20}
                            />
                          </div>
                          
                          {/* 텍스트들 영역 */}
                          <div className="flex flex-col gap-[0.2rem]">
                            {/* 첫번째 줄: 메모가 있으면 메모, 없으면 카테고리 */}
                            <div className="text-body-4 font-medium text-text-primary">
                              {it.memo || it.category}
                            </div>
                            
                            {/* 두번째 줄: 대카테고리 | 서브카테고리 | 예산명 */}
                            {secondLineParts.length > 0 && (
                              <div className="text-caption-2 font-medium text-grayscale-600">
                                {secondLineParts.join(' | ')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 오른쪽 영역: 금액 */}
                        <div className={`text-body-4 font-medium ${
                          it.type === 'EXPENSE' ? 'text-grayscale-600' : 'text-text-primary'
                        }`}>
                          {it.type === 'EXPENSE' ? '-' : '+'}{nfmt(it.amount)}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {/* 내역 추가 버튼 영역 */}
          {selectedDateISO && (
            <Link 
              href={`/expense/new?date=${selectedDateISO}`}
              className="flex items-center gap-[0.8rem] bg-transparent border-none cursor-pointer text-left no-underline"
              onClick={onClose}
            >
              {/* 아이콘 영역 */}
              <div className="w-[4rem] h-[4rem] rounded-full bg-status-input flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/icons/icon-plus2-20.svg"
                  alt="내역 추가"
                  width={20}
                  height={20}
                  className="w-[2rem] h-[2rem]"
                />
              </div>
              
              {/* 텍스트 */}
              <div className="text-body-4 font-medium text-text-primary">
                내역 추가
              </div>
            </Link>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

