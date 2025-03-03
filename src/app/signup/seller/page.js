"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressInput from "@/components/common/AddressInput";
import { formatFullAddress } from "@/services/address-service";
import BusinessInfoForm from "@/components/common/BusinessInfoForm";
import { AlertManager } from "@/libs/AlertManager";
import userService from "@/services/userService";

export default function SellerSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 1: 약관, 2: 개인정보, 3: 사업자정보
  const [isPostcodeScriptLoaded, setIsPostcodeScriptLoaded] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [useBusinessAsStoreAddress, setUseBusinessAsStoreAddress] = useState(false);

  const [formData, setFormData] = useState({
    // 약관 동의
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
    sellerPolicyAgreed: false,

    // 개인정보
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    zonecode: "",
    roadAddress: "",
    detailAddress: "",

    // 사업자 정보 (판매자는 필수)
    businessInfo: {
      businessNumber: "",
      companyName: "",
      ceoName: "",
      businessAddress: "",
      businessZonecode: "",
      businessRoadAddress: "",
      businessDetailAddress: "",
      businessType: "",
      businessCategory: "",
      openDate: ""
    }
  });

  // 이메일 중복 검증 상태
  const [isEmailValid, setIsEmailValid] = useState(true);

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 다음 단계로 이동
  const goToNextStep = async () => {
    if (currentStep === 1) {
      if (!formData.termsAgreed || !formData.privacyAgreed || !formData.sellerPolicyAgreed) {
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
      if (!formData.zonecode || !formData.roadAddress) {
        AlertManager.error("주소 정보를 입력해주세요.", "주소 미입력");
        return;
      }
    } else if (currentStep === 3) {
      // 판매자는 사업자 정보 필수
      const { businessNumber, companyName, ceoName, businessZonecode, businessRoadAddress } = formData.businessInfo;
      if (!businessNumber || !companyName || !ceoName) {
        AlertManager.error("사업자 정보를 모두 입력해주세요.", "사업자 정보 미입력");
        return;
      }
      if (!businessZonecode || !businessRoadAddress) {
        AlertManager.error("사업장 주소 정보를 입력해주세요.", "사업장 주소 미입력");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // 완성된 주소 조합 (개인 주소)
    const fullAddress = formatFullAddress(formData.roadAddress, formData.detailAddress);
    
    // 사업자 주소 조합
    const fullBusinessAddress = formatFullAddress(
      formData.businessInfo.businessRoadAddress,
      formData.businessInfo.businessDetailAddress
    );
    
    // 데이터 통합
    const submitData = {
      ...formData,
      address: fullAddress,
      businessInfo: {
        ...formData.businessInfo,
        businessAddress: fullBusinessAddress
      },
      role: "seller" // 판매자 역할 지정
    };

    console.log("판매자 회원가입 정보:", submitData);
    const result = await userService.register(submitData); // 기본 register 함수 사용
    
    if (!result.success) {
      AlertManager.error(result.message, "회원가입 실패");
    } else {
      AlertManager.success("판매자 회원가입이 완료되었습니다. 로그인 후 가게 정보를 등록해주세요.", "회원가입 성공");
      setTimeout(() => {
        router.push("../login");
      }, 3000);
    }
  };

  // 진행 상태 표시 (진행 바)
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="text-sm font-medium">약관동의</span>
          </div>
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="text-sm font-medium">개인정보</span>
          </div>
          <div className="flex-1 text-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-1 ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
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
          <h3 className="font-medium mb-2">판매자 이용 정책 동의 (필수)</h3>
          <p className="text-sm text-gray-600">
            [회사명]의 판매자 이용 정책에는 상품 등록, 판매, 배송, 정산 등에 관한 규정이 포함되어 있습니다.
            판매자는 본 약관을 준수하여야 하며, 위반 시 서비스 이용이 제한될 수 있습니다.
            수수료 정책: 판매 금액의 일정 비율이 수수료로 부과됩니다.
            [판매자 이용 정책 세부 내용 생략...]
          </p>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="sellerPolicyAgreed"
            checked={formData.sellerPolicyAgreed}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">판매자 이용 정책에 동의합니다 (필수)</span>
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
            checked={formData.termsAgreed && formData.privacyAgreed && formData.sellerPolicyAgreed && formData.marketingAgreed}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setFormData({
                ...formData,
                termsAgreed: isChecked,
                privacyAgreed: isChecked,
                sellerPolicyAgreed: isChecked,
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
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">이메일 <span className="text-red-500">*</span></span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => {
                if (formData.email) {
                  const duplicate = userService.isEmailDuplicate(formData.email);
                  if (duplicate) {
                    AlertManager.error("이미 사용 중인 이메일입니다.", "이메일 중복");
                    setIsEmailValid(false);
                  } else {
                    setIsEmailValid(true);
                  }
                }
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
            {formData.email && (
              <p className="mt-1 text-xs font-medium">
                {isEmailValid ? (
                  <span className="text-green-600">사용 가능한 이메일입니다.</span>
                ) : (
                  <span className="text-red-600">이미 사용 중인 이메일입니다.</span>
                )}
              </p>
            )}
          </label>
        </div>

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

        <AddressInput
          zonecode={formData.zonecode}
          roadAddress={formData.roadAddress}
          detailAddress={formData.detailAddress}
          onChange={handleAddressChange}
          required={true}
        />
      </div>
    );
  };

  // 3단계: 사업자 정보 입력
  const renderStep3 = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">사업자 정보 입력</h2>
        <p className="text-gray-600 mb-4">판매자는 사업자 정보 입력이 필수입니다.</p>

        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="mb-3">
            <h3 className="text-lg font-medium text-gray-800">사업자 정보</h3>
          </div>
          <BusinessInfoForm
            businessInfo={formData.businessInfo}
            onChange={handleBusinessInfoChange}
            disabled={false}
            showValidation={true}
          />
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">사업장 주소</h3>
            <label className="flex items-center space-x-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={useSameAddress}
                onChange={handleSameAddressChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">개인 주소와 동일합니다</span>
            </label>
            <AddressInput
              zonecode={formData.businessInfo.businessZonecode}
              roadAddress={formData.businessInfo.businessRoadAddress}
              detailAddress={formData.businessInfo.businessDetailAddress}
              onChange={handleBusinessAddressChange}
              disabled={useSameAddress}
              required={!useSameAddress}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
        </p>
      </div>
    );
  };

  // 4단계: 가게 정보 입력
  const renderStep4 = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">가게 정보 입력</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">가게명 <span className="text-red-500">*</span></span>
            <input
              type="text"
              name="store_storeName"
              value={formData.storeInfo.storeName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="가게명을 입력하세요"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">가게 설명</span>
            <textarea
              name="store_storeDescription"
              value={formData.storeInfo.storeDescription}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="가게에 대한 간략한 설명을 입력하세요"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">가게 연락처 <span className="text-red-500">*</span></span>
            <input
              type="tel"
              name="store_storePhone"
              value={formData.storeInfo.storePhone}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="가게 연락처를 입력하세요"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">업종 카테고리 <span className="text-red-500">*</span></span>
            <select
              name="store_categoryId"
              value={formData.storeInfo.categoryId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">선택하세요</option>
              <option value="1">식품</option>
              <option value="2">의류</option>
              <option value="3">가전</option>
              <option value="4">가구</option>
              <option value="5">도서</option>
              <option value="6">기타</option>
            </select>
          </label>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">가게 주소 <span className="text-red-500">*</span></h3>
          <div className="flex flex-col gap-2 mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useBusinessAsStoreAddress}
                onChange={handleBusinessAsStoreAddressChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">사업장 주소와 동일합니다</span>
            </label>
          </div>
          <AddressInput
            zonecode={formData.storeInfo.storeZonecode}
            roadAddress={formData.storeInfo.storeRoadAddress}
            detailAddress={formData.storeInfo.storeDetailAddress}
            onChange={handleStoreAddressChange}
            disabled={useBusinessAsStoreAddress}
            required={!useBusinessAsStoreAddress}
          />
        </div>

        <label className="block mt-4">
          <span className="text-gray-700">영업시간</span>
          <textarea
            name="store_businessHours"
            value={formData.storeInfo.businessHours}
            onChange={handleChange}
            rows="2"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 평일 10:00-18:00, 주말 휴무"
          />
        </label>

        <label className="block mt-4">
          <span className="text-gray-700">배송 정보</span>
          <textarea
            name="store_deliveryInfo"
            value={formData.storeInfo.deliveryInfo}
            onChange={handleChange}
            rows="2"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="배송 방법, 배송비, 배송 소요일 등"
          />
        </label>

        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">정산 계좌 정보 <span className="text-red-500">*</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-700">은행명</span>
              <select
                name="store_bankName"
                value={formData.storeInfo.bankName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
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
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">계좌번호</span>
              <input
                type="text"
                name="store_accountNumber"
                value={formData.storeInfo.accountNumber}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="'-' 없이 입력하세요"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">예금주</span>
              <input
                type="text"
                name="store_accountHolder"
                value={formData.storeInfo.accountHolder}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예금주명을 입력하세요"
                required
              />
            </label>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
        </p>
      </div>
    );
  };

  const handleSameAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseSameAddress(isChecked);
    if (isChecked) {
      setFormData({
        ...formData,
        businessInfo: {
          ...formData.businessInfo,
          businessZonecode: formData.zonecode,
          businessRoadAddress: formData.roadAddress,
          businessDetailAddress: formData.detailAddress
        }
      });
    }
  };

  const handleBusinessAsStoreAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseBusinessAsStoreAddress(isChecked);
    if (isChecked) {
      setFormData({
        ...formData,
        storeInfo: {
          ...formData.storeInfo,
          storeZonecode: formData.businessInfo.businessZonecode,
          storeRoadAddress: formData.businessInfo.businessRoadAddress,
          storeDetailAddress: formData.businessInfo.businessDetailAddress
        }
      });
    }
  };

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

  useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      setIsPostcodeScriptLoaded(true);
    }
  }, []);

  const handleAddressChange = (addressData) => {
    setFormData({
      ...formData,
      zonecode: addressData.zonecode,
      roadAddress: addressData.roadAddress,
      detailAddress: addressData.detailAddress
    });
    if (useSameAddress) {
      setFormData(prevData => ({
        ...prevData,
        businessInfo: {
          ...prevData.businessInfo,
          businessZonecode: addressData.zonecode,
          businessRoadAddress: addressData.roadAddress,
          businessDetailAddress: addressData.detailAddress
        }
      }));
      if (useBusinessAsStoreAddress) {
        setFormData(prevData => ({
          ...prevData,
          storeInfo: {
            ...prevData.storeInfo,
            storeZonecode: addressData.zonecode,
            storeRoadAddress: addressData.roadAddress,
            storeDetailAddress: addressData.detailAddress
          }
        }));
      }
    }
  };

  const handleBusinessAddressChange = (addressData) => {
    setFormData({
      ...formData,
      businessInfo: {
        ...formData.businessInfo,
        businessZonecode: addressData.zonecode,
        businessRoadAddress: addressData.roadAddress,
        businessDetailAddress: addressData.detailAddress
      }
    });
    if (useBusinessAsStoreAddress) {
      setFormData(prevData => ({
        ...prevData,
        storeInfo: {
          ...prevData.storeInfo,
          storeZonecode: addressData.zonecode,
          storeRoadAddress: addressData.roadAddress,
          storeDetailAddress: addressData.detailAddress
        }
      }));
    }
  };

  const handleStoreAddressChange = (addressData) => {
    setFormData({
      ...formData,
      storeInfo: {
        ...formData.storeInfo,
        storeZonecode: addressData.zonecode,
        storeRoadAddress: addressData.roadAddress,
        storeDetailAddress: addressData.detailAddress
      }
    });
  };

  const handleBusinessInfoChange = (updatedBusinessInfo) => {
    setFormData({
      ...formData,
      businessInfo: {
        ...formData.businessInfo,
        ...updatedBusinessInfo
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">판매자 회원가입</h1>
          <p className="text-center text-gray-600 mb-6">판매자로 가입하고 상품을 판매해보세요</p>

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