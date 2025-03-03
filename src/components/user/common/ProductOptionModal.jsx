'use client';
import { AlertManager } from '@/libs/AlertManager';
import React, { useState, useEffect } from 'react';

export default function ProductOptionModal({
  isOpen,
  onClose,
  product,
  onAddToCart
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      // 상품에 옵션이 있으면 첫 번째 옵션을 기본값으로 설정
      if (product?.options?.length > 0) {
        setSelectedOption(product.options[0].value);
      } else {
        setSelectedOption('');
      }
    }
  }, [isOpen, product]);

  // 장바구니에 추가하는 함수
  const handleAddToCart = () => {
    // 상품, 수량, 선택된 옵션을 포함한 객체를 만들어 전달
    onAddToCart({
      product,
      quantity,
      option: selectedOption
    });
    AlertManager.info('장바구니에 상품이 추가되었습니다.');
    console.log('장바구니 아이템:', localStorage.getItem('cart_items'));
    // 모달 닫기
    onClose();
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 수량 증가 함수
  const increaseQuantity = () => {
    // 재고 제한이 있는 경우 체크
    if (product.stock && quantity >= product.stock) {
      return;
    }
    setQuantity(prev => prev + 1);
  };

  // 수량 감소 함수
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-lg rounded-t-xl p-4 animate-slide-up">
        {/* 상품 정보 */}
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-3">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="font-bold mt-1">{product.price?.toLocaleString() || '0'}원</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* 옵션 선택 (옵션이 있는 경우에만 표시) */}
        {product.options && product.options.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">옵션 선택</label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {product.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 수량 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={decreaseQuantity}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              -
            </button>
            <div className="flex-1 text-center py-2">{quantity}</div>
            <button
              onClick={increaseQuantity}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              disabled={product.stock && quantity >= product.stock}
            >
              +
            </button>
          </div>
          {product.stock && (
            <p className="text-xs text-gray-500 mt-1">
              재고: {product.stock}개
            </p>
          )}
        </div>

        {/* 총 금액 */}
        <div className="flex justify-between items-center mb-4 pt-2 border-t">
          <span className="text-gray-700">총 상품 금액</span>
          <span className="text-lg font-bold text-green-600">
            {((product.price || 0) * quantity).toLocaleString()}원
          </span>
        </div>

        {/* 버튼 */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}