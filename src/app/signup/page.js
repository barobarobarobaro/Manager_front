"use client";

import { useRouter } from "next/navigation";

export default function SignupSelectPage() {
  const router = useRouter();

  // 구매자 회원가입 페이지로 이동
  const handleBuyerSignup = () => {
    router.push('./signup/buyer');
  };

  // 판매자 회원가입 페이지로 이동
  const handleSellerSignup = () => {
    router.push('./signup/seller');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">바로바로 회원가입</h1>
        <p className="text-center text-gray-600 mb-10">회원 유형을 선택해주세요</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 구매자 가입 버튼 */}
          <button
            onClick={handleBuyerSignup}
            className="flex flex-col items-center justify-center p-8 border-2 border-blue-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">구매자</h2>
            <p className="text-gray-600 text-center">상품을 구매하고 서비스를 이용하실 분</p>
          </button>

          {/* 판매자 가입 버튼 */}
          <button
            onClick={handleSellerSignup}
            className="flex flex-col items-center justify-center p-8 border-2 border-blue-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">판매자</h2>
            <p className="text-gray-600 text-center">상품을 판매하고 서비스를 제공하실 분</p>
          </button>
        </div>

        {/* 로그인으로 돌아가기 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('./login')}
            className="text-blue-600 hover:underline"
          >
            이미 계정이 있으신가요? 로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}