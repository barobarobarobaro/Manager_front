"use client";

import React, { useEffect, useState } from 'react';

export const ConfirmPosition = {
  CENTER: 'center',
  TOP_CENTER: 'top-center',
  BOTTOM_CENTER: 'bottom-center',
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  position = ConfirmPosition.CENTER,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const getPositionStyle = () => {
    switch (position) {
      case ConfirmPosition.TOP_CENTER:
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case ConfirmPosition.BOTTOM_CENTER:
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case ConfirmPosition.CENTER:
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleCancel}
      />

      {/* 대화 상자 */}
      <div
        className={`fixed ${getPositionStyle()} bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;