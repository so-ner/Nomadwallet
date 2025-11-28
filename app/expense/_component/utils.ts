export const ymd = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
export const getFirstWeekday = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0=Sun
export const WEEKDAY_LABEL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
export const weekdayShort = ['일', '월', '화', '수', '목', '금', '토'];
export const nfmt = (n: number) => new Intl.NumberFormat('ko-KR').format(n) + '원';

