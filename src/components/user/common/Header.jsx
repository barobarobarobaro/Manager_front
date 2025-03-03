'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import userService from '@/services/userService';
import MiniCartItem from '@/components/user/common/MiniCartItem';
import Sidebar from '@/components/user/common/Sidebar'; // Sidebar 컴포넌트 임포트

export default function Header() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const cartRef = useRef(null);
  const searchRef = useRef(null);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const fetchCartData = useCallback(() => {
    try {
      const items = userService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("장바구니 데이터 불러오기 실패:", error);
    }
  }, []);

  const fetchUserData = useCallback(() => {
    try {
      const userData = userService.getUserProfile();
      if (!userData) {
        router.push('/login');
      } else {
        setUser(userData);
      }
    } catch (error) {
      console.error("사용자 데이터 불러오기 실패:", error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchCartData();
    fetchUserData();

    window.addEventListener('cartUpdated', fetchCartData);
    window.addEventListener('userLoggedIn', fetchUserData);
    window.addEventListener('userLoggedOut', fetchUserData);
    window.addEventListener('profileUpdated', fetchUserData);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartData);
      window.removeEventListener('userLoggedIn', fetchUserData);
      window.removeEventListener('userLoggedOut', fetchUserData);
      window.removeEventListener('profileUpdated', fetchUserData);
    };
  }, [fetchCartData, fetchUserData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      // Sidebar의 모바일 버전은 자체 배경 클릭으로 닫히므로 여기서는 다루지 않음
      if (searchRef.current && !searchRef.current.contains(event.target) && window.innerWidth < 640) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsSidebarOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const removeItem = (itemId) => {
    userService.removeFromCart(itemId);
  };

  const toggleCart = (e) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      setIsSidebarOpen(false);
      setIsSearchOpen(false);
    }
  };

  const toggleSidebar = (e) => {
    e.preventDefault();
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setIsCartOpen(false);
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = (e) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsCartOpen(false);
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    userService.logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-green-700">
              <Link href="/user">바로바로</Link>
            </h1>
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
              신선한 농산물을 간편하게!
            </span>
          </div>

          {/* 모바일 검색 버튼 */}
          <button className="p-2 text-gray-600 hover:text-green-600 sm:hidden" onClick={toggleSearch}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          {/* 데스크탑 검색창 */}
          <div className="hidden sm:block relative flex-grow max-w-md mx-4">
            <input
              type="text"
              placeholder="상품 검색..."
              className="w-full p-2 pl-8 border border-gray-300 rounded-full text-sm"
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* 우측 아이콘 메뉴 */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* 장바구니 */}
            <div className="relative" ref={cartRef}>
              <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-green-600" aria-label="장바구니">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">장바구니 ({cartCount})</h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  {cartItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                      <p className="mt-2 text-sm">장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto p-3">
                        {cartItems.map(item => (
                          <MiniCartItem key={item.id} item={item} onRemove={removeItem} />
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
                            onClick={() => setIsCartOpen(false)}
                          >
                            장바구니 보기
                          </Link>
                          <Link
                            href="/user/checkout"
                            className="text-center py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            onClick={() => setIsCartOpen(false)}
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
            {/* 프로필 버튼 */}
            <div className="relative">
              <button onClick={toggleSidebar} className="flex items-center p-1 rounded-full hover:bg-gray-100" aria-label="프로필 메뉴">
                {user && user.name && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-800 font-medium text-sm">{user.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium hidden sm:inline-block">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                )}
              </button>
              {/* Sidebar 컴포넌트 사용 */}
              <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} handleLogout={handleLogout} />
            </div>
          </div>
        </div>

        {/* 모바일 검색창 */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md sm:hidden z-40" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="상품 검색..."
                className="w-full p-2 pl-8 border border-gray-300 rounded-full text-sm"
                autoFocus
              />
              <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600" onClick={() => setIsSearchOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}