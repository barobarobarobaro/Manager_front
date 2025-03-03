import userService from "@/services/userService";
import { formatFullAddress } from "@/services/address-service";
// 필요에 따라 AlertManager 등 추가 라이브러리 임포트 가능

/**
 * 구매자 회원가입 서비스 함수
 * @param {Object} formData - 회원가입 폼 데이터
 * @returns {Promise<Object>} { success: boolean, message?: string, user?: Object }
 */
export const buyerSignup = async (formData) => {
  // 필수 약관 동의 체크
  if (!formData.termsAgreed || !formData.privacyAgreed) {
    return { success: false, message: "필수 약관에 동의해야 합니다." };
  }
  // 필수 개인정보 검증
  if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.phone) {
    return { success: false, message: "필수 정보를 모두 입력해주세요." };
  }
  if (formData.password !== formData.confirmPassword) {
    return { success: false, message: "비밀번호가 일치하지 않습니다." };
  }
  // 주소 정보 검증
  if (!formData.zonecode || !formData.roadAddress) {
    return { success: false, message: "주소 정보를 입력해주세요." };
  }

  // 완성된 주소 조합 (개인 주소)
  const fullAddress = formatFullAddress(formData.roadAddress, formData.detailAddress);
  const signupData = {
    ...formData,
    address: fullAddress
  };

  // 사업자 정보가 필요한 경우, 사업장 주소 조합
  if (formData.isBusinessOwner && formData.wantTaxInvoice) {
    if (
      !formData.businessInfo.businessNumber ||
      !formData.businessInfo.companyName ||
      !formData.businessInfo.ceoName ||
      !formData.businessInfo.businessRoadAddress ||
      !formData.businessInfo.businessZonecode
    ) {
      return { success: false, message: "사업자 정보를 모두 입력해주세요." };
    }

    const fullBusinessAddress = formatFullAddress(
      formData.businessInfo.businessRoadAddress,
      formData.businessInfo.businessDetailAddress
    );

    signupData.businessInfo = {
      ...formData.businessInfo,
      businessAddress: fullBusinessAddress
    };
  }

  // 회원가입 API 호출 (userService.register 사용)
  const result = await userService.register(signupData);
  return result;
};