"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * 주소 입력 컴포넌트
 * 우편번호 검색 및 주소 입력 필드를 제공하는 재사용 가능한 컴포넌트
 */
export default function AddressInput({
  zonecode,
  roadAddress,
  detailAddress,
  onChange,
  disabled = false,
  required = false,
  className = "",
  labelClassName = ""
}) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    if (disabled) return;
    
    // 스크립트가 로드되었는지 확인
    if (typeof window === 'undefined' || !window.daum || !window.daum.Postcode) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }
    
    // Daum 우편번호 검색 API 직접 호출
    new window.daum.Postcode({
      oncomplete: function(data) {
        if (onChange) {
          onChange({
            zonecode: data.zonecode,
            roadAddress: data.roadAddress || data.address,
            detailAddress: detailAddress // 기존 상세주소 유지
          });
        }
      }
    }).open();
  };
  
  // 상세주소 변경 핸들러
  const handleDetailAddressChange = (e) => {
    if (onChange) {
      onChange({
        zonecode,
        roadAddress,
        detailAddress: e.target.value
      });
    }
  };
  
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Daum 우편번호 스크립트 직접 포함 */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      
      <div className="flex gap-2 items-end">
        <label className="block flex-1">
          <span className={`text-gray-700 ${labelClassName}`}>
            우편번호 {required && <span className="text-red-500">*</span>}
          </span>
          <input
            type="text"
            value={zonecode || ""}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="우편번호"
            readOnly
            disabled={disabled}
            required={required}
          />
        </label>
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={disabled}
          className={`py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors h-10 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          주소 검색
        </button>
      </div>
      
      <label className="block">
        <span className={`text-gray-700 ${labelClassName}`}>
          도로명 주소 {required && <span className="text-red-500">*</span>}
        </span>
        <input
          type="text"
          value={roadAddress || ""}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="도로명 주소"
          readOnly
          disabled={disabled}
          required={required}
        />
      </label>
      
      <label className="block">
        <span className={`text-gray-700 ${labelClassName}`}>
          상세 주소
        </span>
        <input
          type="text"
          value={detailAddress || ""}
          onChange={handleDetailAddressChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="상세 주소를 입력하세요"
          disabled={disabled}
        />
      </label>
    </div>
  );
}