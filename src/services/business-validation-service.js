
"use client";

/**
 * 사업자등록정보 진위확인 및 상태조회 서비스
 * 국세청 API를 활용한 사업자 정보 검증
 */

const API_BASE_URL = "https://api.odcloud.kr/api/nts-businessman/v1";
const SERVICE_KEY = "KxCI14mPbsF1FsuvP8%2F27TXnUtApgD8vns%2FfQtpkSS3Hd%2BcGzaRXQGA5dQJY5vamG4AP%2BZNKcheplWrlHm%2FIlw%3D%3D"; // 인코딩된 서비스 키

/**
 * 사업자 등록번호 유효성 검사 (형식 검사)
 * @param {string} businessNumber - 검사할 사업자등록번호
 * @returns {boolean} 유효한 형식인지 여부
 */
export const validateBusinessNumberFormat = (businessNumber) => {
  const regex = /^\d{10}$/; // 10자리 숫자만 허용
  return regex.test(businessNumber);
};

/**
 * 사업자등록번호 하이픈 제거
 * @param {string} businessNumber - 하이픈이 포함된 사업자번호
 * @returns {string} 하이픈이 제거된 사업자번호
 */
export const removeHyphens = (businessNumber) => {
  return businessNumber.replace(/-/g, '');
};

/**
 * 사업자등록번호 상태 조회
 * @param {string} businessNumber - 조회할 사업자등록번호
 * @returns {Promise<object>} 상태 조회 결과
 */
export const checkBusinessStatus = async (businessNumber) => {
  try {
    const cleanedNumber = removeHyphens(businessNumber);
    
    if (!validateBusinessNumberFormat(cleanedNumber)) {
      return {
        valid: false,
        message: "사업자등록번호 형식이 올바르지 않습니다. 10자리 숫자로 입력해주세요."
      };
    }

    const response = await fetch(`${API_BASE_URL}/status?serviceKey=${SERVICE_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        b_no: [cleanedNumber]
      })
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    
    // API 응답 결과 처리
    if (data?.data?.[0]) {
      const result = data.data[0];
      
      // b_stt_cd: 계속사업자(01), 휴업자(02), 폐업자(03)
      if (result.b_stt_cd === '01') {
        return {
          valid: true,
          status: 'active',
          message: '정상 사업자입니다.',
          data: result
        };
      } else if (result.b_stt_cd === '02') {
        return {
          valid: true,
          status: 'suspended',
          message: '휴업 상태인 사업자입니다.',
          data: result
        };
      } else if (result.b_stt_cd === '03') {
        return {
          valid: false,
          status: 'closed',
          message: '폐업된 사업자입니다.',
          data: result
        };
      } else {
        return {
          valid: false,
          status: 'unknown',
          message: '사업자 상태를 확인할 수 없습니다.',
          data: result
        };
      }
    } else {
      return {
        valid: false,
        message: '사업자등록번호 조회 결과가 없습니다.'
      };
    }
  } catch (error) {
    console.error('사업자등록번호 상태 조회 중 오류 발생:', error);
    return {
      valid: false,
      message: '사업자등록번호 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };
  }
};

/**
 * 사업자등록정보 진위확인
 * @param {object} businessInfo - 확인할 사업자 정보
 * @returns {Promise<object>} 진위 확인 결과
 */
export const validateBusinessInfo = async (businessInfo) => {
  try {
    const { businessNumber, companyName, ceoName, openDate } = businessInfo;
    
    const cleanedNumber = removeHyphens(businessNumber);
    
    if (!validateBusinessNumberFormat(cleanedNumber)) {
      return {
        valid: false,
        message: "사업자등록번호 형식이 올바르지 않습니다. 10자리 숫자로 입력해주세요."
      };
    }

    // 사업자 상태 먼저 확인 (폐업 여부 등 확인)
    const statusResult = await checkBusinessStatus(cleanedNumber);
    if (!statusResult.valid) {
      return statusResult;
    }

    // 진위확인 API 호출
    const response = await fetch(`${API_BASE_URL}/validate?serviceKey=${SERVICE_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        businesses: [
          {
            b_no: cleanedNumber,      // 사업자등록번호
            start_dt: openDate,       // 개업일자(YYYYMMDD)
            p_nm: ceoName,            // 대표자명
            corp_nm: companyName      // 상호
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    
    if (data?.data?.[0]) {
      const result = data.data[0];
      
      if (result.valid === '01') {
        return {
          valid: true,
          message: '유효한 사업자 정보입니다.',
          data: result
        };
      } else {
        return {
          valid: false,
          message: '사업자 정보가 일치하지 않습니다. 정확한 정보를 입력해주세요.',
          data: result
        };
      }
    } else {
      return {
        valid: false,
        message: '사업자등록정보 확인 결과가 없습니다.'
      };
    }
  } catch (error) {
    console.error('사업자등록정보 진위확인 중 오류 발생:', error);
    return {
      valid: false,
      message: '사업자등록정보 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };
  }
};

export default {
  checkBusinessStatus,
  validateBusinessInfo,
  validateBusinessNumberFormat,
  removeHyphens
};