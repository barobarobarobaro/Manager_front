// StoreCard.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function StoreCard({ store, isLiked, onToggleLike, onSelect, isSelected }) {
  const router = useRouter();
  
  // 가게 데이터가 없는 경우 예외 처리
  if (!store) {
    return null;
  }

  // 가게 상세 페이지로 이동
  const goToStoreDetail = (e) => {
    e.stopPropagation(); // 선택 이벤트 방지
    router.push(`/user/stores/${store.id}`);
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'}`}
      onClick={() => onSelect && onSelect(store.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{store.name}</h3>
        <button
          className="text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike && onToggleLike(store.id);
          }}
        >
          {isLiked ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          )}
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-1">{store.location}</p>
      <div className="flex items-center mt-2">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="ml-1 text-sm">{store.rating}</span>
        </div>
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-xs text-gray-500">{store.productCount}개 상품</span>
      </div>
      
      {/* 상세 보기 버튼 추가 */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={goToStoreDetail}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
        >
          상세 보기
        </button>
      </div>
    </div>
  );
}