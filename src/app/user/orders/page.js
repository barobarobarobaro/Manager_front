'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import userService from "@/services/userService";

// 주문 상태 태그 컴포넌트
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-yellow-100 text-yellow-800';
  
  if (status === '배송완료') {
    bgColor = 'bg-green-100 text-green-800';
  } else if (status === '배송중') {
    bgColor = 'bg-blue-100 text-blue-800';
  } else if (status === '예약중') {
    bgColor = 'bg-purple-100 text-purple-800';
  } else if (status === '주문취소') {
    bgColor = 'bg-red-100 text-red-800';
  }
  
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs ${bgColor}`}>
      {status}
    </span>
  );
};

// 주문 상세 정보 모달
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex">
      <div className="relative p-6 bg-white w-full max-w-lg m-auto rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold mb-4">주문 상세 정보</h2>
        
        <div className="mb-4 pb-4 border-b">
          <div className="flex justify-between">
            <span className="text-gray-600">주문번호</span>
            <span className="font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">주문일자</span>
            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">주문상태</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="mb-4 pb-4 border-b">
          <h3 className="font-medium mb-2">상품 정보</h3>
          <div className="flex items-center p-3 bg-gray-50 rounded">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{order.productName}</p>
              <p className="text-gray-600 text-sm">{order.storeName}</p>
              <p className="text-sm mt-1">
                <span className="text-gray-600">수량: </span>
                <span>{order.quantity}개</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-4 pb-4 border-b">
          <h3 className="font-medium mb-2">결제 정보</h3>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">상품 금액</span>
            <span>{order.totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">배송비</span>
            <span>{(order.deliveryFee || 0).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mt-2 font-medium">
            <span>총 결제금액</span>
            <span>{((order.totalPrice || 0) + (order.deliveryFee || 0)).toLocaleString()}원</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">배송 정보</h3>
          <p className="text-gray-600">
            {order.deliveryAddress || "서울시 강남구 테헤란로 123"}
          </p>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          {order.status !== '배송완료' && order.status !== '주문취소' && (
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
              주문 취소
            </button>
          )}
          {order.status === '배송완료' && (
            <button className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50">
              리뷰 작성
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// 전체 주문 페이지 컴포넌트
export default function OrdersPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 사용자 프로필 및 주문 데이터 가져오기
        const profile = userService.getUserProfile("2");
        setUserProfile(profile);
        
        const mockOrders = userService.getRecentOrders();
        setOrders(mockOrders);
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 필터 변경 처리
  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [filter, orders]);
  
  // 주문 상세 보기
  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
  };
  
  // 주문 상세 모달 닫기
  const closeOrderDetail = () => {
    setSelectedOrder(null);
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
            <Link href="/" className="mt-6 inline-block px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* 모바일 뷰 - 카드 형태 */}
            <div className="sm:hidden">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border-b p-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{order.productName}</span>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="mx-1 text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{order.storeName}</span>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <span className="text-gray-600 text-sm">수량: {order.quantity}개</span>
                      <div className="font-medium">{order.totalPrice.toLocaleString()}원</div>
                    </div>
                    <button 
                      onClick={() => viewOrderDetail(order)} 
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              ))}
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                            <div className="text-sm text-gray-500">{order.storeName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 text-center">
                        {order.quantity}개
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                        {order.totalPrice.toLocaleString()}원
                      </td>
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-center">
                        <button 
                          onClick={() => viewOrderDetail(order)} 
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {/* 푸터 */}
      
      {/* 주문 상세 모달 */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeOrderDetail} />
      )}
    </div>
  );
}