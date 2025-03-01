"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPrinter, FiUser, FiTruck, FiPackage, FiCreditCard, FiMessageSquare } from "react-icons/fi";

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 실제 구현 시에는 params.id를 사용하여 API에서 주문 정보를 가져옵니다
  useEffect(() => {
    // API 호출을 시뮬레이션
    setTimeout(() => {
      // 예시 데이터 - 실제로는 API 응답으로 대체됩니다
      setOrder({
        id: 1,
        orderNumber: "ORD-20250224-001",
        customerName: "홍길동",
        phoneNumber: "010-1234-5678",
        email: "hong@example.com",
        orderDate: "2025-02-24 14:32:15",
        status: "배송완료",
        paymentMethod: "신용카드",
        paymentStatus: "결제완료",
        totalAmount: 34500,
        shippingFee: 3000,
        discountAmount: 2000,
        finalAmount: 35500,
        deliveryAddress: "서울특별시 강남구 테헤란로 123, 456동 789호",
        deliveryRequest: "문 앞에 놓아주세요.",
        trackingNumber: "1234567890",
        deliveryCompany: "우체국택배",
        deliveryDate: "2025-02-26",
        items: [
          {
            id: 101,
            name: "유기농 사과 1kg",
            quantity: 2,
            price: 12500,
            totalPrice: 25000,
            options: "특품",
            image: "/images/product-placeholder.jpg"
          },
          {
            id: 102,
            name: "신선한 당근 500g",
            quantity: 1,
            price: 4500,
            totalPrice: 4500,
            options: "일반",
            image: "/images/product-placeholder.jpg"
          },
          {
            id: 103,
            name: "수제 잼 세트",
            quantity: 1,
            price: 5000,
            totalPrice: 5000,
            options: "딸기맛",
            image: "/images/product-placeholder.jpg"
          }
        ],
        statusHistory: [
          { status: "주문접수", date: "2025-02-24 14:32:15", comment: "주문이 접수되었습니다." },
          { status: "결제완료", date: "2025-02-24 14:35:22", comment: "결제가 완료되었습니다." },
          { status: "상품준비중", date: "2025-02-25 09:15:43", comment: "상품을 준비하고 있습니다." },
          { status: "배송중", date: "2025-02-25 13:20:18", comment: "택배사에 상품이 전달되었습니다." },
        ]
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">주문 정보를 찾을 수 없습니다</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  // 주문 상태에 따른 색상 설정
  const getStatusColor = (status) => {
    switch (status) {
      case '배송완료':
        return 'bg-green-100 text-green-800';
      case '배송중':
        return 'bg-blue-100 text-blue-800';
      case '상품준비중':
      case '주문확인':
        return 'bg-yellow-100 text-yellow-800';
      case '주문접수':
      case '결제완료':
        return 'bg-purple-100 text-purple-800';
      case '취소':
      case '환불':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold">주문 상세 정보</h1>
        </div>
        
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center"
        >
          <FiPrinter className="mr-2" /> 인쇄하기
        </button>
      </div>

      {/* 주문 기본 정보 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">주문번호: {order.orderNumber}</h2>
            <p className="text-gray-600">주문일시: {order.orderDate}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FiUser className="mr-2" /> 주문자 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">이름</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">연락처</p>
              <p className="font-medium">{order.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-medium">{order.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FiTruck className="mr-2" /> 배송 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">배송지 주소</p>
            <p className="font-medium">{order.deliveryAddress}</p>
            
            <p className="text-sm text-gray-600 mt-4 mb-1">배송 요청사항</p>
            <p className="font-medium">{order.deliveryRequest}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">택배사</p>
            <p className="font-medium">{order.deliveryCompany}</p>
            
            <p className="text-sm text-gray-600 mt-4 mb-1">운송장 번호</p>
            <div className="flex items-center">
              <p className="font-medium">{order.trackingNumber}</p>
              <a 
                href={`https://example.com/tracking/${order.trackingNumber}`} 
                target="_blank"
                className="ml-2 text-blue-500 text-sm hover:underline"
                rel="noopener noreferrer"
              >
                배송조회
              </a>
            </div>
            
            <p className="text-sm text-gray-600 mt-4 mb-1">배송 완료일</p>
            <p className="font-medium">{order.deliveryDate}</p>
          </div>
        </div>
      </div>

      {/* 주문 상품 정보 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FiPackage className="mr-2" /> 주문 상품 정보
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">옵션</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품금액</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                        {/* 실제로는 여기에 상품 이미지가 들어갈 것입니다 */}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.options}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}개</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.totalPrice.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FiCreditCard className="mr-2" /> 결제 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">결제 방법</p>
            <p className="font-medium">{order.paymentMethod}</p>
            
            <p className="text-sm text-gray-600 mt-4 mb-1">결제 상태</p>
            <p className="font-medium text-green-600">{order.paymentStatus}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">상품 금액</span>
              <span>{order.totalAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">배송비</span>
              <span>{order.shippingFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">할인 금액</span>
              <span>-{order.discountAmount.toLocaleString()}원</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
              <span>총 결제 금액</span>
              <span className="text-blue-600">{order.finalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 처리 이력 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FiMessageSquare className="mr-2" /> 주문 처리 이력
        </h3>
        <div className="relative">
          {/* 타임라인 라인 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6 relative">
            {order.statusHistory.map((history, index) => (
              <div key={index} className="ml-12 relative">
                {/* 타임라인 동그라미 */}
                <div className={`absolute -left-12 w-8 h-8 rounded-full ${getStatusColor(history.status)} flex items-center justify-center`}>
                  <span className="text-xs">{index + 1}</span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{history.status}</h4>
                    <span className="text-sm text-gray-500">{history.date}</span>
                  </div>
                  <p className="text-sm mt-1">{history.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}