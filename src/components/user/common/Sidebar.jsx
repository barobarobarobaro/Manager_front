'use client';
import React from 'react';
import Link from 'next/link';

export default function Sidebar({ user, isOpen, onClose, handleLogout }) {
  if (!isOpen) return null;

  return (
    <>
      {/* 모바일용 사이드바 */}
      <div className="sm:hidden fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white w-64 h-full p-4 overflow-y-auto">
          <div className="mb-4">
            <p className="font-medium text-lg">{user.name} 님</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/user/profile"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  마이 프로필
                </Link>
              </li>
              <li>
                <Link
                  href="/user/profile/edit"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  프로필 수정
                </Link>
              </li>
              <li>
                <Link
                  href="/user/orders"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  주문 내역
                </Link>
              </li>
              <li>
                <Link
                  href="/user/payments"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  결제 관리
                </Link>
              </li>
              <li>
                <Link
                  href="/user/addresses"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  배송지 관리
                </Link>
              </li>
              <li>
                <Link
                  href="/user/wishlist"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  찜한 상품
                </Link>
              </li>
              <li>
                <Link
                  href="/user/reviews"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  나의 리뷰
                </Link>
              </li>
            </ul>
            <div className="border-t my-4"></div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/user/notifications"
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  알림 설정
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 rounded hover:bg-gray-100 text-red-500"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 데스크탑용 사이드바 */}
      <div className="hidden sm:block absolute right-0 mt-2 w-72 bg-white shadow-lg border border-gray-200 z-50">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-800 font-medium text-lg">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-green-800">{user.name} 님</p>
              <p className="text-xs text-green-600">{user.email}</p>
            </div>
          </div>
        </div>
        <nav className="p-2 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link
                href="/user/profile"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                마이 프로필
              </Link>
            </li>
            <li>
              <Link
                href="/user/profile/edit"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                프로필 수정
              </Link>
            </li>
            <li>
              <Link
                href="/user/orders"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                주문 내역
              </Link>
            </li>
            <li>
              <Link
                href="/user/payments"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                결제 관리
              </Link>
            </li>
            <li>
              <Link
                href="/user/addresses"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                배송지 관리
              </Link>
            </li>
            <li>
              <Link
                href="/user/wishlist"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                찜한 상품
              </Link>
            </li>
            <li>
              <Link
                href="/user/reviews"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                나의 리뷰
              </Link>
            </li>
          </ul>
          <div className="border-t my-2"></div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/user/notifications"
                onClick={onClose}
                className="flex items-center p-2 rounded hover:bg-gray-100"
              >
                알림 설정
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 w-full text-left rounded hover:bg-gray-100 text-red-500"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}