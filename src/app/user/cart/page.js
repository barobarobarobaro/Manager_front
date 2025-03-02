'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import userService from "@/services/userService";
// 장바구니 아이템 컴포넌트
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex items-center py-4 border-b">
            <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                <img 
                    src={item.product.image || "/placeholder-product.jpg"} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
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
    const shippingFee = totalPrice >= 50000 ? 0 : 3000;
    
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
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                disabled={cartItems.length === 0}
            >
                {cartItems.length === 0 ? '장바구니가 비어있습니다' : '주문하기'}
            </button>
            
            <Link href="/" className="block text-center mt-3 text-gray-600 hover:text-gray-800">
                계속 쇼핑하기
            </Link>
        </div>
    );
};

// 장바구니 페이지 컴포넌트
export default function CartPage() {
    const [userProfile, setUserProfile] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 페이지 로드 시 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 사용자 프로필 가져오기
                const profile = userService.getUserProfile("2");
                setUserProfile(profile);
                
                // 장바구니 데이터 가져오기 (서비스에 해당 함수가 있다고 가정)
                // 실제로는 userService.getCartItems() 같은 함수를 호출해야 함
                // 여기서는 임시 데이터를 사용
                const tempCartItems = [
                    {
                        id: 1,
                        product: {
                            id: 101,
                            name: "유기농 당근",
                            storeName: "건강한 농장",
                            price: 4500,
                            image: "/carrot.jpg"
                        },
                        quantity: 2
                    },
                    {
                        id: 2,
                        product: {
                            id: 102,
                            name: "신선한 방울토마토",
                            storeName: "맑은 농원",
                            price: 6000,
                            image: "/tomato.jpg"
                        },
                        quantity: 1
                    },
                    {
                        id: 3,
                        product: {
                            id: 103,
                            name: "제철 딸기",
                            storeName: "달콤 농장",
                            price: 12000,
                            image: "/strawberry.jpg"
                        },
                        quantity: 1
                    }
                ];
                
                setCartItems(tempCartItems);
                setLoading(false);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    // 수량 업데이트 함수
    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };
    
    // 아이템 제거 함수
    const removeItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };
    
    // 전체 삭제 함수
    const clearCart = () => {
        if (window.confirm("장바구니를 비우시겠습니까?")) {
            setCartItems([]);
        }
    };
    
    // 주문하기 함수
    const proceedToCheckout = () => {
        alert("주문 페이지로 이동합니다!");
        // 실제로는 주문 페이지로 라우팅
        // router.push('/user/checkout');
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            
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
                                    <Link href="/" className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        쇼핑하러 가기
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="border-b pb-2 mb-2 flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="selectAll" 
                                            className="mr-2" 
                                        />
                                        <label htmlFor="selectAll" className="text-sm">
                                            전체 선택 ({cartItems.length}개)
                                        </label>
                                    </div>
                                    
                                    <div className="divide-y">
                                        {cartItems.map(item => (
                                            <CartItem 
                                                key={item.id} 
                                                item={item} 
                                                onUpdateQuantity={updateQuantity}
                                                onRemove={removeItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="lg:col-span-1">
                            <OrderSummary 
                                cartItems={cartItems}
                                onCheckout={proceedToCheckout}
                            />
                        </div>
                    </div>
                )}
            </main>
            
            {/* 푸터 */}
        </div>
    );
}