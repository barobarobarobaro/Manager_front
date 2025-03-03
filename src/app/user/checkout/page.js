'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertManager } from '@/libs/AlertManager';
import userService from '@/services/userService';
import ImageOrIcon from '@/components/common/ImageOrIcon';
import AddressInput from '@/components/common/AddressInput';
// 가게별 주문 그룹 생성 함수
const groupOrderItemsByStore = (cartItems) => {
  const storeGroups = {};
  const stores = userService.getAllStores();

  cartItems.forEach(item => {
    // 해당 상품의 가게 찾기
    const store = stores.find(s =>
      userService.getStoreProducts(s.id).some(p => p.id === item.product.id)
    );

    if (store) {
      if (!storeGroups[store.id]) {
        storeGroups[store.id] = {
          store,
          items: [],
          totalPrice: 0,
          shippingFee: store.delivery_fee || 3000,
          minOrderAmount: store.min_order_amount || 50000
        };
      }

      const storeGroup = storeGroups[store.id];
      storeGroup.items.push(item);
      storeGroup.totalPrice += (item.product.price + (item.option?.price || 0)) * item.quantity;
    }
  });

  // 배송비 계산
  Object.values(storeGroups).forEach(group => {
    group.freeShippingAvailable = group.totalPrice >= group.minOrderAmount;
    group.finalShippingFee = group.freeShippingAvailable ? 0 : group.shippingFee;
  });

  return Object.values(storeGroups);
};
const DeliveryAddressSection = ({ userProfile, formData, setFormData }) => {
  const [addressType, setAddressType] = useState('direct'); // 'direct', 'personal', 'business'

  // 사용자 프로필의 주소 정보 추출
  const personalAddress = userProfile?.profileInfo?.address || null;
  const businessAddress = userProfile?.role === 'seller'
    ? userProfile?.profileInfo?.businessInfo?.businessAddress
    : null;

  // 주소 선택 핸들러
  const handleAddressTypeChange = (type) => {
    setAddressType(type);

    switch (type) {
      case 'personal':
        if (personalAddress) {
          setFormData(prev => ({
            ...prev,
            zonecode: personalAddress.zipCode,
            roadAddress: personalAddress.address1,
            detailAddress: personalAddress.address2,
            name: personalAddress.recipient,
            phone: personalAddress.recipientPhone
          }));
        }
        break;
      case 'business':
        if (businessAddress) {
          setFormData(prev => ({
            ...prev,
            zonecode: businessAddress.zipCode,
            roadAddress: businessAddress.address1,
            detailAddress: businessAddress.address2,
            name: userProfile.name,
            phone: userProfile.phone
          }));
        }
        break;
      default: // direct
        setFormData(prev => ({
          ...prev,
          zonecode: '',
          roadAddress: '',
          detailAddress: '',
          name: userProfile.name,
          phone: userProfile.phone
        }));
    }
  };

  // 주소 변경 핸들러
  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      ...addressData
    }));
  };

  return (
    <div className="space-y-4 mb-6">
      <h2 className="font-semibold text-lg">배송 정보</h2>

      {/* 배송 방식 선택 */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={() => handleAddressTypeChange('direct')}
          className={`flex-1 py-2 border rounded-md ${addressType === 'direct'
            ? 'bg-green-50 border-green-600 text-green-700'
            : 'border-gray-300'
            }`}
        >
          직접 입력
        </button>
        {personalAddress && (
          <button
            type="button"
            onClick={() => handleAddressTypeChange('personal')}
            className={`flex-1 py-2 border rounded-md ${addressType === 'personal'
              ? 'bg-green-50 border-green-600 text-green-700'
              : 'border-gray-300'
              }`}
          >
            개인 주소
          </button>
        )}
        {businessAddress && (
          <button
            type="button"
            onClick={() => handleAddressTypeChange('business')}
            className={`flex-1 py-2 border rounded-md ${addressType === 'business'
              ? 'bg-green-50 border-green-600 text-green-700'
              : 'border-gray-300'
              }`}
          >
            사업지 주소
          </button>
        )}
      </div>

      {/* 이름 입력 */}
      <div>
        <label className="block mb-1">이름 *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            name: e.target.value
          }))}
          className="w-full p-2 border rounded"
          required
          readOnly={addressType !== 'direct'}
        />
      </div>

      {/* 연락처 입력 */}
      <div>
        <label className="block mb-1">연락처 *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            phone: e.target.value
          }))}
          className="w-full p-2 border rounded"
          required
          readOnly={addressType !== 'direct'}
        />
      </div>

      {/* 주소 입력 컴포넌트 */}
      <AddressInput
        zonecode={formData.zonecode}
        roadAddress={formData.roadAddress}
        detailAddress={formData.detailAddress}
        onChange={handleAddressChange}
        disabled={addressType !== 'direct'}
        required={true}
      />
    </div>
  );
};


