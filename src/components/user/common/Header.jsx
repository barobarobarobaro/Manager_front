'use client';
import React, { useState } from 'react';

// 헤더 컴포넌트
export default function Header({ user }) {  // 중괄호를 사용하여 user prop을 구조 분해
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-green-700">지금농산문</h1>
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">직거래 마켓</span>
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