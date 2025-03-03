'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductOptionModal from '@/components/user/common/ProductOptionModal';
import userService from '@/services/userService';
import { AlertManager } from "@/libs/AlertManager";
import ImageOrIcon from '@/components/common/ImageOrIcon';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Only fetch when productId is available
    if (!productId) return;

    async function loadProduct() {
      try {
        setIsLoading(true);

        // 전체 가게 목록 가져오기
        const stores = userService.getAllStores();

        // 상품이 속한 가게 찾기
        let foundProduct = null;
        let foundStore = null;

        for (const store of stores) {
          const storeProducts = userService.getStoreProducts(store.id);
          const product = storeProducts.find(p => p.id === productId);

          if (product) {
            foundProduct = product;
            foundStore = store;
            break;
          }
        }

        if (!foundProduct) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        // 추가 상품 정보 강화
        const enhancedProduct = {
          ...foundProduct,
          category: foundProduct.category || '식품',
          isFresh: foundProduct.isFresh || true,
          nutrition: foundProduct.nutrition || {
            calories: 250,
            protein: '10g',
            carbs: '30g',
            fat: '8g'
          },
          options: foundProduct.options || [
            { id: 1, name: '소포장', price: 0 },
            { id: 2, name: '대포장', price: 5000 },
          ]
        };

        setProduct(enhancedProduct);
        setStoreInfo(foundStore);
        setError(null);
      } catch (error) {
        console.error('상품을 불러오는 중 오류가 발생했습니다:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  // 모달 컨트롤
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 장바구니에 추가
  const handleAddToCart = (cartItem) => {
    try {
      // Use the userService to add to cart
      userService.addToCart({
        product: cartItem.product,
        quantity: cartItem.quantity,
        option: cartItem.option
      });

      // 알림 표시
      AlertManager.success('장바구니에 상품이 추가되었습니다.');
      closeModal();
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      AlertManager.error('장바구니에 추가하는데 실패했습니다.');
    }
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    if (product && newQuantity <= (product.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  // 구매하기 핸들러 (임시)
  const handleDirectPurchase = () => {
    try {
      // 즉시 구매 로직 - 현재는 임시로 장바구니에 추가 후 주문 페이지로 이동
      userService.addToCart({
        product,
        quantity,
        option: null
      });

      router.push('/order/checkout');
    } catch (error) {
      console.error('구매 처리 오류:', error);
      AlertManager.error('구매 처리 중 오류가 발생했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">상품 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 오류 상태
  if (error || !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || '상품 정보를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/user/stores')}
            className="text-red-700 font-semibold underline mt-2 inline-block"
          >
            가게 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-green-600 hover:underline flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          상품 목록으로 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* 상품 이미지 영역 */}
          <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 relative">
            {product.images && product.images.length > 0 ? (
              <ImageOrIcon
                src={product.images[0]}
                alt={product.name}
                layout="fill"
                iconClassName='w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            )}

            {product.isFresh && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-sm font-bold rounded-full">
                신선상품
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">{storeInfo?.name || '가게 정보 없음'}</p>
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-3xl font-bold text-green-700">
                {product.price.toLocaleString()}원
              </p>
              {product.discount_price && (
                <p className="text-sm text-red-500 mt-1">
                  할인가: {product.discount_price.toLocaleString()}원
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {product.stock < 10 ? `남은수량 ${product.stock}개` : "재고 충분"}
              </p>
            </div>

            {/* 수량 선택 */}
            <div className="mb-6">
              <p className="text-gray-700 mb-2 font-medium">수량</p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="border border-gray-300 rounded-l-md px-3 py-1 text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="border-t border-b border-gray-300 px-4 py-1 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="border border-gray-300 rounded-r-md px-3 py-1 text-lg"
                  disabled={product.stock <= quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* 옵션 선택 (옵션이 있는 경우에만 표시) */}
            {product.options && product.options.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-700 mb-2 font-medium">옵션 선택</p>
                <div className="grid grid-cols-2 gap-2">
                  {product.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option)}
                      className={`
            w-full p-2 border rounded-md transition-colors
            ${selectedOption?.id === option.id
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:bg-gray-100'}
          `}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.name}</span>
                        <span className="text-sm text-gray-500">
                          {option.price > 0 ? `+${option.price.toLocaleString()}원` : ''}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {!selectedOption && product.options.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">옵션을 선택해주세요</p>
                )}
              </div>
            )}
            {/* 총 결제 금액 */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">상품 금액</span>
                <span className="text-lg font-bold">
                  {(product.price * quantity).toLocaleString()}원
                </span>
              </div>

              {selectedOption && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">옵션 (+{selectedOption.name})</span>
                  <span className="text-gray-700">
                    +{(selectedOption.price * quantity).toLocaleString()}원
                  </span>
                </div>
              )}
              {/* 배달비 */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">배달비</span>
                <span className="text-gray-700">
                  {storeInfo?.delivery_available
                    ? (storeInfo.min_order_amount && (product.price * quantity + (selectedOption?.price || 0) * quantity) >= storeInfo.min_order_amount
                      ? '무료'
                      : `${(storeInfo.delivery_fee || 3000).toLocaleString()}원`)
                    : '픽업'}
                </span>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <span className="text-lg font-semibold">총 결제 금액</span>
                <span className="text-2xl font-bold text-green-600">
                  {(
                    product.price +
                    (selectedOption?.price || 0) * quantity +
                    (storeInfo?.delivery_available && (!storeInfo.min_order_amount || (product.price + (selectedOption?.price || 0) * quantity) < storeInfo.min_order_amount)
                      ? (storeInfo.delivery_fee || 3000)
                      : 0)
                  ).toLocaleString()}원
                </span>
              </div>
            </div>
            {/* 구매 버튼 */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // 옵션이 있는 경우 옵션 선택 확인
                  if (product.options && product.options.length > 0 && !selectedOption) {
                    AlertManager.error('옵션을 선택해주세요.');
                    return;
                  }

                  // 장바구니에 추가
                  userService.addToCart({
                    product,
                    quantity,
                    option: selectedOption
                  });

                  // 알림 표시
                  AlertManager.success('장바구니에 상품이 추가되었습니다.');
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
              >
                장바구니 담기
              </button>
              <button
                onClick={handleDirectPurchase}
                className="flex-1 border border-green-600 text-green-600 py-3 rounded-md font-medium hover:bg-green-50 transition"
              >
                바로 구매하기
              </button>
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 */}
        <div className="p-6 border-t border-gray-100">
          <h2 className="text-xl font-bold mb-4">상품 정보</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* 영양 정보 (해당되는 경우) */}
          {product.nutrition && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">영양 정보</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="text-center p-2">
                    <p className="text-gray-500 text-sm">칼로리</p>
                    <p className="font-bold">{product.nutrition.calories}kcal</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-gray-500 text-sm">단백질</p>
                    <p className="font-bold">{product.nutrition.protein}</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-gray-500 text-sm">탄수화물</p>
                    <p className="font-bold">{product.nutrition.carbs}</p>
                  </div>
                  <div className="text-center p-2">
                    <p className="text-gray-500 text-sm">지방</p>
                    <p className="font-bold">{product.nutrition.fat}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 배송 정보 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">배송 안내</h3>
            <div className="border border-gray-200 rounded-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex">
                  <div className="w-1/3 text-gray-500">배송 방법</div>
                  <div className="w-2/3">{storeInfo?.delivery_available ? '택배 배송' : '픽업 전용'}</div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200">
                <div className="flex">
                  <div className="w-1/3 text-gray-500">배송비</div>
                  <div className="w-2/3">
                    {storeInfo?.delivery_available
                      ? `3,000원 (${storeInfo.min_order_amount?.toLocaleString() || '30,000'}원 이상 구매 시 무료)`
                      : '픽업 상품'}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex">
                  <div className="w-1/3 text-gray-500">배송 예정일</div>
                  <div className="w-2/3">주문 후 1-2일 이내 {storeInfo?.delivery_available ? '출고' : '픽업 가능'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 교환 및 반품 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">교환 및 반품 안내</h3>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="mb-2">
                <span className="font-medium">교환/반품 비용:</span> 고객 변심에 의한 교환/반품은 왕복 배송비 부담
              </p>
              <p>
                <span className="font-medium">교환/반품 불가 사유:</span> 상품 개봉 후, 상품 가치 훼손, 상품 수령 후 7일 초과 시
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 장바구니 옵션 모달 */}
      <ProductOptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={{ ...product, quantity: quantity }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}