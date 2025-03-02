"use client";

/**
 * 주소 검색 서비스
 * Daum 우편번호 API를 활용한 주소 검색 기능 제공
 */

// 스크립트 로드 상태 확인
export const isPostcodeScriptLoaded = () => {
  return typeof window !== 'undefined' && window.daum && window.daum.Postcode;
};

/**
 * 주소 검색 팝업을 띄우는 함수
 * @param {Function} callback - 주소 선택 완료 후 실행할 콜백 함수
 * @param {Object} options - Daum 우편번호 API 옵션
 */
export const openPostcodePopup = (callback, options = {}) => {
  if (!isPostcodeScriptLoaded()) {
    console.error('우편번호 스크립트가 로드되지 않았습니다.');
    return false;
  }

  const defaultCallback = (data) => {
    // 기본 데이터 포맷
    const addressData = {
      zonecode: data.zonecode,
      roadAddress: data.roadAddress || data.address,
      jibunAddress: data.jibunAddress,
      buildingName: data.buildingName,
      // 조합된 전체 주소
      fullAddress: data.buildingName 
        ? `${data.roadAddress || data.address} (${data.buildingName})`
        : data.roadAddress || data.address
    };
    
    callback(addressData);
  };

  // Daum 우편번호 검색 팝업 열기
  new window.daum.Postcode({
    oncomplete: defaultCallback,
    ...options
  }).open();

  return true;
};

/**
 * 주소 데이터를 전체 주소 문자열로 조합
 * @param {string} roadAddress - 도로명 주소
 * @param {string} detailAddress - 상세 주소
 * @returns {string} 조합된 전체 주소
 */
export const formatFullAddress = (roadAddress, detailAddress) => {
  if (!roadAddress) return '';
  
  return detailAddress 
    ? `${roadAddress}, ${detailAddress}` 
    : roadAddress;
};

/**
 * 주소 입력을 위한 React Hook
 * @param {Function} setFormData - 폼 데이터 업데이트 함수
 * @param {string} prefix - 필드 접두어 (비즈니스 주소인 경우 'business_')
 * @returns {Function} 주소 검색 핸들러 함수
 */
export const useAddressSearch = (setFormData, prefix = '') => {
  const isBusinessAddress = prefix === 'business_';
  
  return () => {
    openPostcodePopup((addressData) => {
      if (isBusinessAddress) {
        // 사업자 주소인 경우
        setFormData(prevFormData => ({
          ...prevFormData,
          businessInfo: {
            ...prevFormData.businessInfo,
            businessZonecode: addressData.zonecode,
            businessRoadAddress: addressData.roadAddress,
            // fullAddress는 저장하지 않고 제출 시 조합
          }
        }));
      } else {
        // 개인 주소인 경우
        setFormData(prevFormData => ({
          ...prevFormData,
          zonecode: addressData.zonecode,
          roadAddress: addressData.roadAddress,
          // fullAddress는 저장하지 않고 제출 시 조합
        }));
      }
    });
  };
};

export default {
  isPostcodeScriptLoaded,
  openPostcodePopup,
  formatFullAddress,
  useAddressSearch
};