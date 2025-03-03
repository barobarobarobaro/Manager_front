'use client';
import React from 'react';
import ImageOrIcon from '@/components/common/ImageOrIcon';

// SVG 아이콘을 사용하는 MiniCartItem 컴포넌트
const MiniCartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center py-2 border-b">
      <div className="w-12 h-12 rounded-md overflow-hidden mr-2 bg-gray-100 relative">
        <ImageOrIcon
          src={item.product.image}
          type="product"
          alt={item.product.name}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
          iconClassName="w-8 h-8"
          iconColor="#9CA3AF" // 회색 아이콘
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.product.name}</p>
        <p className="text-xs text-gray-500 truncate">{item.product.storeName}</p>
      </div>
      <div className="text-right ml-2">
        <p className="text-sm font-semibold">{item.product.price.toLocaleString()}원</p>
        <p className="text-xs text-gray-500">{item.quantity}개</p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default MiniCartItem;