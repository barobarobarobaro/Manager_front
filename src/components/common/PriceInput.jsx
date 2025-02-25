
import { useState, useEffect } from 'react';

export default function PriceInput({ value, onChange, currency = '₩' }) {
  const [displayValue, setDisplayValue] = useState('');
  
  // 값이 외부에서 변경되면 표시 값 업데이트
  useEffect(() => {
    setDisplayValue(value === 0 ? '' : value.toString());
  }, [value]);
  
  // 입력 값 처리
  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // 숫자만 허용
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setDisplayValue(numericValue);
    
    // 부모 컴포넌트에 변경 알림
    onChange(numericValue === '' ? 0 : parseInt(numericValue, 10));
  };
  
  // 포맷된 가격 표시
  const formattedValue = displayValue === '' 
    ? '' 
    : parseInt(displayValue, 10).toLocaleString();
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-500">{currency}</span>
      </div>
      <input
        type="text"
        className="w-full pl-8 p-2 border rounded"
        value={formattedValue}
        onChange={handleChange}
        placeholder="0"
      />
    </div>
  );
}