'use client';
import React,{useState} from 'react';

// 타입별 SVG 아이콘 컴포넌트
const IconComponents = {
  // 상품 기본 아이콘
  product: ({ className = "w-10 h-10", color = "currentColor" }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  ),
  
  // 가게 기본 아이콘
  store: ({ className = "w-10 h-10", color = "currentColor" }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  ),
  
  // 사용자 기본 아이콘
  user: ({ className = "w-10 h-10", color = "currentColor" }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  ),
  
  // 카테고리 기본 아이콘
  category: ({ className = "w-10 h-10", color = "currentColor" }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
    </svg>
  ),
  
  // 기본 아이콘 (다른 타입이 지정되지 않은 경우)
  default: ({ className = "w-10 h-10", color = "currentColor" }) => (
    <svg className={className} fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  )
};

/**
 * 이미지 또는 기본 SVG 아이콘을 표시하는 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.src - 이미지 URL
 * @param {string} props.type - 이미지 타입 (product, store, user, category, default)
 * @param {string} props.alt - 대체 텍스트
 * @param {string} props.className - 컨테이너 클래스
 * @param {string} props.imgClassName - 이미지 클래스
 * @param {string} props.iconClassName - 아이콘 클래스
 * @param {string} props.iconColor - 아이콘 색상
 * @returns {JSX.Element}
 */
const ImageOrIcon = ({ 
  src, 
  type = 'default', 
  alt = '', 
  className = '', 
  imgClassName = 'w-full h-full object-cover',
  iconClassName = 'w-full h-full',
  iconColor = '#888',
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 이미지 타입에 따른 아이콘 컴포넌트
  const IconComponent = IconComponents[type.toLowerCase()] || IconComponents.default;
  
  // 이미지 경로가 없거나 로딩 에러 시 아이콘 표시
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`} {...props}>
        <IconComponent className={iconClassName} color={iconColor} />
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className={iconClassName} color={iconColor} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default ImageOrIcon;