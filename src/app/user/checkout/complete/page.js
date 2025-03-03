"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import userService from '@/services/userService';

const PaymentCompletePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        // 모든 주문 내역을 가져와서 해당 ID의 주문을 찾음
        const recentOrders = userService.getRecentOrders();
        const foundOrder = recentOrders.find(order => order.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('주문 정보를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('주문 정보 로드 실패:', error);
        setError('주문 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p>주문 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">오류가 발생했습니다</h1>
          <p className="mb-4">{error}</p>
          <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-yellow-50 p-6 rounded-lg max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">주문 정보를 찾을 수 없습니다</h1>
          <p className="mb-4">요청하신 주문 정보를 찾을 수 없습니다.</p>
          <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  // 주문 날짜 형식화
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 배송 예정일 계산 (주문일로부터 3일 후)
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다!</h1>
        <p className="text-gray-600 mb-1">주문번호: {orderId}</p>
        <p className="text-gray-600">주문일시: {formattedDate}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="font-bold text-xl mb-4">주문 상세 내역</h2>
        
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold">주문 상품</h3>
          <ul className="divide-y">
            {order.items.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <div>
                  <span className="font-medium">{item.product.name}</span>
                  {item.option && <span className="text-gray-500 ml-1">({item.option})</span>}
                  <span className="text-gray-500 ml-2">x {item.quantity}</span>
                </div>
                <span>{(item.product.price * item.quantity).toLocaleString()}원</span>
              </li>
            ))}
          </ul>
          
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>총 결제금액</span>
            <span>{order.totalAmount.toLocaleString()}원</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold">배송 정보</h3>
          <p><span className="inline-block w-20 text-gray-600">받는 분:</span> {order.shippingAddress.name}</p>
          <p><span className="inline-block w-20 text-gray-600">연락처:</span> {order.shippingAddress.phone}</p>
          <p><span className="inline-block w-20 text-gray-600">배송지:</span> {order.shippingAddress.address}</p>
          <p><span className="inline-block w-20 text-gray-600">배송 예정:</span> {formattedDeliveryDate}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">결제 정보</h3>
          <p>
            <span className="inline-block w-20 text-gray-600">결제 방법:</span>
            {order.paymentMethod === 'card' && '신용카드 결제'}
            {order.paymentMethod === 'bankTransfer' && '계좌이체'}
            {order.paymentMethod === 'mobilePayment' && '휴대폰 결제'}
          </p>
          <p><span className="inline-block w-20 text-gray-600">주문 상태:</span> 
            {order.status === 'pending' && '처리 중'}
            {order.status === 'completed' && '결제 완료'}
            {order.status === 'shipped' && '배송 중'}
            {order.status === 'delivered' && '배송 완료'}
            {order.status === 'cancelled' && '주문 취소'}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-4 justify-center">
        <Link 
          href="/"
          className="px-6 py-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          홈으로
        </Link>
        <Link 
          href="/user/orders"
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          주문 내역 보기
        </Link>
      </div>
    </div>
  );
};

export default PaymentCompletePage;