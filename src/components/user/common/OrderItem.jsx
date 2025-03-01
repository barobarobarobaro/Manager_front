// OrderItem.jsx
'use client';
import React from 'react';

export default function OrderItem({ order }) {
  // 주문 데이터가 없는 경우 예외 처리
  if (!order) {
    return null;
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-2">
        <div>
          <span className="font-medium">{order.productName}</span>
          <span className="text-sm text-gray-500 block">{order.quantity}개 · {order.farmName}</span>
        </div>
      </td>
      <td className="text-center py-3 px-2 text-sm text-gray-500">
        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '날짜 정보 없음'}
      </td>
      <td className="text-right py-3 px-2 font-medium">
        {order.totalPrice ? order.totalPrice.toLocaleString() : '0'}원
      </td>
      <td className="text-center py-3 px-2">
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
          order.status === '배송완료' ? 'bg-green-100 text-green-800' :
          order.status === '배송중' ? 'bg-blue-100 text-blue-800' :
          order.status === '예약중' ? 'bg-purple-100 text-purple-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status || '상태 정보 없음'}
        </span>
      </td>
      <td className="text-center py-3 px-2">
        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
          상세보기
        </button>
      </td>
    </tr>
  );
}