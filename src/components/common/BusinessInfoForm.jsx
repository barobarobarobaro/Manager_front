"use client";

import React, { useState } from "react";
import { checkBusinessStatus } from "@/services/business-validation-service";
import HelpTooltip from "@/components/common/HelpTooltip";

/**
 * 사업자 정보 입력 컴포넌트
 * 사업자등록번호 입력 및 실시간 검증 기능 제공
 */
const BusinessInfoForm = ({ 
  businessInfo,
  onChange,
  disabled = false,
  showValidation = true
}) => {
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // 사업자등록번호 형식 변환 (000-00-00000)
  const formatBusinessNumber = (value) => {
    if (!value) return '';
    
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return numbers.slice(0, 3) + '-' + numbers.slice(3);
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 5) + '-' + numbers.slice(5, 10);
  };

  // 사업자등록번호 변경 핸들러
  const handleBusinessNumberChange = (e) => {
    const formatted = formatBusinessNumber(e.target.value);
    
    onChange({
      ...businessInfo,
      businessNumber: formatted
    });

    // 검증 결과 초기화
    if (validationResult) {
      setValidationResult(null);
    }
  };

  // 다른 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...businessInfo,
      [name]: value
    });
  };

  // 개업일자 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
  const formatOpenDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '');
  };

  // 사업자번호 실시간 검증
  const validateBusinessNumber = async () => {
    if (!businessInfo.businessNumber || businessInfo.businessNumber.length < 12) {
      return; // 번호가 완전하지 않으면 검증하지 않음
    }

    setIsValidating(true);
    try {
      const result = await checkBusinessStatus(businessInfo.businessNumber);
      setValidationResult(result);
    } catch (error) {
      console.error('사업자번호 검증 중 오류 발생:', error);
      setValidationResult({
        valid: false,
        message: '검증 과정에서 오류가 발생했습니다.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  // 검증 결과에 따른 스타일 설정
  const getValidationStyle = () => {
    if (!validationResult) return '';
    return validationResult.valid ? 'border-green-500' : 'border-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="block text-gray-700 font-medium">
            사업자등록번호 <span className="text-red-500">*</span>
          </label>
          <HelpTooltip 
            text="사업자등록증에 표시된 10자리 사업자등록번호를 입력해주세요."
            width="w-64"
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            name="businessNumber"
            value={businessInfo.businessNumber || ''}
            onChange={handleBusinessNumberChange}
            onBlur={validateBusinessNumber}
            placeholder="000-00-00000"
            maxLength={12}
            disabled={disabled}
            className={`p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getValidationStyle()}`}
            required
          />
          
        </div>
        {validationResult && (
          <p className={`text-sm ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
            {validationResult.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <label className="block text-gray-700 font-medium">
            회사명 <span className="text-red-500">*</span>
          </label>
          <HelpTooltip 
            text="사업자등록증에 표시된 상호명을 입력해주세요."
            width="w-64"
          />
        </div>
        <input
          type="text"
          name="companyName"
          value={businessInfo.companyName || ''}
          onChange={handleChange}
          placeholder="회사명을 입력하세요"
          disabled={disabled}
          className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <label className="block text-gray-700 font-medium">
            대표자명 <span className="text-red-500">*</span>
          </label>
          <HelpTooltip 
            text="사업자등록증에 표시된 대표자명을 입력해주세요."
            width="w-64"
          />
        </div>
        <input
          type="text"
          name="ceoName"
          value={businessInfo.ceoName || ''}
          onChange={handleChange}
          placeholder="대표자명을 입력하세요"
          disabled={disabled}
          className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <label className="block text-gray-700 font-medium">
            개업일자 <span className="text-red-500">*</span>
          </label>
          <HelpTooltip 
            text="사업자등록증에 표시된 개업일자를 입력해주세요."
            width="w-64"
          />
        </div>
        <input
          type="date"
          name="openDate"
          value={businessInfo.openDate || ''}
          onChange={handleChange}
          disabled={disabled}
          className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">
          업태
        </label>
        <input
          type="text"
          name="businessType"
          value={businessInfo.businessType || ''}
          onChange={handleChange}
          placeholder="예: 서비스업"
          disabled={disabled}
          className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">
          종목
        </label>
        <input
          type="text"
          name="businessCategory"
          value={businessInfo.businessCategory || ''}
          onChange={handleChange}
          placeholder="예: 소프트웨어 개발"
          disabled={disabled}
          className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm;