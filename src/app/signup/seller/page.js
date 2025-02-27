"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    // 판매자 추가 정보
    businessName: "",
    businessNumber: "",
    businessCertificate: null,
  });
  
  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // 파일 업로드 처리
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      businessCertificate: e.target.files[0],
    });
  };
  
  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    // 여기에 실제 회원가입 API 호출 로직 추가
    console.log("판매자 회원가입 정보:", formData);
    
    // 성공 시 로그인 페이지로 이동
    alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
    router.push("../login");
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">판매자 회원가입</h1>
          <p className="text-center text-gray-600 mb-6">판매자로 가입하고 서비스를 제공해보세요</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">기본 정보</h2>
            
            {/* 이메일 */}
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-gray-700">이메일</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </label>
            </div>
            
            {/* 비밀번호 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">비밀번호</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">비밀번호 확인</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </label>
            </div>
            
            {/* 이름 및 연락처 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">이름</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700">연락처</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="연락처를 입력하세요"
                  required
                />
              </label>
            </div>
            
            {/* 주소 */}
            <label className="block">
              <span className="text-gray-700">주소</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="주소를 입력하세요"
                required
              />
            </label>
            
            {/* 사업자 정보 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">사업자 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700">상호명</span>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="상호명을 입력하세요"
                    required
                  />
                </label>
                
                <label className="block">
                  <span className="text-gray-700">사업자 등록번호</span>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="사업자 등록번호를 입력하세요"
                    required
                  />
                </label>
              </div>
              
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">사업자 등록증</span>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="businessCertificate"
                      onChange={handleFileChange}
                      className="p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept="image/*, application/pdf"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG 또는 PDF 파일 (최대 5MB)</p>
                </label>
              </div>
            </div>
            
            {/* 가입 버튼 */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                가입하기
              </button>
              
              <div className="mt-4 text-center flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push('../signup')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← 회원 유형 선택으로 돌아가기
                </button>
                <button
                  type="button"
                  onClick={() => router.push('../login')}
                  className="text-blue-600 hover:underline"
                >
                  이미 계정이 있으신가요? 로그인하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}