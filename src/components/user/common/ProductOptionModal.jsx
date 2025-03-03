'use client';
import { AlertManager } from '@/libs/AlertManager';
import userService from '@/services/userService';
import React, { useState, useEffect } from 'react';
import ImageOrIcon from '@/components/common/ImageOrIcon';
export default function ProductOptionModal({
  isOpen,
  onClose,
  product,
  onAddToCart
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      // 상품에 옵션이 있으면 첫 번째 옵션을 기본값으로 설정
      if (product?.options?.length > 0) {
        setSelectedOption(product.options[0]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [isOpen, product]);

  // 장바구니에 추가하는 함수
  const handleAddToCart = () => {
    try {
      // 상품, 수량, 선택된 옵션을 포함한 객체를 만들어 전달
      const cartItem = {
        product,
        quantity,
        option: selectedOption
      };

      // userService의 addToCart 메서드 사용
      userService.addToCart(cartItem);

      AlertManager.success('장바구니에 상품이 추가되었습니다.');

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('장바구니 추가 중 오류:', error);
      AlertManager.error('장바구니 추가에 실패했습니다.');
    }
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
      AlertManager.info(`최대 구매 가능 수량은 ${product.stock}개입니다.`);
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

  // 옵션 선택 핸들러
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // 총 금액 계산 (옵션 추가 가격 포함)
  const calculateTotalPrice = () => {
    const basePrice = product.price || 0;
    const optionPrice = selectedOption?.price || 0;
    return (basePrice + optionPrice) * quantity;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-lg rounded-t-xl p-4 animate-slide-up">
        {/* 상품 정보 */}
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-3">
            <ImageOrIcon
              src={product.images[0]}
              alt={product.name}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category || '상품'}</p>
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
            <div className="grid grid-cols-2 gap-2">
              {product.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionChange(option)}
                  className={`
                    w-full p-2 border rounded-md transition-colors
                    ${selectedOption?.id === option.id
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:bg-gray-100'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span>{option.name}</span>
                    <span className="text-sm text-gray-500">
                      {option.price > 0 ? `+${option.price.toLocaleString()}원` : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
            {calculateTotalPrice().toLocaleString()}원
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