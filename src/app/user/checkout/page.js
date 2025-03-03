"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/libs/AlertManager';
import userService from '@/services/userService';

const CheckoutPage = () => {
  const router = useRouter();
  const { showConfirm, showError, showSuccess } = useAlert();
  
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 장바구니 및 사용자 정보 로드
  useEffect(() => {
    const loadCartItems = () => {
      const items = userService.getCartItems();
      setCartItems(items);
      
      // 장바구니가 비어있는 경우 홈으로 리다이렉트
      if (items.length === 0 || calculateTotalPrice(items) === 0) {
        router.push('/');
      }
    };
    
    const loadUserInfo = () => {
      if (userService.isAuthenticated()) {
        const userProfile = userService.getUserProfile();
        if (userProfile) {
          setFormData(prev => ({
            ...prev,
            name: userProfile.name || '',
            phone: userProfile.phone || '',
            address: userProfile.address || '',
          }));
        }
      }
    };
    
    loadCartItems();
    loadUserInfo();
    
    // 장바구니 업데이트 이벤트 리스너
    const handleCartUpdate = () => {
      loadCartItems();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [router]);
  
  // 총 금액 계산
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 양식 유효성 검사
    if (!formData.name || !formData.phone || !formData.address) {
      showError('모든 필수 정보를 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 주문 데이터 생성
      const orderData = {
        items: cartItems,
        totalAmount: calculateTotalPrice(cartItems),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        paymentMethod: formData.paymentMethod,
      };
      
      // 결제 프로세스 시뮬레이션
      setTimeout(async () => {
        try {
          // userService를 통해 주문 생성
          const result = await userService.createOrder(orderData);
          
          if (result.success) {
            showSuccess('주문이 성공적으로 완료되었습니다.');
            
            // 결제 완료 페이지로 이동
            router.push(`./checkout/complete?orderId=${result.order.id}`);
          } else {
            showError(result.message || '주문 처리 중 오류가 발생했습니다.');
            setIsSubmitting(false);
          }
        } catch (error) {
          showError('주문 처리 중 오류가 발생했습니다.');
          console.error('주문 처리 오류:', error);
          setIsSubmitting(false);
        }
      }, 1500);
    } catch (error) {
      showError('결제 처리 중 오류가 발생했습니다.');
      console.error('결제 오류:', error);
      setIsSubmitting(false);
    }
  };
  
  const cancelCheckout = async () => {
    const confirmed = await showConfirm(
      '주문을 취소하고 돌아가시겠습니까?',
      '주문 취소',
      { confirmText: '확인', cancelText: '계속 주문하기' }
    );
    
    if (confirmed) {
      router.back();
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문하기</h1>
      
      {/* 주문 상품 요약 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-3">주문 상품 ({cartItems.length}개)</h2>
        <ul className="space-y-2 mb-4">
          {cartItems.map(item => (
            <li key={item.id} className="flex justify-between">
              <span>{item.product.name} {item.option ? `(${item.option})` : ''} x {item.quantity}</span>
              <span>{(item.product.price * item.quantity).toLocaleString()}원</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>총 주문금액</span>
          <span>{calculateTotalPrice(cartItems).toLocaleString()}원</span>
        </div>
      </div>
      
      {/* 배송 정보 폼 */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <h2 className="font-semibold text-lg">배송 정보</h2>
          
          <div>
            <label className="block mb-1">이름 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">연락처 *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">배송주소 *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        {/* 결제 방법 */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">결제 방법</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
                className="mr-2"
              />
              신용카드 결제
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bankTransfer"
                checked={formData.paymentMethod === 'bankTransfer'}
                onChange={handleChange}
                className="mr-2"
              />
              계좌이체
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="mobilePayment"
                checked={formData.paymentMethod === 'mobilePayment'}
                onChange={handleChange}
                className="mr-2"
              />
              휴대폰 결제
            </label>
          </div>
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={cancelCheckout}
            className="flex-1 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            취소하기
          </button>
          
          <button
            type="submit"
            className="flex-1 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : `${calculateTotalPrice(cartItems).toLocaleString()}원 결제하기`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;