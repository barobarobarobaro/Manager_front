"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 화면 크기에 따라 사이드바 상태 자동 설정
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        // 데스크톱 환경
        setSidebarOpen(true);
      } else {
        // 모바일 환경
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // 마운트 시 한 번 실행

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 모바일에서 사이드바 열고 닫기
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 모바일에서 ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 모바일 헤더 (md 이상에서 숨김) */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between md:hidden">
        <div className="font-bold">LOGO</div>
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-700 rounded focus:outline-none"
        >
          {sidebarOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* 모바일 사이드바 오버레이 (md 미만에서만 적용) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* 배경 오버레이 - 클릭하면 사이드바 닫힘 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onMouseDown={() => setSidebarOpen(false)}
          ></div>

          {/* 사이드바 컨텐츠 */}
          <div className="relative flex-1 flex flex-col w-full max-w-xs bg-gray-800 text-white shadow-xl">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white focus:outline-none"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* 데스크탑 사이드바 (md 이상에서만 표시) */}
      <aside className="hidden md:block w-64 bg-gray-800 text-white">
        <Sidebar />
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}