const CheckoutPage = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [storeGroups, setStoreGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    zipCode: '',
    addressDetail: '',
    paymentMethod: 'card',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  // 장바구니 및 사용자 정보 로드
  useEffect(() => {
    const loadCartItems = () => {
      setUserProfile(userService.getUserProfile());
      const items = userService.getCartItems();

      // 장바구니가 비어있는 경우 홈으로 리다이렉트
      if (items.length === 0) {
        router.push('/');
        return;
      }

      setCartItems(items);
      setStoreGroups(groupOrderItemsByStore(items));
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
  const calculateTotalPrice = () => {
    return storeGroups.reduce((total, group) => {
      return total + group.totalPrice + group.finalShippingFee;
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
    if (!formData.name || !formData.phone || !formData.zonecode || !formData.roadAddress) {
      AlertManager.error('모든 필수 정보를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 각 가게별 주문 생성
      const orderPromises = storeGroups.map(group => {
        const orderData = {
          items: group.items,
          totalAmount: group.totalPrice + group.finalShippingFee,
          shippingAddress: {
            name: formData.name,
            phone: formData.phone,
            zonecode: formData.zonecode,
            roadAddress: formData.roadAddress,
            detailAddress: formData.detailAddress,
            message: formData.deliveryMessage
          },
          paymentMethod: formData.paymentMethod,
          store: {
            id: group.store.id,
            name: group.store.name
          }, // 명시적으로 store 정보 추가
          shippingFee: group.finalShippingFee
        };

        return userService.createOrder(orderData);
      });

      // 모든 주문 처리
      const results = await Promise.all(orderPromises);

      // 모든 주문이 성공했는지 확인
      const successfulOrders = results.filter(result => result.success);

      if (successfulOrders.length === storeGroups.length) {
        AlertManager.success('모든 주문이 성공적으로 완료되었습니다.');

        // 첫 번째 주문의 ID를 사용하여 결제 완료 페이지로 이동
        const firstSuccessOrder = successfulOrders[0];
        router.push(`./checkout/complete?orderId=${firstSuccessOrder.order.id}`);
      } else {
        // 일부 주문 실패
        AlertManager.error('일부 주문 처리 중 오류가 발생했습니다.');
        setIsSubmitting(false);
      }
    } catch (error) {
      AlertManager.error('주문 처리 중 오류가 발생했습니다.');
      console.error('주문 처리 오류:', error);
      setIsSubmitting(false);
    }
  };

  const cancelCheckout = () => {
    AlertManager.confirm(
      '주문을 취소하고 돌아가시겠습니까?',
      () => router.back(),
      '주문 취소',
      { confirmText: '확인', cancelText: '계속 주문하기' }
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문하기</h1>

      {/* 가게별 주문 상품 요약 */}
      {storeGroups.map(group => (
        <div key={group.store.id} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-lg mb-3">{group.store.name} 주문 상품</h2>
          <ul className="space-y-2 mb-4">
            {group.items.map(item => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-3">
                    <ImageOrIcon
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      type="product"
                    />
                  </div>
                  <div>
                    <span>{item.product.name}</span>
                    {item.option && (
                      <span className="text-sm text-gray-500 block">
                        {item.option.name}
                        {item.option.price > 0 && ` (+${item.option.price.toLocaleString()}원)`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span>{item.quantity}개</span>
                  <span className="ml-2">
                    {((item.product.price + (item.option?.price || 0)) * item.quantity).toLocaleString()}원
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <span>소계</span>
            <span>{group.totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>배송비</span>
            <span>
              {group.freeShippingAvailable
                ? '무료'
                : `${group.finalShippingFee.toLocaleString()}원`}
            </span>
          </div>
          {!group.freeShippingAvailable && (
            <div className="text-xs text-gray-500 text-right mt-1">
              {group.minOrderAmount.toLocaleString()}원 이상 주문 시 무료 배송
            </div>
          )}
          <div className="flex justify-between mt-2">
            <span>주문 금액</span>
            <span>
              <b>
                {(group.totalPrice + group.finalShippingFee).toLocaleString()}원
              </b>
            </span>
          </div>
        </div>
      ))}

      {/* 총 결제 금액 */}
      <div className="bg-white rounded-lg p-4 mb-6 border">
        <div className="flex justify-between font-bold">
          <span>총 주문금액</span>
          <span>{calculateTotalPrice().toLocaleString()}원</span>
        </div>
      </div>

      {/* 배송 정보 폼 */}
      <form onSubmit={handleSubmit}>
        <DeliveryAddressSection
          userProfile={userProfile}
          formData={formData}
          setFormData={setFormData}
        />

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
            {isSubmitting
              ? '처리 중...'
              : `${calculateTotalPrice().toLocaleString()}원 결제하기`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;