'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";
import ImageOrIcon from '@/components/common/ImageOrIcon'; // 이미지 컴포넌트 (선택적)
import { useAlert } from '@/libs/AlertManager'; // 알림 훅

// 장바구니 아이템 컴포넌트
const CartItem = ({ item, onUpdateQuantity, onRemove, selected, onToggleSelect }) => {
    return (
        <div className="flex items-center py-4 border-b">
            <div className="mr-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(item.id)}
                    className="h-4 w-4 cursor-pointer"
                />
            </div>
            <div className="w-20 h-20 rounded-md overflow-hidden mr-4 bg-gray-100">
                {/* 이미지 서비스 사용 (또는 기본 이미지와 onError 사용) */}
                <ImageOrIcon
                    src={item.product.image}
                    type="product"
                    alt={item.product.name}
                    className="w-full h-full"
                    iconColor="#9CA3AF"
                />
            </div>

            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.storeName}</p>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                        <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="px-2 py-1 border-x">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                            disabled={item.product.stock && item.quantity >= item.product.stock}
                        >
                            +
                        </button>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold">{(item.product.price * item.quantity).toLocaleString()}원</div>
                        <div className="text-xs text-gray-500">개당 {item.product.price.toLocaleString()}원</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 주문 요약 컴포넌트
const OrderSummary = ({ cartItems, onCheckout }) => {
    // 총 상품 금액 계산
    const totalPrice = cartItems.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
    );

    // 배송비 (5만원 이상 무료, 그 외 3,000원)
    const shippingFee = totalPrice >= 50000 || totalPrice == 0 ? 0 : 3000;

    // 최종 결제 금액
    const finalAmount = totalPrice + shippingFee;

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-lg font-semibold mb-4">주문 요약</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">총 상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span>{shippingFee.toLocaleString()}원</span>
                </div>
                {shippingFee > 0 && (
                    <div className="text-xs text-gray-500 text-right">
                        5만원 이상 주문 시 무료 배송
                    </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>결제 금액</span>
                    <span className="text-green-600">{finalAmount.toLocaleString()}원</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0 || totalPrice === 0}
            >
                {cartItems.length === 0
                    ? '장바구니가 비어있습니다'
                    : totalPrice === 0
                        ? '주문 가능한 상품이 없습니다'
                        : '주문하기'}
            </button>

            <Link href="/user" className="block text-center mt-3 text-gray-600 hover:text-gray-800">
                계속 쇼핑하기
            </Link>
        </div>
    );
};

// 장바구니 페이지 컴포넌트
export default function CartPage() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const { showConfirm } = useAlert();

    // 장바구니 데이터 가져오기
    const fetchCartData = useCallback(() => {
        try {
            setLoading(true);

            // userService에서 장바구니 아이템 가져오기
            const items = userService.getCartItems();
            setCartItems(items);

            // 모든 아이템을 기본적으로 선택 상태로 설정
            if (items.length > 0) {
                setSelectedItems(items.map(item => item.id));
                setSelectAll(true);
            }

            setLoading(false);
        } catch (error) {
            console.error("장바구니 데이터 가져오기 실패:", error);
            setLoading(false);
        }
    }, []);

    // 사용자 정보 가져오기
    const fetchUserData = useCallback(() => {
        try {
            const profile = userService.getUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error("사용자 정보 가져오기 실패:", error);
        }
    }, []);

    // 페이지 로드 시 데이터 가져오기
    useEffect(() => {
        fetchCartData();
        fetchUserData();

        // 장바구니 업데이트 이벤트 리스너 등록
        const handleCartUpdate = () => {
            fetchCartData();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [fetchCartData, fetchUserData]);

    // 수량 업데이트 함수
    const updateQuantity = (itemId, newQuantity) => {
        try {
            // userService를 사용하여 장바구니 아이템 수량 업데이트
            userService.updateCartItemQuantity(itemId, newQuantity);

            // 로컬 상태도 업데이트 (이벤트가 제대로 작동하지 않을 경우를 대비)
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("수량 업데이트 실패:", error);
        }
    };

    // 아이템 제거 함수
    const removeItem = (itemId) => {
        try {
            // userService를 사용하여 장바구니에서 아이템 제거
            userService.removeFromCart(itemId);

            // 선택된 아이템 목록에서도 제거
            setSelectedItems(prev => prev.filter(id => id !== itemId));

            // 로컬 상태도 업데이트 (이벤트가 제대로 작동하지 않을 경우를 대비)
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("아이템 제거 실패:", error);
        }
    };

    // 전체 선택 토글 함수
    const toggleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);

        if (checked) {
            // 모든 아이템 선택
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            // 모든 아이템 선택 해제
            setSelectedItems([]);
        }
    };

    // 개별 아이템 선택 토글 함수
    const toggleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                // 아이템이 이미 선택된 경우, 제거
                const newSelected = prev.filter(id => id !== itemId);
                setSelectAll(newSelected.length === cartItems.length);
                return newSelected;
            } else {
                // 아이템이 선택되지 않은 경우, 추가
                const newSelected = [...prev, itemId];
                setSelectAll(newSelected.length === cartItems.length);
                return newSelected;
            }
        });
    };

    // 전체 삭제 함수
    const clearCart = async () => {
        const confirmed = await showConfirm(
            '장바구니의 모든 상품을 삭제하시겠습니까?',
            '장바구니 비우기',
            {
                confirmText: '삭제',
                cancelText: '취소'
            }
        );
        if (!confirmed) return;
        try {
            // userService를 사용하여 장바구니 비우기
            userService.clearCart();

            // 로컬 상태도 초기화
            setCartItems([]);
            setSelectedItems([]);
            setSelectAll(false);
        } catch (error) {
            console.error("장바구니 비우기 실패:", error);
        }
    };

    // 주문하기 함수
    const proceedToCheckout = () => {
        // 선택된 아이템이 없으면 알림 표시
        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }

        // 선택된 아이템만 필터링
        const itemsToCheckout = cartItems.filter(item =>
            selectedItems.includes(item.id)
        );

        // 선택된 상품 정보를 로컬 스토리지에 저장 (체크아웃 페이지에서 사용)
        if (typeof window !== 'undefined') {
            localStorage.setItem('checkoutItems', JSON.stringify(itemsToCheckout));
        }

        // 체크아웃 페이지로 이동
        router.push('/user/checkout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더는 레이아웃에서 처리 */}

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">장바구니</h1>
                    {cartItems.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            전체 삭제
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.length === 0 ? (
                                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">장바구니가 비어있습니다</h3>
                                    <p className="mt-2 text-gray-500">원하는 상품을 담아보세요!</p>
                                    <Link href="/user" className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        쇼핑하러 가기
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="border-b pb-2 mb-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="selectAll"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="mr-2"
                                        />
                                        <label htmlFor="selectAll" className="text-sm">
                                            전체 선택 ({selectedItems.length}/{cartItems.length}개)
                                        </label>
                                    </div>

                                    <div className="divide-y">
                                        {cartItems.map(item => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                onUpdateQuantity={updateQuantity}
                                                onRemove={removeItem}
                                                selected={selectedItems.includes(item.id)}
                                                onToggleSelect={() => toggleSelectItem(item.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                cartItems={cartItems.filter(item => selectedItems.includes(item.id))}
                                onCheckout={proceedToCheckout}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* 푸터는 레이아웃에서 처리 */}
        </div>
    );
}