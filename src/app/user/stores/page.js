'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StoreCard from "@/components/user/common/StoreCard";
import userService from "@/services/userService";
import { AlertManager } from "@/libs/AlertManager";

export default function StoresPage() {
    const [stores, setStores] = useState([]);
    const [likedStores, setLikedStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        searchTerm: '',
        sortBy: 'recommended'
    });

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                
                // 전체 가게 목록 가져오기
                const allStores = userService.getAllStores();
                
                // 좋아요한 가게 목록 가져오기
                const likedStoresList = userService.getLikedStores();
                
                setStores(allStores);
                setLikedStores(likedStoresList);
                setLoading(false);
            } catch (error) {
                console.error("가게 목록 로딩 중 오류:", error);
                AlertManager.error("가게 목록을 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    // 가게 좋아요 토글 핸들러
    const handleLikeToggle = (storeId) => {
        const isLiked = userService.toggleLikeStore(storeId);
        
        // 좋아요 상태에 따라 likedStores 업데이트
        const updatedLikedStores = isLiked
            ? [...likedStores, stores.find(store => store.id === storeId)]
            : likedStores.filter(store => store.id !== storeId);
        
        setLikedStores(updatedLikedStores);
        
        AlertManager.success(
            isLiked 
            ? "가게를 좋아요 했습니다." 
            : "가게 좋아요를 취소했습니다."
        );
    };

    // 필터링 및 정렬 로직
    const filteredStores = stores.filter(store => {
        // 카테고리 필터
        const categoryMatch = 
            filters.category === 'all' || 
            store.category_id === filters.category;
        
        // 검색어 필터
        const searchMatch = 
            !filters.searchTerm || 
            store.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        return categoryMatch && searchMatch;
    }).sort((a, b) => {
        // 정렬 로직
        switch(filters.sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return new Date(b.created_at) - new Date(a.created_at);
            default:
                return 0; // 기본: 추천순(현재는 정렬 없음)
        }
    });

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => router.back()}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="뒤로가기"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 text-gray-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                            />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">가게 둘러보기</h1>
                </div>

                {/* 필터 및 검색 섹션 */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    {/* 카테고리 선택 */}
                    <select 
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                        className="flex-1 p-2 border rounded-md"
                    >
                        <option value="all">전체 카테고리</option>
                        <option value="1">농산물</option>
                        <option value="2">수산물</option>
                        <option value="3">축산물</option>
                    </select>

                    {/* 정렬 선택 */}
                    <select 
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
                        className="flex-1 p-2 border rounded-md"
                    >
                        <option value="recommended">추천순</option>
                        <option value="rating">평점순</option>
                        <option value="newest">최신순</option>
                    </select>

                    {/* 검색 입력 */}
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="가게 이름 검색" 
                            value={filters.searchTerm}
                            onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
                            className="w-full p-2 border rounded-md pl-8"
                        />
                        <svg 
                            className="absolute left-2 top-3 h-5 w-5 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                {/* 가게 목록 */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : filteredStores.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredStores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                isLiked={likedStores.some(liked => liked.id === store.id)}
                                onLikeToggle={() => handleLikeToggle(store.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                        <svg 
                            className="mx-auto h-12 w-12 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            검색 결과가 없습니다
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            다른 검색어나 필터를 시도해보세요
                        </p>
                    </div>
                )}

                {/* 페이지네이션 (선택적) */}
                {filteredStores.length > 12 && (
                    <div className="flex justify-center mt-8">
                        <nav aria-label="페이지 네비게이션" className="inline-flex rounded-md shadow-sm">
                            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100">
                                이전
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300">
                                1/3
                            </span>
                            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100">
                                다음
                            </button>
                        </nav>
                    </div>
                )}
            </main>
        </div>
    );
}