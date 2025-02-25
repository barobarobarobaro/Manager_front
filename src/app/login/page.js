"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">로그인</h1>
        
        <label className="block mb-4">
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="이메일을 입력하세요"
            required
          />
        </label>
        
        <label className="block mb-6">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </label>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  );
}