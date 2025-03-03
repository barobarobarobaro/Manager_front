"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userService from "@/services/userService"; // User Service 임포트
import {AlertManager} from "@/libs/AlertManager"; // AlertManager 임포트
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // 폼 제출 시 호출 (User Service의 login 사용)
  const handleSubmit = async (e) => {
    e.preventDefault();

const result = await userService.login(email, password);
    if (result.success) {
      if(result.user.role === 'buyer') {
        router.push("/user");
      }
      else {
        router.push("/admin");
      }
    } else {
      AlertManager.error(result.message || "로그인에 실패했습니다.");
    }
  };

  // 소셜 로그인 처리 함수 (테스트용 로직 유지)
  const handleSocialLogin = (provider) => {
    console.log(`${provider} 로그인 시도`);
    checkUserExists(provider).then((exists) => {
      if (exists) {
        if (provider === "kakao") {
          router.push("./user");
        } else if (provider === "naver") {
          router.push("./admin");
        }
      } else {
        setIsNewUser(true);
      }
    });
  };

  // 사용자 존재 여부 확인 (테스트용)
  const checkUserExists = async (provider) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  // 계정정보 찾기 처리
  const handleFindAccountInfo = () => {
    router.push("/login/findaccountinfo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
          Welcome To 바로바로!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          간편하게 로그인하고 서비스를 이용해보세요
        </p>

        {isNewUser ? (
          <div className="mb-6 p-4 bg-yellow-50 rounded-md">
            <p className="text-center text-gray-700">
              처음 방문하셨네요! 간단한 추가 정보를 입력하시면 서비스 이용이 가능합니다.
            </p>
            <button
              onClick={() => router.push("./signup")}
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              추가 정보 입력하기
            </button>
          </div>
        ) : (
          <>
            {/* 소셜 로그인 버튼 */}
            <div className="space-y-4 mb-6">
              <p className="text-center text-gray-600">
                테스트 단계 입니다. <br />
                카카오 로그인 시 유저, <br /> 네이버 로그인 시 관리자로 로그인 됩니다.
              </p>
              <button
                onClick={() => handleSocialLogin("kakao")}
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
                onClick={() => handleSocialLogin("naver")}
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
                <span className="px-2 bg-white text-gray-500">
                  또는 이메일로 로그인
                </span>
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

              {/* 아이디/비밀번호 찾기 링크 */}
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={handleFindAccountInfo}
                  className="text-blue-600 hover:underline"
                >
                  아이디 / 비밀번호 찾기
                </button>
              </div>

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
                onClick={() => router.push("./signup")}
                className="mt-2 w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}