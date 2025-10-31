export interface Category {
  id: string;
  name: string;
}

export interface ApiGetCategoriesResponse {
  categories: Category[];
}

export async function getCategories(): Promise<ApiGetCategoriesResponse> {
  const categories: Category[] = [
    { id: '1', name: '음식점' },
    { id: '2', name: '교통' },
    { id: '3', name: '숙박' },
    { id: '4', name: '식사' },
    { id: '5', name: '쇼핑' },
    { id: '6', name: '카페/간식' },
    { id: '7', name: '문화/여가' },
    { id: '8', name: '기타' },
  ];

  return { categories };
}
