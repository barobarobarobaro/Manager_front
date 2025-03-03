"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertPopup, { AlertType, AlertPosition } from '@/components/common/AlertPopup';
import ConfirmDialog, { ConfirmPosition } from '@/components/common/ConfirmDialogPopup';

// 알림 컨텍스트 생성
const AlertContext = createContext(null);

// 알림 제공자 컴포넌트
export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [confirms, setConfirms] = useState([]);

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

  // 확인 대화상자 추가
  const addConfirm = useCallback((confirm) => {
    const id = Date.now();
    return new Promise((resolve) => {
      setConfirms((prev) => [
        ...prev,
        {
          id,
          ...confirm,
          onResolve: resolve
        },
      ]);
    });
  }, []);

  // 확인 대화상자 제거
  const removeConfirm = useCallback((id) => {
    setConfirms((prev) => prev.filter((confirm) => confirm.id !== id));
  }, []);

  // 확인 대화상자 표시
  const showConfirm = useCallback(
    (message, title = '확인', options = {}) => {
      return addConfirm({
        title,
        message,
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        position: options.position || ConfirmPosition.CENTER,
      });
    },
    [addConfirm]
  );

  // 알림 제거 - 팝업 닫힐 때 호출
  const handleAlertClose = useCallback((id) => {
    removeAlert(id);
  }, [removeAlert]);

  // 확인 대화상자 닫기 - 확인 버튼 클릭 시
  const handleConfirmConfirm = useCallback((id) => {
    const confirm = confirms.find(c => c.id === id);
    if (confirm && confirm.onResolve) {
      confirm.onResolve(true);
    }
    removeConfirm(id);
  }, [confirms, removeConfirm]);

  // 확인 대화상자 닫기 - 취소 버튼 클릭 시
  const handleConfirmCancel = useCallback((id) => {
    const confirm = confirms.find(c => c.id === id);
    if (confirm && confirm.onResolve) {
      confirm.onResolve(false);
    }
    removeConfirm(id);
  }, [confirms, removeConfirm]);

  return (
    <AlertContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
      }}
    >
      {children}
      
      {/* 알림 렌더링 */}
      {alerts.map((alert) => (
        <AlertPopup
          key={alert.id}
          isOpen={true}
          onClose={() => handleAlertClose(alert.id)}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          position={alert.position}
          duration={alert.duration}
        />
      ))}

      {/* 확인 대화상자 렌더링 */}
      {confirms.map((confirm) => (
        <ConfirmDialog
          key={confirm.id}
          isOpen={true}
          onClose={() => handleConfirmCancel(confirm.id)}
          onConfirm={() => handleConfirmConfirm(confirm.id)}
          onCancel={() => handleConfirmCancel(confirm.id)}
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          position={confirm.position}
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
    this.confirmListeners = [];
  }

  // 리스너 등록 (AlertProvider에서 호출)
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 확인 대화상자 리스너 등록
  subscribeConfirm(listener) {
    this.confirmListeners.push(listener);
    return () => {
      this.confirmListeners = this.confirmListeners.filter(l => l !== listener);
    };
  }

  // 알림 발송
  _notify(type, message, title, options = {}) {
    this.listeners.forEach(listener => {
      listener(type, message, title, options);
    });
  }

  // 확인 대화상자 발송
  _confirm(message, title, options = {}) {
    const promises = this.confirmListeners.map(listener => listener(message, title, options));
    return promises.length > 0 ? promises[0] : Promise.resolve(false);
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

  confirm(message, title = '확인', options = {}) {
    return this._confirm(message, title, options);
  }
}

// 싱글톤 인스턴스 생성
export const AlertManager = new AlertManagerClass();

// 싱글톤과 컨텍스트를 연결하기 위한 브릿지 컴포넌트
export function AlertBridge() {
  const { showSuccess, showError, showWarning, showInfo, showConfirm } = useAlert();

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

    const unsubscribeConfirm = AlertManager.subscribeConfirm((message, title, options) => {
      return showConfirm(message, title, options);
    });

    return () => {
      unsubscribe();
      unsubscribeConfirm();
    };
  }, [showSuccess, showError, showWarning, showInfo, showConfirm]);

  return null;
}