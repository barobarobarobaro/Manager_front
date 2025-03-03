'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import userService from "@/services/userService";

// 주문 상태 태그 컴포넌트
const StatusBadge = ({ status }) => {
  let displayStatus = "주문확인";
  let bgColor = 'bg-yellow-100 text-yellow-800';

  switch (status) {
    case 'pending':
      displayStatus = '주문확인';
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    case 'completed':
      displayStatus = '결제완료';
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'shipped':
      displayStatus = '배송중';
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'delivered':
      displayStatus = '배송완료';
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'cancelled':
      displayStatus = '주문취소';
      bgColor = 'bg-red-100 text-red-800';
      break;
    default:
      displayStatus = status || '주문확인';
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs ${bgColor}`}>
      {displayStatus}
    </span>
  );
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 주문 상세 정보 가져오기
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const orderData = userService.getOrderDetail(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error("주문 상세 정보 로드 실패", error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        로딩 중...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        주문 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const deliveryAddress = order.shippingAddress?.address || "배송 정보가 없습니다.";

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">
            &lt; 이전 페이지
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">주문 상세 정보</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 주문 기본 정보 */}
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">주문번호</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">주문일자</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주문상태</span>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span>{(order.totalAmount || 0).toLocaleString()}원</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">배송비</span>
              <span>{(order.shippingFee || 0).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>총 결제금액</span>
              <span>{((order.totalAmount || 0) + (order.shippingFee || 0)).toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="mt-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">상품 정보</h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name || '상품 정보 없음'}</p>
                    {item.product?.storeName && (
                      <p className="text-gray-600 text-sm">{item.product.storeName}</p>
                    )}
                    <p className="text-sm mt-1">
                      <span className="text-gray-600">수량: </span>{item.quantity}개
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">상품 정보가 없습니다.</p>
          )}
        </div>

        {/* 배송 정보 */}
        <div className="mt-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
          <p className="text-gray-600">{deliveryAddress}</p>
        </div>
      </div>
    </div>
  );
}