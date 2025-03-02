'use client';
import React, { useState } from 'react';
import ProductOptionModal from '@/components/user/common/ProductOptionModal';

export default function ProductCard({ product, onAddToCart, onViewDetail }) {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 상품 데이터가 없는 경우 예외 처리
  if (!product) {
    return null;
  }

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 장바구니에 추가 처리
  const handleAddToCart = (cartItem) => {
    if (onAddToCart) {
      onAddToCart(cartItem);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="h-40 bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>

          {product.isFresh && (
            <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold">
              신선상품
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-500">{product.category}</p>
          <h3 className="font-medium mt-1">{product.name}</h3>
          <div className="mt-2">
            <p className="font-bold">
              {product.price ? product.price.toLocaleString() : '0'}원
            </p>
          </div>

          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500">
              {product.stock < 10 ? `남은수량 ${product.stock}개` : "재고 충분"}
            </span>
          </div>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={openModal}
              className="flex-1 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              장바구니
            </button>
            <button
              onClick={() => onViewDetail && onViewDetail(product)}
              className="flex-1 py-1.5 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-50"
            >
              상세보기
            </button>
          </div>
        </div>
      </div>

      {/* 장바구니 옵션 모달 */}
      <ProductOptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={product}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}