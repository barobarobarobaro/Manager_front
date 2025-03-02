"use client";

import React, { useState, useEffect } from "react";

// 알림 타입 상수 정의
export const AlertType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
};

// 알림 위치 상수 정의
export const AlertPosition = {
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_RIGHT: "bottom-right"
};

export default function AlertPopup({ 
  isOpen = true,
  title,
  message, 
  type = AlertType.INFO,
  position = AlertPosition.TOP_CENTER,
  duration = 3000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  // isOpen prop이 변경되면 가시성 상태 업데이트
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // 지속 시간 후 자동 닫기
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  // 닫기 처리 (애니메이션 포함)
  const handleClose = () => {
    setIsVisible(false);
    
    // 애니메이션 완료 후 onClose 콜백 호출
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300); // 300ms는 애니메이션 기간과 일치해야 함
    }
  };

  // 위치 클래스 가져오기
  const getPositionClasses = () => {
    switch (position) {
      case AlertPosition.TOP_RIGHT:
        return "top-4 right-4";
      case AlertPosition.BOTTOM_CENTER:
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case AlertPosition.BOTTOM_RIGHT:
        return "bottom-4 right-4";
      case AlertPosition.TOP_CENTER:
      default:
        return "top-4 left-1/2 transform -translate-x-1/2";
    }
  };

  // 타입에 따른 스타일 및 아이콘 설정
  const getAlertStyles = () => {
    switch (type) {
      case AlertType.SUCCESS:
        return {
          containerClass: "bg-green-50 border-l-4 border-green-500",
          iconClass: "text-green-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ),
          titleClass: "text-green-800",
          messageClass: "text-green-700"
        };
      case AlertType.ERROR:
        return {
          containerClass: "bg-red-50 border-l-4 border-red-500",
          iconClass: "text-red-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          ),
          titleClass: "text-red-800",
          messageClass: "text-red-700"
        };
      case AlertType.WARNING:
        return {
          containerClass: "bg-yellow-50 border-l-4 border-yellow-500",
          iconClass: "text-yellow-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          ),
          titleClass: "text-yellow-800",
          messageClass: "text-yellow-700"
        };
      case AlertType.INFO:
      default:
        return {
          containerClass: "bg-blue-50 border-l-4 border-blue-500",
          iconClass: "text-blue-500",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          ),
          titleClass: "text-blue-800",
          messageClass: "text-blue-700"
        };
    }
  };

  const styles = getAlertStyles();
  const positionClasses = getPositionClasses();

  // 컴포넌트가 열려 있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-50 ${positionClasses} transition-all duration-300 ease-in-out shadow-lg
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
      role="alert"
    >
      <div 
        className={`max-w-md rounded-md ${styles.containerClass} overflow-hidden shadow-md`}
      >
        <div className="p-4 flex items-start">
          <div className={`flex-shrink-0 ${styles.iconClass} mr-3 mt-0.5`}>
            {styles.icon}
          </div>
          
          <div className="flex-1 ml-2">
            {title && (
              <h3 className={`text-sm font-semibold ${styles.titleClass}`}>
                {title}
              </h3>
            )}
            {message && (
              <div className={`${title ? 'mt-1' : ''} text-sm ${styles.messageClass}`}>
                {message}
              </div>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="닫기"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}