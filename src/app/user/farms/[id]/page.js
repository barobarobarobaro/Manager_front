'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/user/common/Header";
import Footer from "@/components/user/common/Footer";
import ProductCard from "@/components/user/common/ProductCard";
import userService from "@/services/userService";

// 가게 소개 컴포넌트
const FarmInfo = ({ farm }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        setError("사용자 정보를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  // 프로필 이미지 렌더링 함수
  const renderProfileImage = () => {
    if (loading) {
      // 로딩 중 표시
      return (
        <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      );
    }

    if (error || !user) {
      // 오류 또는 사용자 정보가 없을 때 기본 이미지
      return (
        <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-3xl">
          👤
        </div>
      );
    }

    // 사용자 프로필 이미지 표시
    return (
      <img
        src={user.profileImage || "/images/profile.jpeg"}
        alt="프로필 사진"
        className="w-32 h-32 rounded-full mb-2 object-cover"
      />
    );
  };
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* 가게 이미지 (배경) */}
      <div className="h-40 sm:h-64 bg-gradient-to-r from-green-500 to-green-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="p-6 flex flex-col items-center">
            {renderProfileImage()}
            <h1 className="text-white text-3xl font-bold">{farm.name}</h1>
            <p className="text-white mt-2">{farm.slogan || "신선한 농산물을 직접 재배합니다"}</p>
          </div>
        </div>
      </div>

      {/* 가게 정보 */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{farm.name}</h2>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">인증 농장</span>
            </div>
            <p className="text-gray-600 mt-1">{farm.location}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="ml-1 font-medium">{farm.rating}</span>
                <span className="mx-1 text-gray-400">|</span>
                <span className="text-sm text-gray-500">리뷰 {farm.reviewCount || 128}개</span>
              </div>
            </div>
          </div>
          <div className="flex mt-4 sm:mt-0 space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              찜하기
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              문의하기
            </button>
          </div>
        </div>

        {/* 가게 소개 */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-3">농장 소개</h3>
          <p className="text-gray-700 leading-relaxed">
            {farm.description || `안녕하세요, ${farm.name}입니다. 저희 농장은 ${farm.location}에 위치해 있으며, 무농약 친환경 농법으로 정성껏 농산물을 재배하고 있습니다. 신선하고 안전한 먹거리를 제공하기 위해 항상 노력하고 있으니 많은 관심 부탁드립니다.`}
          </p>
        </div>

        {/* 가게 정보 목록 */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-3">농장 정보</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">주소</span>
              <span>{farm.fullAddress || `${farm.location} 상세주소`}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">연락처</span>
              <span>{farm.phone || "010-1234-5678"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">영업시간</span>
              <span>{farm.businessHours || "평일 09:00 - 18:00"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">휴무일</span>
              <span>{farm.holiday || "토요일, 일요일, 공휴일"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">주요 작물</span>
              <div className="flex flex-wrap gap-1">
                {(farm.mainCrops || ["감자", "당근", "양파", "토마토"]).map((crop, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {crop}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 카테고리 탭 컴포넌트
const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto py-4 whitespace-nowrap gap-2 sm:gap-4 mb-4 pb-1">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${activeCategory === category
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// 가게 상세 페이지
export default function FarmDetailPage() {
  const params = useParams();
  const farmId = params?.id;

  const [userProfile, setUserProfile] = useState(null);
  const [farm, setFarm] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [categories, setCategories] = useState(["전체"]);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 사용자 프로필 가져오기
        const profile = userService.getUserProfile("2");
        setUserProfile(profile);

        // 가게 정보 가져오기 (모의 데이터)
        const mockFarm = {
          id: parseInt(farmId),
          name: "한들농원",
          location: "강원도 평창",
          rating: 4.8,
          productCount: 15,
          slogan: "깨끗한 자연에서 키운 신선한 농산물",
          description: "한들농원은 강원도 평창의 맑은 공기와 깨끗한 물로 농산물을 재배합니다. 무농약, 친환경 재배를 원칙으로 하며, 소비자의 건강을 최우선으로 생각합니다. 정성껏 키운 농산물을 합리적인 가격에 제공해 드립니다.",
          fullAddress: "강원도 평창군 대관령면 올림픽로 123",
          phone: "010-1234-5678",
          businessHours: "평일 09:00 - 18:00",
          holiday: "일요일, 공휴일",
          mainCrops: ["감자", "당근", "양파", "토마토", "고구마"],
          reviewCount: 128
        };

        // 가게 ID에 따라 이름 변경 (실제로는 API에서 가져와야 함)
        if (farmId === "2") {
          mockFarm.name = "푸른들팜";
          mockFarm.location = "전라남도 나주";
        } else if (farmId === "3") {
          mockFarm.name = "산골마을";
          mockFarm.location = "경상북도 안동";
        }

        setFarm(mockFarm);

        // 가게의 상품 목록 가져오기
        const farmProducts = userService.getFarmProducts(farmId.toString());
        setProducts(farmProducts);
        setFilteredProducts(farmProducts);

        // 상품 카테고리 추출
        const productCategories = ["전체", ...new Set(farmProducts.map(p => p.category))];
        setCategories(productCategories);

        setLoading(false);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setLoading(false);
      }
    };

    if (farmId) {
      fetchData();
    }
  }, [farmId]);

  // 카테고리 변경 시 상품 필터링
  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    if (category === "전체") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  // 장바구니에 추가 함수
  const addToCart = (product) => {
    alert(`${product.name}을(를) 구매합니다!`);
  };

  // 예약 구매 함수
  const reserveProduct = (product) => {
    alert(`${product.name}을(를) 예약 구매합니다!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : farm ? (
          <>
            {/* 뒤로 가기 버튼 */}
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-green-600">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                뒤로 가기
              </Link>
            </div>

            {/* 가게 정보 */}
            <FarmInfo farm={farm} />

            {/* 상품 목록 섹션 */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-4">판매 상품</h2>

              {/* 카테고리 필터 */}
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategoryChange}
              />

              {/* 상품 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">해당 카테고리의 상품이 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">다른 카테고리를 선택해보세요</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">가게 정보를 찾을 수 없습니다</h3>
            <p className="mt-1 text-gray-500">잘못된 접근이거나 더 이상 존재하지 않는 가게입니다.</p>
            <Link href="/" className="mt-6 inline-block px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}