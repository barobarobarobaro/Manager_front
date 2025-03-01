'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/user/common/Footer";
import Header from "@/components/user/common/Header";
import ProductCard from "@/components/user/common/ProductCard";
import FarmCard from "@/components/user/common/FarmCard";
import OrderItem from "@/components/user/common/OrderItem";
import userService from "@/services/userService";



// 사용자 프로필 요약 컴포넌트
const UserProfileSummary = ({ user }) => {
    if (!user) return null;

    return (
        <section className="bg-white rounded-lg p-4 shadow-sm mb-8">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-800 font-bold">{user.name.charAt(0)}</span>
                </div>
                <div>
                    <div className="font-medium">{user.name}님, 안녕하세요!</div>
                    <div className="text-sm text-gray-500">{user.location} · 가입일: {new Date(user.joinDate).toLocaleDateString()}</div>
                </div>
            </div>
        </section>
    );
};
// 메인 페이지 컴포넌트
export default function Page() {
    // 기본 상태 관리
    const [userProfile, setUserProfile] = useState(null);
    const [farms, setFarms] = useState([]);
    const [likedFarms, setLikedFarms] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    const [products, setProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 페이지 로드 시 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 사용자 프로필 가져오기
                const profile = userService.getUserProfile("2");
                setUserProfile(profile);

                // 가게 목록 가져오기
                const allFarms = userService.getAllFarms();
                setFarms(allFarms);

                // 좋아요한 가게 목록 가져오기
                const userLikedFarms = userService.getLikedStores();
                setLikedFarms(userLikedFarms.map(farm => farm.id));

                // 주문 내역 가져오기
                const orders = userService.getRecentOrders();
                setRecentOrders(orders);

                // 기본적으로 첫 번째 좋아요한 가게 선택
                if (profile.likedFarms.length > 0) {
                    const firstLikedFarmId = profile.likedFarms[0];
                    setSelectedFarmId(firstLikedFarmId);

                    // 해당 가게의 상품 목록 가져오기
                    const farmProducts = userService.getStoreProducts(firstLikedFarmId.toString());
                    setProducts(farmProducts);
                }

                setLoading(false);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 가게 선택 함수
    const selectFarm = (farmId) => {
        setSelectedFarmId(farmId);
        const farmProducts = userService.getStoreProducts(farmId.toString());
        setProducts(farmProducts);
    };

    // 장바구니에 추가 함수
    const addToCart = (product) => {
        alert(`${product.name}을(를) 구매합니다!`);
    };

    // 예약 구매 함수
    const reserveProduct = (product) => {
        alert(`${product.name}을(를) 예약 구매합니다!`);
    };

    // 좋아요한 가게만 필터링
    const likedFarmsList = farms.filter(farm => userProfile?.likedFarms?.includes(farm.id));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <Header user={userProfile} />

            <main className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <>
                        {/* 사용자 프로필 요약 */}
                        <UserProfileSummary user={userProfile} />

                        {/* 가게 목록 섹션 */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">좋아요한 가게</h2>
                                <div className="text-sm text-gray-500">
                                    총 {likedFarmsList.length}개
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {likedFarmsList.map((farm) => (
                                    <FarmCard
                                        key={farm.id}
                                        farm={farm}
                                        isLiked={true}
                                        onSelect={selectFarm}
                                        isSelected={selectedFarmId === farm.id}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* 선택된 가게의 상품 섹션 */}
                        {selectedFarmId && (
                            <section className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">
                                        {farms.find(f => f.id === selectedFarmId)?.name}의 상품
                                    </h2>
                                    <div className="flex space-x-2">
                                        <select className="text-sm border-gray-300 rounded-md p-1">
                                            <option value="all">전체 상품</option>
                                            <option value="vegetable">채소</option>
                                            <option value="fruit">과일</option>
                                        </select>
                                        <select className="text-sm border-gray-300 rounded-md p-1">
                                            <option value="recommended">추천순</option>
                                            <option value="priceAsc">가격 낮은순</option>
                                            <option value="priceDesc">가격 높은순</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAddToCart={addToCart}
                                                onReserve={reserveProduct}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">상품이 없습니다</h3>
                                            <p className="mt-1 text-sm text-gray-500">다른 가게를 선택해보세요</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* 최근 주문 내역 */}
                        <section className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">최근 주문 내역</h2>
                                <Link href="/order" className="text-sm text-green-600 hover:text-green-700">
                                    전체 주문 보기
                                </Link>
                            </div>

                            {recentOrders.length === 0 ? (
                                <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">주문 내역이 없습니다</h3>
                                    <p className="mt-1 text-sm text-gray-500">새로운 상품을 구경해보세요!</p>
                                    <button className="mt-4 px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                                        상품 둘러보기
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-2">주문 상품</th>
                                                <th className="text-center py-3 px-2">주문일</th>
                                                <th className="text-right py-3 px-2">금액</th>
                                                <th className="text-center py-3 px-2">상태</th>
                                                <th className="text-center py-3 px-2">관리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <OrderItem key={order.id} order={order} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            {/* 푸터 */}
            <Footer />
        </div>
    );
}