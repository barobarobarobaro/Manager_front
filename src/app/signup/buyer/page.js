"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import AddressInput from "@/components/common/AddressInput";
import { formatFullAddress } from "@/services/address-service";
import BusinessInfoForm from "@/components/common/BusinessInfoForm";
import { AlertManager } from "@/libs/AlertManager";

export default function BuyerSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 현재 단계 (1: 동의, 2: 개인정보, 3: 사업자정보)
  const [isPostcodeScriptLoaded, setIsPostcodeScriptLoaded] = useState(false);


  // 사업자 검증 API 함수 - 실제 구현은 별도 서비스로 대체
  const validateBusinessInfo = async (data) => {
    // 여기에 실제 API 호출 로직이 구현되어야 함
    console.log("사업자 정보 검증 요청:", data);

    // 테스트를 위한 가상 응답 - 실제 API 연동 시 이 부분 교체
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          message: "사업자 정보가 확인되었습니다."
        });
      }, 1000); // 1초 지연으로 API 호출처럼 보이게 함
    });
  };

  const [formData, setFormData] = useState({
    // 약관 동의
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,

    // 개인정보
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    zonecode: "",        // 우편번호
    roadAddress: "",     // 도로명 주소
    detailAddress: "",   // 상세 주소

    // 사업자 여부
    isBusinessOwner: false,

    // 사업자 정보
    businessInfo: {
      businessNumber: "",
      companyName: "",
      ceoName: "",
      businessAddress: "",
      businessZonecode: "",       // 사업장 우편번호
      businessRoadAddress: "",    // 사업장 도로명 주소
      businessDetailAddress: "",  // 사업장 상세 주소
      businessType: "",
      businessCategory: "",
      openDate: ""                // 사업자 개업일 추가
    },
    wantTaxInvoice: false,
    businessValidated: false      // 사업자 검증 여부 추가
  });

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 체크박스 처리
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }

    // 사업자 정보 필드 처리
    if (name.startsWith("business_")) {
      const businessField = name.replace("business_", "");
      setFormData({
        ...formData,
        businessInfo: {
          ...formData.businessInfo,
          [businessField]: value
        }
      });
      return;
    }

    // 일반 필드 처리
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 다음 단계로 이동
  const goToNextStep = async () => {
    // 유효성 검사
    if (currentStep === 1) {
      if (!formData.termsAgreed || !formData.privacyAgreed) {
        AlertManager.error("필수 약관에 동의해야 합니다.", "약관 동의 필요");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.phone) {
        AlertManager.error("필수 정보를 모두 입력해주세요.", "입력 필요");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        AlertManager.error("비밀번호가 일치하지 않습니다.", "비밀번호 불일치");
        return;
      }
    }

    // 사업자가 아닌 경우 마지막 단계 건너뛰기
    if (currentStep === 2 && !formData.isBusinessOwner) {
      handleSubmit();
      return;
    }

    // 다음 단계로 이동
    setCurrentStep(currentStep + 1);
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // 주소 정보 검증
    if (!formData.zonecode || !formData.roadAddress) {
      AlertManager.error("주소 정보를 입력해주세요.", "주소 미입력");
      return;
    }

    // 완성된 주소 조합
    const fullAddress = formatFullAddress(formData.roadAddress, formData.detailAddress);

    // 사업자인 경우 사업자 정보 필수 확인
    if (formData.isBusinessOwner && formData.wantTaxInvoice) {
      const { businessNumber, companyName, ceoName, businessZonecode, businessRoadAddress } = formData.businessInfo;

      if (!businessNumber || !companyName || !ceoName) {
        AlertManager.error("사업자 정보를 모두 입력해주세요.", "사업자 정보 미입력");
        return;
      }

      if (!businessZonecode || !businessRoadAddress) {
        AlertManager.error("사업장 주소 정보를 입력해주세요.", "사업장 주소 미입력");
        return;
      }

      // 사업자 정보 검증이 필요한 경우
      if (!formData.businessValidated) {
        const isValid = await validateBusiness();
        if (!isValid) return;
      }
    }

    // 주소 정보 통합
    const submitData = {
      ...formData,
      address: fullAddress
    };

    if (formData.isBusinessOwner && formData.wantTaxInvoice) {
      // 사업장 주소 조합
      const fullBusinessAddress = formatFullAddress(
        formData.businessInfo.businessRoadAddress,
        formData.businessInfo.businessDetailAddress
      );

      submitData.businessInfo = {
        ...submitData.businessInfo,
        businessAddress: fullBusinessAddress
      };
    }

    // 여기에 실제 회원가입 API 호출 로직 추가
    console.log("구매자 회원가입 정보:", submitData);

    // 성공 시 로그인 페이지로 이동
    AlertManager.success("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.", "회원가입 성공");

    // 알림이 표시된 후 잠시 대기 후 리다이렉트
    setTimeout(() => {
      router.push("../login");
    }, 3000);
  };

  // 진행 상태 표시
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
            <span className="text-sm font-medium">약관동의</span>
          </div>
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
            <span className="text-sm font-medium">개인정보</span>
          </div>
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
            <span className="text-sm font-medium">사업자정보</span>
          </div>
        </div>
        <div className="relative mt-1">
          <div className="h-1 w-full bg-gray-200 rounded">
            <div
              className="h-1 bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 50}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 1단계: 약관 동의
  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">약관 동의</h2>

        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 h-40 overflow-y-auto mb-2">
          <h3 className="font-medium mb-2">서비스 이용약관 (필수)</h3>
          <p className="text-sm text-gray-600">
            본 약관은 [회사명]이 제공하는 모든 서비스의 이용조건과 절차, 이용자와 당사의 권리, 의무, 책임사항을 규정합니다.
            서비스 이용자는 본 약관을 읽고 동의한 것으로 간주됩니다.
            [약관 세부 내용 생략...]
          </p>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">서비스 이용약관에 동의합니다 (필수)</span>
        </label>

        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 h-40 overflow-y-auto mb-2">
          <h3 className="font-medium mb-2">개인정보 수집 및 이용 동의 (필수)</h3>
          <p className="text-sm text-gray-600">
            [회사명]은 서비스 제공을 위해 최소한의 개인정보를 수집하고 있습니다.
            수집항목: 이메일, 이름, 연락처, 주소
            수집목적: 회원관리, 서비스 제공, 고객상담
            보유기간: 회원 탈퇴 시까지
            [개인정보 처리방침 세부 내용 생략...]
          </p>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="privacyAgreed"
            checked={formData.privacyAgreed}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">개인정보 수집 및 이용에 동의합니다 (필수)</span>
        </label>

        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 h-40 overflow-y-auto mb-2">
          <h3 className="font-medium mb-2">마케팅 정보 수신 동의 (선택)</h3>
          <p className="text-sm text-gray-600">
            [회사명]은 새로운 서비스 및 이벤트 정보를 제공하기 위해 마케팅 정보를 발송할 수 있습니다.
            수신 동의를 거부하셔도 기본 서비스 이용에는 제한이 없습니다.
            [마케팅 수신 동의 세부 내용 생략...]
          </p>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="marketingAgreed"
            checked={formData.marketingAgreed}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">마케팅 정보 수신에 동의합니다 (선택)</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer mt-6">
          <input
            type="checkbox"
            name="allAgreed"
            checked={formData.termsAgreed && formData.privacyAgreed && formData.marketingAgreed}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setFormData({
                ...formData,
                termsAgreed: isChecked,
                privacyAgreed: isChecked,
                marketingAgreed: isChecked
              });
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-800 font-medium">모든 약관에 동의합니다</span>
        </label>
      </div>
    );
  };

  // 2단계: 개인정보 입력
  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">개인정보 입력</h2>

        {/* 이메일 */}
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">이메일 <span className="text-red-500">*</span></span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
          </label>
        </div>

        {/* 비밀번호 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">비밀번호 <span className="text-red-500">*</span></span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </label>
        </div>

        {/* 이름 및 연락처 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">이름 <span className="text-red-500">*</span></span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">연락처 <span className="text-red-500">*</span></span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="연락처를 입력하세요"
              required
            />
          </label>
        </div>

        {/* 주소 */}
        <AddressInput
          zonecode={formData.zonecode}
          roadAddress={formData.roadAddress}
          detailAddress={formData.detailAddress}
          onChange={handleAddressChange}
          required={true}
        />

        {/* 사업자 여부 체크 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isBusinessOwner"
              checked={formData.isBusinessOwner}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">사업자입니다 (세금계산서 발행이 필요한 경우)</span>
          </label>
        </div>
      </div>
    );
  };

  // 3단계: 사업자 정보 입력
  const renderStep3 = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">사업자 정보 입력</h2>

        {/* 세금계산서 발행 희망 여부 */}
        <label className="flex items-center space-x-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            name="wantTaxInvoice"
            checked={formData.wantTaxInvoice}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">빠른 세금계산서 발행을 원합니다</span>
        </label>

        <div className={`p-4 bg-gray-50 rounded-md border border-gray-200 ${!formData.wantTaxInvoice ? 'opacity-70' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">사업자 정보</h3>
            {formData.wantTaxInvoice && formData.businessValidated && (
              <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-md">
                검증 완료
              </span>
            )}

          </div>
          <BusinessInfoForm
            businessInfo={formData.businessInfo}
            onChange={handleBusinessInfoChange}
            disabled={!formData.wantTaxInvoice}
            showValidation={formData.wantTaxInvoice} // 이 부분이 누락됨
          />
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">사업장 주소</h3>
            <AddressInput
              zonecode={formData.businessInfo.businessZonecode}
              roadAddress={formData.businessInfo.businessRoadAddress}
              detailAddress={formData.businessInfo.businessDetailAddress}
              onChange={handleBusinessAddressChange}
              disabled={!formData.wantTaxInvoice}
              required={formData.wantTaxInvoice}
            />
          </div>
          <div className="mt-4 flex justify-end">
            {formData.wantTaxInvoice && !formData.businessValidated && (
              <button
                type="button"
                onClick={validateBusiness}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                사업자 정보 검증
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
        </p>
      </div>
    );
  };

  // 현재 단계에 따른 컨텐츠 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // 탐색 버튼 렌더링
  const renderNavigation = () => {
    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={goToPrevStep}
            className="py-2 px-6 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push('../signup')}
            className="py-2 px-6 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            다음
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            가입완료
          </button>
        )}
      </div>
    );
  };

  // 우편번호 스크립트 로드 확인
  useEffect(() => {
    // window 객체에 daum이 있으면 스크립트가 로드된 것으로 판단
    if (window.daum && window.daum.Postcode) {
      setIsPostcodeScriptLoaded(true);
    }
  }, []);

  // 주소 변경 처리
  const handleAddressChange = (addressData) => {
    setFormData({
      ...formData,
      zonecode: addressData.zonecode,
      roadAddress: addressData.roadAddress,
      detailAddress: addressData.detailAddress
    });
  };

  // 사업자 주소 변경 처리 (추가 함수)
  const handleBusinessAddressChange = (addressData) => {
    setFormData({
      ...formData,
      businessInfo: {
        ...formData.businessInfo,
        businessZonecode: addressData.zonecode,
        businessRoadAddress: addressData.roadAddress,
        businessDetailAddress: addressData.detailAddress
      },
      businessValidated: false // 주소 변경 시 검증 상태 초기화
    });
  };

  // 사업자 정보 변경 처리
  const handleBusinessInfoChange = (updatedBusinessInfo) => {
    setFormData({
      ...formData,
      businessInfo: {
        ...formData.businessInfo,
        ...updatedBusinessInfo
      },
      // 정보가 변경되면 검증 상태 초기화
      businessValidated: false
    });
  };

  // 사업자 정보 검증
  const validateBusiness = async () => {
    if (!formData.wantTaxInvoice) return true;

    const { businessNumber, companyName, ceoName, openDate } = formData.businessInfo;

    if (!businessNumber || !companyName || !ceoName || !openDate) {
      AlertManager.error("사업자 정보를 모두 입력해주세요.", "사업자 정보 미입력");
      return false;
    }

    try {
      // 날짜 포맷 변환 (YYYY-MM-DD -> YYYYMMDD)
      const formattedOpenDate = openDate.replace(/-/g, '');

      // 검증 진행 알림 표시
      AlertManager.info("사업자 정보를 검증 중입니다. 잠시만 기다려주세요...", "검증 중");

      const result = await validateBusinessInfo({
        businessNumber,
        companyName,
        ceoName,
        openDate: formattedOpenDate
      });

      if (result.valid) {
        setFormData(prev => ({
          ...prev,
          businessValidated: true
        }));
        AlertManager.success("사업자 정보가 확인되었습니다.", "검증 완료");
        return true;
      } else {
        AlertManager.error(result.message, "검증 실패");
        return false;
      }
    } catch (error) {
      console.error('사업자 정보 검증 중 오류:', error);
      AlertManager.error("사업자 정보 검증 중 오류가 발생했습니다.", "검증 오류");
      return false;
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">구매자 회원가입</h1>
          <p className="text-center text-gray-600 mb-6">구매자로 가입하고 서비스를 이용해보세요</p>

          {/* 주소 스크립트는 AddressInput 컴포넌트에서 로드됨 */}

          {renderProgressBar()}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {renderStepContent()}
            {renderNavigation()}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => router.push('../login')}
                className="text-blue-600 hover:underline"
              >
                이미 계정이 있으신가요? 로그인하기
              </button>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
}