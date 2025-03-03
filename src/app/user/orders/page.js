'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import userService from "@/services/userService";
import { useAlert } from "@/libs/AlertManager"; // Alert 컨텍스트 사용

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

// 전체 주문 페이지 컴포넌트
export default function OrdersPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { showConfirm, showSuccess, showError } = useAlert();

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = userService.getUserProfile();
        setUserProfile(profile);

        const recentOrders = userService.getRecentOrders();
        console.log('Recent orders:', recentOrders); // 디버깅용
        setOrders(recentOrders);
        setFilteredOrders(recentOrders);
        setLoading(false);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setLoading(false);
      }
    };

    fetchData();

    const handleOrderUpdate = () => {
      fetchData();
    };

    window.addEventListener('orderUpdated', handleOrderUpdate);
    window.addEventListener('orderCreated', handleOrderUpdate);

    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate);
      window.removeEventListener('orderCreated', handleOrderUpdate);
    };
  }, []);

  // 필터 변경 처리
  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => {
        const statusMap = {
          'pending': '주문확인',
          'completed': '결제완료',
          'shipped': '배송중',
          'delivered': '배송완료',
          'cancelled': '주문취소'
        };

        return statusMap[order.status] === filter || order.status === filter;
      }));
    }
  }, [filter, orders]);

  // 테스트용: 모든 주문 삭제
  const handleClearAllOrders = async () => {
    const confirmed = await showConfirm(
      '정말로 모든 주문 내역을 삭제하시겠습니까?',
      '주문 내역 삭제',
      { confirmText: '삭제', cancelText: '취소' }
    );

    if (confirmed) {
      const result = userService.clearAllOrders();
      if (result.success) {
        showSuccess('모든 주문 내역이 삭제되었습니다.');
        setOrders([]);
        setFilteredOrders([]);
      } else {
        showError(result.message || '주문 내역 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 첫 번째 상품 정보 가져오는 도우미 함수
  const getFirstProductInfo = (order) => {
    if (!order || !order.items || order.items.length === 0) {
      return { productName: '상품 정보 없음', storeName: '', quantity: 0 };
    }
    const firstItem = order.items[0];
    return {
      productName: firstItem.product?.name || '상품 정보 없음',
      storeName: firstItem.product?.storeName || '',
      quantity: firstItem.quantity || 0,
      totalItems: order.items.length
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">주문 내역</h1>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('all')}
            >
              전체보기
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === '주문확인' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('주문확인')}
            >
              주문확인
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === '배송중' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('배송중')}
            >
              배송중
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === '배송완료' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('배송완료')}
            >
              배송완료
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === '예약중' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('예약중')}
            >
              예약중
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === '주문취소' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('주문취소')}
            >
              주문취소
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={handleClearAllOrders}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            주문 내역 초기화 (테스트용)
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">주문 내역이 없습니다</h3>
            <p className="mt-1 text-gray-500">해당 조건의 주문 내역이 없습니다.</p>
            <Link href="/user" className="mt-6 inline-block px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* 모바일 뷰 - 카드 형태 */}
            <div className="sm:hidden">
              {filteredOrders.map((order) => {
                const { productName, storeName, quantity, totalItems } = getFirstProductInfo(order);
                return (
                  <div key={order.id} className="border-b p-4">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{productName}</span>
                        {totalItems > 1 && <span className="text-xs text-gray-500 ml-1">외 {totalItems - 1}건</span>}
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          {storeName && (
                            <>
                              <span className="mx-1 text-gray-300">|</span>
                              <span className="text-xs text-gray-500">{storeName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-gray-600 text-sm">수량: {quantity}개</span>
                        <div className="font-medium">{(order.totalAmount || 0).toLocaleString()}원</div>
                      </div>
                      {/* 주문 상세 페이지로 이동하는 Link 사용 */}
                      <Link href={`/user/orders/${order.id}`}>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                          상세보기
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 데스크톱 뷰 - 테이블 형태 */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문일자</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품정보</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">결제금액</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const { productName, storeName, quantity, totalItems } = getFirstProductInfo(order);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {productName}
                                {totalItems > 1 && <span className="text-xs text-gray-500 ml-1">외 {totalItems - 1}건</span>}
                              </div>
                              {storeName && <div className="text-sm text-gray-500">{storeName}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {quantity}개
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                          {(order.totalAmount || 0).toLocaleString()}원
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <Link href={`/user/orders/${order.id}`}>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                              상세보기
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}