"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function StoreSetupWarning() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const handleStartSetup = () => {
    router.push('/admin/guide/setup');
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          {/* 왼쪽 이미지 영역 */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-amber-50 p-5 rounded-full">
              <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>
          
          {/* 오른쪽 텍스트 영역 */}
          <div className="flex-1">
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              가게 정보를 아직 설정하지 않았습니다
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 mb-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              상품을 판매하기 위해서는 가게 정보를 등록해야 합니다. 지금 바로 가게 정보를 등록하고 판매를 시작하세요!
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={handleStartSetup}
                className="px-6 py-3 bg-amber-800 text-white font-medium rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: ["0px 4px 12px rgba(0,0,0,0.1)", "0px 6px 16px rgba(0,0,0,0.2)", "0px 4px 12px rgba(0,0,0,0.1)"],
                  transition: {
                    duration: 2,
                    repeat: Infinity
                  }
                }}
              >
                가게 정보 설정하기
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleDismiss}
                className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                나중에 하기
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        {/* 하단 가이드 섹션 */}
        <motion.div 
          className="bg-amber-50 p-6 border-t border-amber-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3 text-amber-800 text-sm">
              가게 정보 설정은 판매자 인증, 상품 등록, 주문 관리 등 모든 판매 활동의 기본이 됩니다.<br/> 정확한 정보를 입력해주세요.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}