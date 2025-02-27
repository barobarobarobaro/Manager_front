"use client";

import React from "react";
import { FiSearch, FiClipboard, FiTruck, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
export default function OrderStatusWidget({
  title = "주문/배송",
  updatedAt = "13:38",
  statuses = [],
  onNavigate
}) {
  // 페이지 이동 핸들러
  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* 상단 헤더 영역 */}
      <div className="border-b border-gray-100">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">최근 {updatedAt}</span>
        </div>
      </div>

      {/* 주문 현황 타일 */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statuses.map((status) => (
            <div
              key={status.label}
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* 아이콘 상단 배치 */}
              <div className={`w-12 h-12 ${getStatusColor(status.label)} rounded-full flex items-center justify-center mb-2`}>
                {status.icon || getDefaultIcon(status.label)}
              </div>
              <p className="text-sm text-gray-600 text-center">{status.label}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {status.count} <span className="text-sm font-normal">건</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="bg-gray-50 p-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleNavigate('/orders')}
            className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-200"
          >
            <FiSearch className="mr-1" />
            <span className="text-sm">
              <Link href="/main/sellmanagement/searchorder">주문 통합 검색</Link>
            </span>
          </button>

          <button
            onClick={() => handleNavigate('/orders/confirm')}
            className="flex items-center justify-center px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors duration-200"
          >
            <FiClipboard className="mr-1" />
            <span className="text-sm">
              <Link href="/main/sellmanagement/checkorder">주문 확인</Link>

            </span>
          </button>

          <button
            onClick={() => handleNavigate('/orders/shipping')}
            className="flex items-center justify-center px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors duration-200"
          >
            <FiTruck className="mr-1" />
            <span className="text-sm">
              <Link href="/main/sellmanagement/manageshipping">배송 현황 관리</Link>

            </span>
          </button>
        </div>
      </div>

      {/* 더보기 링크 */}
      <div className="p-3 text-right border-t border-gray-100">
        <button
          onClick={() => handleNavigate('/orders/all')}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-end"
        >
          <span>전체 주문 관리</span>
          <FiArrowRight className="ml-1" />
        </button>
      </div>
    </div>
  );
}

// 상태에 따른 색상 반환 함수
function getStatusColor(label) {
  switch (label) {
    case "결제대기":
      return "bg-yellow-100 text-yellow-600";
    case "신규주문":
      return "bg-blue-100 text-blue-600";
    case "예약구매":
      return "bg-purple-100 text-purple-600";
    case "배송준비":
      return "bg-green-100 text-green-600";
    case "배송중":
      return "bg-indigo-100 text-indigo-600";
    case "배송완료":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// 기본 아이콘 반환 함수 (이모지 사용)
function getDefaultIcon(label) {
  switch (label) {
    case "결제대기":
      return "💰";
    case "신규주문":
      return "🆕";
    case "예약구매":
      return "📅";
    case "배송준비":
      return "📦";
    case "배송중":
      return "🚚";
    case "배송완료":
      return "✅";
    default:
      return "📋";
  }
}