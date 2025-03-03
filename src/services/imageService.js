/**
 * 이미지 관리 서비스
 * 로컬 이미지를 우선적으로 로드하고, 실패 시 대체 이미지를 제공
 * 추후 서버 이미지 연동을 위한 확장성 제공
 */

// 이미지 경로 상수
const IMAGE_PATHS = {
    LOCAL_BASE: '/images',
    SERVER_BASE: process.env.NEXT_PUBLIC_IMAGE_SERVER_URL || '',
    FALLBACK: {
      PRODUCT: '/images/fallback/product-placeholder.png',
      STORE: '/images/fallback/store-placeholder.png',
      USER: '/images/fallback/user-placeholder.png',
      CATEGORY: '/images/fallback/category-placeholder.png',
      DEFAULT: '/images/fallback/default-placeholder.png'
    }
  };
  
  // 환경 설정
  const CONFIG = {
    USE_SERVER_IMAGES: process.env.NEXT_PUBLIC_USE_SERVER_IMAGES === 'true',
    IMAGE_QUALITY: process.env.NEXT_PUBLIC_IMAGE_QUALITY || '80',
    ENABLE_BLUR_PLACEHOLDER: process.env.NEXT_PUBLIC_ENABLE_BLUR_PLACEHOLDER === 'true',
  };
  
  /**
   * 이미지 URL 가져오기 (타입에 맞는 폴백 이미지 자동 처리)
   * @param {string} imagePath - 이미지 경로 (상대 경로)
   * @param {string} type - 이미지 타입 ('product', 'store', 'user', 'category', 'default')
   * @param {Object} options - 추가 옵션
   * @param {boolean} options.forceServer - 서버 이미지 강제 사용
   * @param {boolean} options.forceLocal - 로컬 이미지 강제 사용
   * @returns {string} 이미지 URL
   */
  const getImageUrl = (imagePath, type = 'default', options = {}) => {
    if (!imagePath) {
      return getFallbackImage(type);
    }
  
    // 이미 전체 URL인 경우 그대로 반환 (http, https, data URL)
    if (imagePath.startsWith('http://') || 
        imagePath.startsWith('https://') || 
        imagePath.startsWith('data:')) {
      return imagePath;
    }
  
    // 이미 슬래시로 시작하는 경우 (절대 경로)
    if (imagePath.startsWith('/')) {
      // 서버 이미지 강제 사용 & 서버 베이스 URL이 있는 경우
      if (options.forceServer && IMAGE_PATHS.SERVER_BASE) {
        return `${IMAGE_PATHS.SERVER_BASE}${imagePath}`;
      }
      
      return imagePath; // 이미 절대 경로이므로 그대로 반환
    }
  
    // 서버 이미지 사용 여부 결정
    const useServerImages = options.forceServer || 
                           (CONFIG.USE_SERVER_IMAGES && !options.forceLocal);
  
    // 서버 이미지를 사용하고 서버 베이스 URL이 있는 경우
    if (useServerImages && IMAGE_PATHS.SERVER_BASE) {
      return `${IMAGE_PATHS.SERVER_BASE}/${imagePath}`;
    }
  
    // 로컬 이미지 경로 반환
    return `${IMAGE_PATHS.LOCAL_BASE}/${imagePath}`;
  };
  
  /**
   * 타입에 맞는 대체 이미지 URL 가져오기
   * @param {string} type - 이미지 타입 ('product', 'store', 'user', 'category', 'default')
   * @returns {string} 대체 이미지 URL
   */
  const getFallbackImage = (type = 'default') => {
    return IMAGE_PATHS.FALLBACK[type.toUpperCase()] || IMAGE_PATHS.FALLBACK.DEFAULT;
  };
  
  /**
   * 이미지 미리 로드하기
   * @param {string} src - 이미지 경로
   * @returns {Promise} 이미지 로드 프로미스
   */
  const preloadImage = (src) => {
    if (typeof window === 'undefined') {
      return Promise.resolve(); // 서버 사이드에서는 무시
    }
  
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  };
  
  /**
   * 이미지 존재 여부 확인
   * @param {string} src - 이미지 경로
   * @returns {Promise<boolean>} 이미지 존재 여부
   */
  const imageExists = async (src) => {
    if (typeof window === 'undefined') {
      return false; // 서버 사이드에서는 항상 false
    }
  
    try {
      await preloadImage(src);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * 안전한 이미지 URL 가져오기 (이미지 존재 여부 확인 후 폴백 적용)
   * @param {string} imagePath - 이미지 경로
   * @param {string} type - 이미지 타입
   * @param {Object} options - 추가 옵션
   * @returns {Promise<string>} 최종 이미지 URL
   */
  const getSafeImageUrl = async (imagePath, type = 'default', options = {}) => {
    const imageUrl = getImageUrl(imagePath, type, options);
    
    // 이미 폴백 이미지인 경우 그대로 반환
    if (Object.values(IMAGE_PATHS.FALLBACK).includes(imageUrl)) {
      return imageUrl;
    }
  
    const exists = await imageExists(imageUrl);
    return exists ? imageUrl : getFallbackImage(type);
  };
  
  /**
   * 이미지 소스 속성 지정하기 (onError 핸들러 포함)
   * React 컴포넌트에서 <img> 태그에 바로 사용 가능
   * @param {string} imagePath - 이미지 경로
   * @param {string} type - 이미지 타입
   * @param {Object} options - 추가 옵션
   * @returns {Object} 이미지 소스 속성 객체
   */
  const getImageProps = (imagePath, type = 'default', options = {}) => {
    const fallbackSrc = getFallbackImage(type);
    const src = getImageUrl(imagePath, type, options);
    
    return {
      src,
      onError: (e) => {
        e.target.onerror = null; // 무한 루프 방지
        e.target.src = fallbackSrc;
      },
      alt: options.alt || 'Image',
      // Next.js Image 컴포넌트를 위한 추가 속성
      blurDataURL: CONFIG.ENABLE_BLUR_PLACEHOLDER ? fallbackSrc : undefined,
      placeholder: CONFIG.ENABLE_BLUR_PLACEHOLDER ? 'blur' : undefined,
    };
  };
  
  // React hook 사용을 위한 인터페이스 (선택적)
  const useImage = (imagePath, type = 'default', options = {}) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 기본값 반환
      return {
        src: getImageUrl(imagePath, type, options),
        isLoading: false,
        error: null,
        fallbackSrc: getFallbackImage(type)
      };
    }
  
    // 클라이언트 사이드에서는 React의 useState, useEffect 필요
    // 이 부분은 실제 React 컴포넌트에서 구현하는 것이 좋음
    // 여기서는 인터페이스만 제공
  };
  
  const imageService = {
    getImageUrl,
    getFallbackImage,
    preloadImage,
    imageExists,
    getSafeImageUrl,
    getImageProps,
    useImage,
    CONFIG,
    IMAGE_PATHS
  };
  
  export default imageService;