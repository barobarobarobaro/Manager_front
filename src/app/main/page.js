"use client";

import OrderStatusWidget from "@/components/OrderStatusWidget";
import SalesChart from "@/components/SalesChart";
import StockStatusWidget from "@/components/StockStatusWidget";
import CustomerFeedbackWidget from "@/components/CustomerFeedbackWidget";
import { useState } from "react";

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const orderStatuses = [
        { label: "결제대기", count: 0 },
        { label: "신규주문", count: 2 },
        { label: "예약구매", count: 1 },
        { label: "배송준비", count: 3 },
        { label: "배송중", count: 5 },
        { label: "배송완료", count: 3 },
    ];

    const stockItems = [
        { name: "사과", stock: 15,  },
        { name: "고수", stock: 8 },
        { name: "감귤", stock: 22 },
        { name: "포도", stock: 4 },
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 bg-gray-100 p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">메인 대시보드</h1>
                <p className="mb-4">안녕하세요, 바로바로 입니다!</p>
                
                {/* 위젯 그리드 레이아웃 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* 주문 상태 위젯 */}
                    <div className="bg-white rounded-lg shadow">
                        <OrderStatusWidget
                            title="주문/배송"
                            updatedAt="13:38"
                            statuses={orderStatuses}
                        />
                    </div>

                    {/* 재고 현황 위젯 */}
                    <div className="bg-white rounded-lg shadow">
                        <StockStatusWidget 
                            title="현재 판매중인 상품" 
                            items={stockItems} 
                        />
                    </div>
                    
                    {/* 일별 매출 차트 - 전체 너비 사용 */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <SalesChart />
                    </div>

                    {/* 고객 피드백 위젯 */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <CustomerFeedbackWidget title="고객 피드백" />
                    </div>
                </div>
            </main>
        </div>
    );
}