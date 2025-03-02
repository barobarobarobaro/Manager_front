'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import userService from '@/services/userService';

// 미니 카트 아이템 컴포넌트
const MiniCartItem = ({ item, onRemove }) => {
  return (
    <div className="flex items-center py-2 border-b">
      <div className="w-12 h-12 rounded-md overflow-hidden mr-2">
        <img 
          src={item.product.image || "/placeholder-product.jpg"} 
          alt={item.product.name} 
          className="w-full h-full object-cover"
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

// 헤더 컴포넌트
export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const cartRef = useRef(null);
  const user = userService.getUserProfile();
  // 장바구니 아이템 개수 계산
  const cartCount = cartItems.length;
  
  // 장바구니 총 금액 계산
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );

  // 장바구니 데이터 가져오기 콜백
  const fetchCartData = useCallback(async () => {
    try {
      // 실제로는 userService.getCartItems() 같은 함수를 호출해야 함
      // 여기서는 임시 데이터를 사용

      setCartItems(userService.getCartItems());
    } catch (error) {
      console.error("장바구니 데이터 불러오기 실패:", error);
    }
  }, []);

  // 컴포넌트 마운트 시 장바구니 데이터 불러오기
  useEffect(() => {
    fetchCartData();

    // 장바구니 업데이트를 위한 이벤트 리스너 등록 (예: 커스텀 이벤트)
    const handleCartUpdate = () => fetchCartData();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartData]);

  // 외부 클릭 시 미니 카트 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 아이템 제거 함수
  const removeItem = (itemId) => {
    // 실제로는 API 호출 필요
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    
    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 카트 토글 함수
  const toggleCart = (e) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-green-700">
              <Link href="/user">
                바로바로
              </Link>
            </h1>
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">신선한 농산물을 간편하게!</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="상품 검색..."
                className="w-full sm:w-64 p-2 pl-8 border border-gray-300 rounded-full text-sm"
              />
              <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            {/* 장바구니 버튼 및 미니 카트 */}
            <div className="relative" ref={cartRef}>
              <button 
                onClick={toggleCart}
                className="relative p-2 text-green-600 hover:text-green-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
              
              {/* 미니 카트 드롭다운 */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">장바구니 ({cartCount})</h3>
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                      <p className="mt-2 text-sm">장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto p-3">
                        {cartItems.map(item => (
                          <MiniCartItem 
                            key={item.id} 
                            item={item} 
                            onRemove={removeItem} 
                          />
                        ))}
                      </div>
                      
                      <div className="p-3 border-t">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">총 금액</span>
                          <span className="text-sm font-semibold">{cartTotal.toLocaleString()}원</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            href="/user/cart" 
                            className="text-center py-2 px-3 border border-green-600 text-green-600 rounded hover:bg-green-50 text-sm"
                          >
                            장바구니 보기
                          </Link>
                          <Link 
                            href="/user/checkout" 
                            className="text-center py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            바로 결제하기
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {user && user.name ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-medium text-sm">{user.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 font-medium text-sm">?</span>
                </div>
                <span className="text-sm font-medium">로그인</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}