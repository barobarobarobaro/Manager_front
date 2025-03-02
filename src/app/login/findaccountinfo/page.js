"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FindAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("email"); // 'email' 또는 'password'
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendVerificationCode = (e) => {
    e.preventDefault();
    // 실제 구현에서는 API 호출하여 인증번호 발송
    setIsCodeSent(true);
    setMessage("인증번호가 발송되었습니다. 휴대폰을 확인해주세요.");
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    // 실제 구현에서는 API 호출하여 인증번호 확인
    if (verificationCode === "1234") { // 테스트용 인증번호
      setIsVerified(true);
      
      if (activeTab === "email") {
        setMessage("인증이 완료되었습니다. 회원님의 이메일은 user@example.com 입니다.");
      } else {
        setMessage("인증이 완료되었습니다. 새 비밀번호를 설정해주세요.");
      }
    } else {
      setMessage("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }
    
    // 실제 구현에서는 API 호출하여 비밀번호 변경
    setMessage("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
    
    // 3초 후 로그인 페이지로 이동
    setTimeout(() => {
      router.push("./login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">계정 정보 찾기</h1>
        
        {/* 탭 메뉴 */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 font-medium ${
              activeTab === "email" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("email");
              setIsVerified(false);
              setIsCodeSent(false);
              setMessage("");
            }}
          >
            아이디(이메일) 찾기
          </button>
          <button
            className={`flex-1 py-2 font-medium ${
              activeTab === "password" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("password");
              setIsVerified(false);
              setIsCodeSent(false);
              setMessage("");
            }}
          >
            비밀번호 찾기
          </button>
        </div>
        
        {/* 상태 메시지 */}
        {message && (
          <div className={`p-3 mb-4 rounded-md ${message.includes("성공") || message.includes("이메일은") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
            {message}
          </div>
        )}
        
        {/* 아이디 찾기 폼 */}
        {activeTab === "email" && !isVerified && (
          <form onSubmit={handleSendVerificationCode} className="space-y-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">이름</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">휴대폰 번호</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="휴대폰 번호를 입력하세요 (- 없이)"
                  required
                />
              </label>
              
              {isCodeSent && (
                <label className="block">
                  <span className="text-gray-700">인증번호</span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="인증번호 4자리를 입력하세요"
                    maxLength={4}
                    required
                  />
                </label>
              )}
            </div>
            
            {!isCodeSent ? (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                인증번호 받기
              </button>
            ) : (
              <button
                onClick={handleVerifyCode}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                인증번호 확인
              </button>
            )}
          </form>
        )}
        
        {/* 비밀번호 찾기 폼 */}
        {activeTab === "password" && !isVerified && (
          <form onSubmit={handleSendVerificationCode} className="space-y-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">이메일</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="가입한 이메일을 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">이름</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">휴대폰 번호</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="휴대폰 번호를 입력하세요 (- 없이)"
                  required
                />
              </label>
              
              {isCodeSent && (
                <label className="block">
                  <span className="text-gray-700">인증번호</span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="인증번호 4자리를 입력하세요"
                    maxLength={4}
                    required
                  />
                </label>
              )}
            </div>
            
            {!isCodeSent ? (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                인증번호 받기
              </button>
            ) : (
              <button
                onClick={handleVerifyCode}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                인증번호 확인
              </button>
            )}
          </form>
        )}
        
        {/* 비밀번호 재설정 폼 */}
        {activeTab === "password" && isVerified && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">새 비밀번호</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 비밀번호를 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">새 비밀번호 확인</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              비밀번호 변경하기
            </button>
          </form>
        )}
        
        {/* 하단 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('./login')}
            className="text-blue-600 hover:underline"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}