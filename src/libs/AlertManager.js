"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertPopup, { AlertType, AlertPosition } from '@/components/common/AlertPopup';

// 알림 컨텍스트 생성
const AlertContext = createContext(null);

// 알림 제공자 컴포넌트
export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  // 알림 추가
  const addAlert = useCallback((alert) => {
    const id = Date.now();
    setAlerts((prev) => [
      ...prev,
      {
        id,
        ...alert,
      },
    ]);
    return id;
  }, []);

  // 알림 제거
  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // 성공 알림
  const showSuccess = useCallback(
    (message, title = '성공', options = {}) => {
      return addAlert({
        type: AlertType.SUCCESS,
        title,
        message,
        position: options.position || AlertPosition.TOP_CENTER,
        duration: options.duration || 3000,
      });
    },
    [addAlert]
  );

  // 오류 알림
  const showError = useCallback(
    (message, title = '오류', options = {}) => {
      return addAlert({
        type: AlertType.ERROR,
        title,
        message,
        position: options.position || AlertPosition.TOP_CENTER,
        duration: options.duration || 5000,
      });
    },
    [addAlert]
  );

  // 경고 알림
  const showWarning = useCallback(
    (message, title = '주의', options = {}) => {
      return addAlert({
        type: AlertType.WARNING,
        title,
        message,
        position: options.position || AlertPosition.TOP_CENTER,
        duration: options.duration || 4000,
      });
    },
    [addAlert]
  );

  // 정보 알림
  const showInfo = useCallback(
    (message, title = '안내', options = {}) => {
      return addAlert({
        type: AlertType.INFO,
        title,
        message,
        position: options.position || AlertPosition.TOP_CENTER,
        duration: options.duration || 3000,
      });
    },
    [addAlert]
  );

  // 알림 제거 - 팝업 닫힐 때 호출
  const handleClose = useCallback((id) => {
    removeAlert(id);
  }, [removeAlert]);

  return (
    <AlertContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      
      {/* 알림 렌더링 */}
      {alerts.map((alert) => (
        <AlertPopup
          key={alert.id}
          isOpen={true}
          onClose={() => handleClose(alert.id)}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          position={alert.position}
          duration={alert.duration}
        />
      ))}
    </AlertContext.Provider>
  );
}

// 알림 훅
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

// 직접 호출할 수 있는 싱글톤 인스턴스 (저장소 패턴)
class AlertManagerClass {
  constructor() {
    this.listeners = [];
  }

  // 리스너 등록 (AlertProvider에서 호출)
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 알림 발송
  _notify(type, message, title, options = {}) {
    this.listeners.forEach(listener => {
      listener(type, message, title, options);
    });
  }

  // 공개 메서드들
  success(message, title = '성공', options = {}) {
    this._notify(AlertType.SUCCESS, message, title, options);
  }

  error(message, title = '오류', options = {}) {
    this._notify(AlertType.ERROR, message, title, options);
  }

  warning(message, title = '주의', options = {}) {
    this._notify(AlertType.WARNING, message, title, options);
  }

  info(message, title = '안내', options = {}) {
    this._notify(AlertType.INFO, message, title, options);
  }
}

// 싱글톤 인스턴스 생성
export const AlertManager = new AlertManagerClass();

// 싱글톤과 컨텍스트를 연결하기 위한 브릿지 컴포넌트
export function AlertBridge() {
  const { showSuccess, showError, showWarning, showInfo } = useAlert();

  React.useEffect(() => {
    const unsubscribe = AlertManager.subscribe((type, message, title, options) => {
      switch (type) {
        case AlertType.SUCCESS:
          showSuccess(message, title, options);
          break;
        case AlertType.ERROR:
          showError(message, title, options);
          break;
        case AlertType.WARNING:
          showWarning(message, title, options);
          break;
        case AlertType.INFO:
          showInfo(message, title, options);
          break;
        default:
          break;
      }
    });

    return unsubscribe;
  }, [showSuccess, showError, showWarning, showInfo]);

  return null;
}