import Sidebar from "@/components/Sidebar";
import OrderStatusWidget from "@/components/OrderStatusWidget";
import SalesChart from "@/components/SalesChart";
export default function AdminDashboard() {
    const orderStatuses = [
        { label: "결제대기", count: 0 },
        { label: "신규주문", count: 2 },
        { label: "예약구매", count: 1 },
        { label: "배송준비", count: 3 },
    ];

    return (
        <div className="min-h-screen flex">
            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 bg-gray-100 p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
                <p>반응형 레이아웃 예시입니다.</p>
                <OrderStatusWidget
                    title="주문/배송"
                    updatedAt="13:38"
                    statuses={orderStatuses}
                />
                {/* 일별 매출 차트 */}
                <div className="mt-6">
                    <SalesChart />
                </div>

                {/* 추가 위젯 등 */}
            </main>
        </div>
    );
}