import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

// 예시 카테고리 데이터
const categories = [
  { id: 'fruit', name: '과일' },
  { id: 'vegetable', name: '채소' },
  { id: 'herb', name: '허브' },
  { id: 'imported-fruit', name: '수입과일' },
  { id: 'organic', name: '유기농식품' },
  { id: 'grain', name: '곡물' },
  { id: 'seafood', name: '해산물' },
  { id: 'meat', name: '육류' },
  { id: 'dairy', name: '유제품' },
];

export default function CategorySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);
  
  // 카테고리명 찾기
  const selectedCategory = categories.find(cat => cat.id === value);
  
  // 선택한 카테고리의 이름 표시
  const displayValue = selectedCategory ? selectedCategory.name : '';
  
  // 클릭 이벤트 처리 (외부 클릭 시 닫기)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 검색어에 따른 필터링
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 카테고리 선택 핸들러
  const handleSelectCategory = (categoryId) => {
    onChange(categoryId);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  return (
    <div className="relative" ref={ref}>
      <div 
        className="w-full p-2 border rounded flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue || '카테고리 선택'}</span>
        <span>▼</span>
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full border rounded bg-white shadow-lg z-10">
          <div className="p-2 border-b">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="카테고리 검색..."
                className="w-full p-2 pl-8 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <div 
                  key={category.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    category.id === value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  {category.name}
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}