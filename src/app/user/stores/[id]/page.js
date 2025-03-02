'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/user/common/ProductCard";
import userService from "@/services/userService";
import storeService from "@/services/storeService";

const NoticeSection = ({ notices }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notices || notices.length === 0) {
    return null;
  }

  // 기본적으로 최근 공지 하나만 표시하고, 확장 시 전체 표시
  const displayNotices = expanded ? notices : [notices[0]];

  // 만료일 표시 함수
  const renderExpireInfo = (notice) => {
    if (!notice.expiredDate) return null;

    const expireDate = new Date(notice.expiredDate);
    const today = new Date();
    const daysLeft = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
    return (
      <span className="text-xs text-red-500 ml-2">
        {daysLeft <= 0 ? "오늘 마감" : `${daysLeft}일 남음`}
      </span>
    );
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-yellow-800">공지사항</h3>
        {notices.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-yellow-700 hover:text-yellow-900"
          >
            {expanded ? '접기' : `${notices.length}개 모두 보기`}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {displayNotices.map((notice, index) => (
          <div key={index} className="bg-white rounded p-3 border-l-4 border-yellow-400">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">
                {notice.title}
                {renderExpireInfo(notice)}
              </h4>
              <span className="text-xs text-gray-500">{notice.date}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 가게 소개 컴포넌트
const StoreInfo = ({ store }) => {
  // 프로필 이미지 렌더링 함수
  const renderProfileImage = () => {
    // 가게 프로필 이미지 표시
    if (store.profileImage) {
      return (
        <img
          src={store.profileImage}
          alt="가게 프로필 사진"
          className="w-32 h-32 rounded-full mb-2 object-cover"
        />
      );
    }

    // 기본 이미지
    return (
      <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-3xl">
        🏡
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* 가게 이미지 (배경) */}
      <div className="h-40 sm:h-64 bg-gradient-to-r from-green-500 to-green-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="p-6 flex flex-col items-center">
            {renderProfileImage()}
            <h1 className="text-white text-3xl font-bold">{store.name}</h1>
            <p className="text-white mt-2">{store.slogan || "신선한 농산물을 직접 재배합니다"}</p>
          </div>
        </div>
      </div>

      {/* 가게 정보 */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{store.name}</h2>
              {store.isOrganic && (
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {store.storeType || "인증 가게"}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{store.location}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="ml-1 font-medium">{store.rating}</span>
                <span className="mx-1 text-gray-400">|</span>
                <span className="text-sm text-gray-500">리뷰 {store.reviewCount || 0}개</span>
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
          <h3 className="text-lg font-medium mb-3">가게 소개</h3>
          <p className="text-gray-700 leading-relaxed">
            {store.description || `안녕하세요, ${store.name}입니다. 저희 가게은 ${store.location}에 위치해 있으며, 무농약 친환경 농법으로 정성껏 농산물을 재배하고 있습니다. 신선하고 안전한 먹거리를 제공하기 위해 항상 노력하고 있으니 많은 관심 부탁드립니다.`}
          </p>
        </div>

        {/* 가게 정보 목록 */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-3">가게 정보</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">주소</span>
              <span>{store.address || `${store.location} 상세주소`}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">연락처</span>
              <span>{store.phoneNumber || "010-1234-5678"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">영업시간</span>
              <span>{store.businessHours || "평일 09:00 - 18:00"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">휴무일</span>
              <span>{store.closedDays ? (Array.isArray(store.closedDays) ? store.closedDays.join(', ') : store.closedDays) : "토요일, 일요일, 공휴일"}</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-24 text-gray-500">주요 상품</span>
              <div className="flex flex-wrap gap-1">
                {(store.productCategories || []).map((crop, index) => (
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
export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params?.id;

  const [userProfile, setUserProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [categories, setCategories] = useState(["전체"]);
  const [notices, setNotices] = useState([]);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 사용자 프로필 가져오기
        const profile = userService.getUserProfile("2");
        setUserProfile(profile);

        // 가게 기본 정보 가져오기
        const storeBasic = storeService.getStoreById(parseInt(storeId));

        // 가게 상세 정보 가져오기
        const storeDetails = storeService.getStoreDetails(storeId);

        // 기본 정보와 상세 정보 합치기
        const storeData = {
          ...storeBasic,
          ...storeDetails,
        };

        setStore(storeData);

        // 가게의 상품 목록 가져오기
        const storeProducts = storeService.getStoreProducts(storeId);
        setProducts(storeProducts);
        setFilteredProducts(storeProducts);

        // 가게 설정 카테고리 불러오기 (없으면 제품에서 추출)
        let productCategories = ["전체"];

        if (storeData.productCategories && storeData.productCategories.length > 0) {
          // 가게에서 설정한 카테고리 사용
          productCategories = ["전체", ...storeData.productCategories];
        } else {
          // 제품에서 카테고리 추출
          productCategories = ["전체", ...new Set(storeProducts.map(p => p.category))];
        }

        setCategories(productCategories);

        // 공지사항 불러오기 (임시 데이터)
        const mockNotices = storeService.getStoreNotices(storeId) || [
          {
            title: "3월 신규 상품 입고 안내",
            date: "2025-03-01",
            content: "봄을 맞아 신선한 봄나물과 딸기가 입고되었습니다. 많은 관심 부탁드립니다."
          },
          {
            title: "배송 지연 안내",
            date: "2025-02-25",
            content: "최근 기상 악화로 인해 일부 지역 배송이 1-2일 지연될 수 있습니다. 양해 부탁드립니다."
          }
        ];

        setNotices(mockNotices);

        setLoading(false);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

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

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : store ? (
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
            <StoreInfo store={store} />

            {/* 공지사항 섹션 */}
            <div className="mt-8">
              <NoticeSection notices={notices} />
            </div>

            {/* 상품 목록 섹션 */}
            <section className="mt-4">
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
    </div>
  );
}