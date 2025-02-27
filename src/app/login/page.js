"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 폼 제출 시 호출
  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제 로그인 로직 (예: API 호출) 대신 간단히 비교
    if (email === "admin@test.com" && password === "1234") {
      // 로그인 성공 시 메인 페이지로 이동
      router.push("./main");
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 소셜 로그인 처리 함수
  const handleSocialLogin = (provider) => {
    // 실제 구현에서는 각 소셜 로그인 API를 호출
    console.log(`${provider} 로그인 시도`);
    router.push("./main");
    // 예시: router.push(`/api/auth/${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">Welcome To 바로바로!</h1>
        <p className="text-center text-gray-600 mb-6">간편하게 로그인하고 서비스를 이용해보세요</p>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-4 mb-6">
          <button 
            onClick={() => handleSocialLogin('kakao')}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-yellow-50 transition-colors"
          >
            <Image 
              src="/images/kakao_login.png" 
              alt="카카오 로그인" 
              width={240} 
              height={45}
              className="cursor-pointer"
            />
          </button>
          
          <button 
            onClick={() => handleSocialLogin('naver')}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-green-50 transition-colors"
          >
            <Image 
              src="/images/naver_login.png" 
              alt="네이버 로그인" 
              width={240} 
              height={45}
              className="cursor-pointer"
            />
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는 이메일로 로그인</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            로그인
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">계정이 없으신가요?</p>
          <button
            onClick={() => router.push('./signup')}
            className="mt-2 w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}