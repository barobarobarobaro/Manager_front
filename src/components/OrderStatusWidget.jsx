
"use client"; 

import React from "react";

export default function OrderStatusWidget({
  title = "주문/배송",
  updatedAt = "13:38",
  statuses = [],
}) {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      {/* 위젯 상단: 타이틀과 최근 업데이트 시간 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">최근 {updatedAt}</span>
      </div>

      {/* 위젯 본문: 주문 현황 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statuses.map((status) => (
          <div
            key={status.label}
            className="flex items-center p-3 bg-gray-50 rounded"
          >
            {/* 아이콘 자리 (임시로 배경만 지정) */}
            <div className="w-10 h-10 bg-green-200 rounded flex items-center justify-center mr-3">
              {/* status.icon을 전달하면 여기에 렌더링 */}
              {status.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{status.label}</p>
              <p className="text-lg font-bold text-gray-800">
                {status.count} 건
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}