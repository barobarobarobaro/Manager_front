// app/products/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductDetailPage({ params }) {
    const { id } = params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 실제로는 API로 상품 정보를 가져와야 합니다.
    // 여기서는 예시 데이터를 사용합니다.
    useEffect(() => {
        // 실제 구현에서는 fetch를 사용하여 API에서 데이터를 가져옵니다.
        // 예: fetch(`/api/products/${id}`).then(...)
        
        // 샘플 데이터
        const dummyProduct = {
            id: parseInt(id),
            name: "유기농 사과",
            price: 12000,
            stock: 50,
            category: "과일",
            created: "2025-01-15",
            description: "신선하고 맛있는 유기농 사과입니다. 껍질째 먹을 수 있으며, 아삭한 식감이 일품입니다.",
            image: "https://source.unsplash.com/400x300/?apple",
            nutrition: {
                calories: 52,
                protein: "0.3g",
                carbs: "14g",
                fiber: "2.4g"
            },
            origin: "국내산",
            options: ["1kg (4~5개)", "2kg (8~10개)", "3kg (12~15개)"]
        };
        
        setTimeout(() => {
            setProduct(dummyProduct);
            setLoading(false);
        }, 500); // 로딩 효과를 위한 지연
    }, [id]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">상품을 찾을 수 없습니다</h1>
                    <Link href="/products" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                        상품 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* 상단 내비게이션 및 작업 버튼 */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <Link href="../list" className="text-blue-500 hover:underline">
                        ← 상품 목록으로
                    </Link>
                    <span className="text-gray-500">/</span>
                    <span>{product.name}</span>
                </div>
                
                <div className="flex space-x-2">
                    <Link 
                        href={`/products/${id}/edit`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        수정하기
                    </Link>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        삭제하기
                    </button>
                </div>
            </div>
            
            {/* 상품 상세 정보 */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* 상품 이미지 */}
                    <div className="flex justify-center">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="rounded-lg object-cover w-full max-w-md h-auto"
                        />
                    </div>
                    
                    {/* 상품 기본 정보 */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <p className="text-gray-500 mb-4">카테고리: {product.category} | 원산지: {product.origin}</p>
                        
                        <div className="text-2xl font-bold text-blue-600 mb-4">
                            ₩{product.price.toLocaleString()}
                        </div>
                        
                        <div className="mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.stock === 0 ? 'bg-red-100 text-red-800' : 
                                product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                            }`}>
                                {product.stock === 0 ? '품절' : 
                                 product.stock <= 10 ? `재고 ${product.stock}개 (부족)` : 
                                 `재고 ${product.stock}개`}
                            </span>
                        </div>
                        
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        
                        {/* 상품 옵션 */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">옵션 선택</label>
                            <select className="w-full p-2 border rounded">
                                {product.options.map((option, index) => (
                                    <option key={index}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* 수량 선택 */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">수량</label>
                            <div className="flex items-center">
                                <button className="px-3 py-1 border rounded-l">-</button>
                                <input type="text" value="1" className="w-16 p-1 text-center border-t border-b" readOnly />
                                <button className="px-3 py-1 border rounded-r">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 추가 정보 탭 */}
                <div className="border-t">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">영양 정보</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-sm text-gray-500">칼로리</div>
                                <div className="font-bold">{product.nutrition.calories} kcal</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-sm text-gray-500">단백질</div>
                                <div className="font-bold">{product.nutrition.protein}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-sm text-gray-500">탄수화물</div>
                                <div className="font-bold">{product.nutrition.carbs}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-sm text-gray-500">식이섬유</div>
                                <div className="font-bold">{product.nutrition.fiber}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}