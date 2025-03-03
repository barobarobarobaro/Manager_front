"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AddressInput from "@/components/common/AddressInput";
import { formatFullAddress } from "@/services/address-service";
import { AlertManager } from "@/libs/AlertManager";

export default function StoreSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
    storePhone: "",
    storeAddress: "",
    storeZonecode: "",
    storeRoadAddress: "",
    storeDetailAddress: "",
    businessHours: "",
    categoryId: "",
    deliveryInfo: "",
    bankName: "",
    accountNumber: "",
    accountHolder: ""
  });

  // 단계 정의
  const steps = [
    {
      id: 'basic-info',
      title: '기본 정보',
      description: '가게의 기본 정보를 입력해주세요.',
      fields: ['storeName', 'storeDescription', 'storePhone', 'categoryId']
    },
    {
      id: 'address-info',
      title: '주소 정보',
      description: '가게의 위치 정보를 입력해주세요.',
      fields: ['storeZonecode', 'storeRoadAddress', 'storeDetailAddress']
    },
    {
      id: 'business-info',
      title: '영업 정보',
      description: '영업 시간 및 배송 정보를 입력해주세요.',
      fields: ['businessHours', 'deliveryInfo']
    },
    {
      id: 'account-info',
      title: '정산 정보',
      description: '판매 대금을 받을 계좌 정보를 입력해주세요.',
      fields: ['bankName', 'accountNumber', 'accountHolder']
    }
  ];

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value
    });
  };

  // 주소 변경 처리
  const handleAddressChange = (addressData) => {
    setStoreData({
      ...storeData,
      storeZonecode: addressData.zonecode,
      storeRoadAddress: addressData.roadAddress,
      storeDetailAddress: addressData.detailAddress
    });
  };

  // 현재 단계의 유효성 검사
  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep];
    
    // 필수 필드 체크
    if (currentStepData.id === 'basic-info') {
      if (!storeData.storeName || !storeData.storePhone || !storeData.categoryId) {
        AlertManager.error("가게명, 연락처, 카테고리는 필수 입력사항입니다.", "필수 정보 미입력");
        return false;
      }
    } 
    else if (currentStepData.id === 'address-info') {
      if (!storeData.storeZonecode || !storeData.storeRoadAddress) {
        AlertManager.error("가게 주소 정보를 입력해주세요.", "주소 미입력");
        return false;
      }
    }
    else if (currentStepData.id === 'account-info') {
      if (!storeData.bankName || !storeData.accountNumber || !storeData.accountHolder) {
        AlertManager.error("정산 계좌 정보를 모두 입력해주세요.", "계좌 정보 미입력");
        return false;
      }
    }
    
    return true;
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 50);
    } else {
      handleSubmit();
    }
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
      }, 50);
    }
  };

  // 가게 정보 저장
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // 완성된 주소 조합
      const fullStoreAddress = formatFullAddress(
        storeData.storeRoadAddress,
        storeData.storeDetailAddress
      );
      
      // 서버에 가게 정보 등록 요청
      const response = await registerStore({
        ...storeData,
        storeAddress: fullStoreAddress
      });
      
      if (response.success) {
        AlertManager.success("가게 정보가 성공적으로 등록되었습니다.", "등록 완료");
        router.push('/seller/dashboard');
      } else {
        AlertManager.error(response.message || "가게 정보 등록 중 오류가 발생했습니다.", "등록 실패");
      }
    } catch (error) {
      AlertManager.error("서버 통신 중 오류가 발생했습니다.", "오류 발생");
      console.error("가게 등록 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자가 판매자 권한이 있는지 확인
  useEffect(() => {
    // 사용자 정보와 권한 확인 로직
    // 판매자가 아니면 리디렉션
    const checkAuth = async () => {
      try {
        const userInfo = await getUserInfo(); // 사용자 정보 가져오는 함수
        if (!userInfo || userInfo.role !== 'seller') {
          AlertManager.error("판매자 권한이 필요합니다.", "접근 제한");
          router.push('/login');
        }
      } catch (error) {
        console.error("권한 확인 오류:", error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // 애니메이션 효과 정의
  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 500 : -500,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 500 : -500,
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      };
    }
  };

  // 현재 단계 데이터
  const currentStepData = steps[currentStep];

  // 기본 정보 단계 렌더링
  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-gray-700">가게명 <span className="text-red-500">*</span></span>
          <motion.input
            type="text"
            name="storeName"
            value={storeData.storeName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="가게명을 입력하세요"
            required
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">가게 설명</span>
          <motion.textarea
            name="storeDescription"
            value={storeData.storeDescription}
            onChange={handleChange}
            rows="3"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="가게에 대한 간략한 설명을 입력하세요"
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700">가게 연락처 <span className="text-red-500">*</span></span>
          <motion.input
            type="tel"
            name="storePhone"
            value={storeData.storePhone}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="가게 연락처를 입력하세요"
            required
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">업종 카테고리 <span className="text-red-500">*</span></span>
          <motion.select
            name="categoryId"
            value={storeData.categoryId}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <option value="">선택하세요</option>
            <option value="1">식품</option>
            <option value="2">의류</option>
            <option value="3">가전</option>
            <option value="4">가구</option>
            <option value="5">도서</option>
            <option value="6">기타</option>
          </motion.select>
        </label>
      </div>
    </div>
  );

  // 주소 정보 단계 렌더링
  const renderAddressStep = () => (
    <div className="space-y-6">
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-2">가게 주소 <span className="text-red-500">*</span></h3>
        <AddressInput
          zonecode={storeData.storeZonecode}
          roadAddress={storeData.storeRoadAddress}
          detailAddress={storeData.storeDetailAddress}
          onChange={handleAddressChange}
          required={true}
        />
      </motion.div>
    </div>
  );

  // 영업 정보 단계 렌더링
  const renderBusinessInfoStep = () => (
    <div className="space-y-6">
      <motion.label 
        className="block mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-gray-700">영업시간</span>
        <motion.textarea
          name="businessHours"
          value={storeData.businessHours}
          onChange={handleChange}
          rows="2"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="예: 평일 10:00-18:00, 주말 휴무"
          whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
        />
      </motion.label>

      <motion.label 
        className="block mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-gray-700">배송 정보</span>
        <motion.textarea
          name="deliveryInfo"
          value={storeData.deliveryInfo}
          onChange={handleChange}
          rows="2"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="배송 방법, 배송비, 배송 소요일 등"
          whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
        />
      </motion.label>
    </div>
  );

  // 계좌 정보 단계 렌더링
  const renderAccountInfoStep = () => (
    <div className="space-y-6">
      <motion.div 
        className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-3">정산 계좌 정보 <span className="text-red-500">*</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.label 
            className="block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-700">은행명</span>
            <motion.select
              name="bankName"
              value={storeData.bankName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            >
              <option value="">선택하세요</option>
              <option value="국민은행">국민은행</option>
              <option value="신한은행">신한은행</option>
              <option value="우리은행">우리은행</option>
              <option value="하나은행">하나은행</option>
              <option value="농협은행">농협은행</option>
              <option value="기업은행">기업은행</option>
              <option value="카카오뱅크">카카오뱅크</option>
              <option value="토스뱅크">토스뱅크</option>
            </motion.select>
          </motion.label>

          <motion.label 
            className="block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-gray-700">계좌번호</span>
            <motion.input
              type="text"
              name="accountNumber"
              value={storeData.accountNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="'-' 없이 입력하세요"
              required
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            />
          </motion.label>

          <motion.label 
            className="block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-gray-700">예금주</span>
            <motion.input
              type="text"
              name="accountHolder"
              value={storeData.accountHolder}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예금주명을 입력하세요"
              required
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
            />
          </motion.label>
        </div>
      </motion.div>
    </div>
  );

  // 현재 단계에 따라 적절한 폼 렌더링
  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'basic-info':
        return renderBasicInfoStep();
      case 'address-info':
        return renderAddressStep();
      case 'business-info':
        return renderBusinessInfoStep();
      case 'account-info':
        return renderAccountInfoStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 헤더 */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">가게 정보 설정</h1>
          </div>
          
          {/* 진행 상태 표시 */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id} 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 24
                  }}
                >
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStep 
                        ? 'bg-blue-600 text-white' 
                        : index === currentStep 
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                          : 'bg-gray-200 text-gray-600'
                    }`}
                    animate={index === currentStep ? {
                      scale: [1, 1.15, 1],
                      transition: {
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1.5
                      }
                    } : {}}
                  >
                    {index < currentStep ? (
                      <motion.svg 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.svg>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <motion.span 
                    className="text-xs mt-1 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >{step.title}</motion.span>
                </motion.div>
              ))}
            </div>
            
            <div className="w-full bg-gray-200 h-1 mb-6 overflow-hidden">
              <motion.div 
                className="bg-blue-600 h-1" 
                initial={{ width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%` }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 40
                }}
              ></motion.div>
            </div>
          </div>
          
          {/* 폼 컨텐츠 */}
          <div className="p-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div 
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.h2 
                  className="text-lg font-medium text-gray-900 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentStepData.title}
                </motion.h2>
                <motion.p 
                  className="text-sm text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentStepData.description}
                </motion.p>
                
                {renderStepContent()}
                
                <motion.p 
                  className="text-sm text-gray-500 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* 버튼 영역 */}
          <motion.div 
            className="bg-gray-50 px-6 py-4 flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              type="button"
              onClick={currentStep === 0 ? () => router.push('/seller/dashboard') : handlePrev}
              className="py-2 px-6 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === 0 ? '취소' : '이전'}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className={`py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={
                currentStep === steps.length - 1 
                  ? { 
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1
                      }
                    } 
                  : {}
              }
            >
              {isLoading 
                ? '처리중...' 
                : currentStep === steps.length - 1 
                  ? '가게 정보 저장' 
                  : '다음'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// 가게 정보 등록 함수 (API 호출)
async function registerStore(storeData) {
  try {
    // 실제 환경에서는 API 호출
    console.log("가게 정보 등록:", storeData);
    
    // 테스트용 성공 응답
    return {
      success: true,
      message: "가게 정보가 성공적으로 등록되었습니다.",
      storeId: "store_" + Math.floor(Math.random() * 1000)
    };
  } catch (error) {
    console.error("가게 등록 API 오류:", error);
    return {
      success: false,
      message: error.message || "가게 등록 중 오류가 발생했습니다."
    };
  }
}

// 사용자 정보 가져오는 함수 (API 호출)
async function getUserInfo() {
  // 실제 환경에서는 API 호출 또는 상태 관리 라이브러리에서 가져오기
  // 테스트용 더미 데이터
  return {
    id: "user_123",
    name: "홍길동",
    email: "seller@example.com",
    role: "seller"
  };
}