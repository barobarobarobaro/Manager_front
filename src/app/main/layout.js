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

  // 모바일에서 햄버거 버튼으로 열고 닫기
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

      {/* 사이드바 (md 이상이면 항상 열림, md 미만이면 sidebarOpen이 true일 때만 표시) */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 text-white md:block md:w-64 md:h-auto">
          <Sidebar />
        </aside>
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}