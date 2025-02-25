"use client"; 

import React from "react";

export default function OrderStatusWidget({
  title = "주문/배송",
  updatedAt = "13:38",
  statuses = [],
}) {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* 위젯, 타이틀과 최근 업데이트 시간 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 sm:mb-0">{title}</h2>
        <span className="text-sm text-gray-500">최근 {updatedAt}</span>
      </div>

      {/* 주문 현황 목록 - 화면 크기에 따라 그리드 레이아웃 조정 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statuses.map((status) => (
          <div
            key={status.label}
            className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
          >
            {/* 아이콘 영역 - 상태에 따라 색상 다르게 적용 가능 */}
            <div className={`w-10 h-10 ${getStatusColor(status.label)} rounded-md flex items-center justify-center mr-3 shrink-0`}>
              {/* 아이콘이 있으면 표시, 없으면 기본 아이콘 표시 */}
              {status.icon || getDefaultIcon(status.label)}
            </div>
            <div>
              <p className="text-sm text-gray-600">{status.label}</p>
              <p className="text-lg font-bold text-gray-800">
                {status.count} <span className="text-sm font-normal">건</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 상태에 따른 색상 반환 함수
function getStatusColor(label) {
  switch(label) {
    case "결제대기":
      return "bg-yellow-200 text-yellow-700";
    case "신규주문":
      return "bg-blue-200 text-blue-700";
    case "예약구매":
      return "bg-purple-200 text-purple-700";
    case "배송준비":
      return "bg-green-200 text-green-700";
    case "배송중":
      return "bg-indigo-200 text-indigo-700";
    case "배송완료":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

// 기본 아이콘 반환 함수 (이모지 사용)
function getDefaultIcon(label) {
  switch(label) {
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