'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// 헤더 컴포넌트
export default function Header({ user, cartCount = 0 }) {  // cartCount prop 추가
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
            
            {/* 장바구니 버튼 추가 */}
            <Link href="/cart" className="relative p-2 text-green-600 hover:text-green-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
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