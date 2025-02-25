"use client";
import React, { useState, useEffect } from "react";
import { FiDollarSign, FiList, FiPieChart, FiDownload } from "react-icons/fi";

export default function SettlementManagementPage() {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Mock settlement data
    const mockSettlements = [
        {
            id: 1,
            settlementDate: "2025-02-23",
            businessName: "오가닉 푸드마켓",
            totalSales: 1250000,
            commissionFee: 62500,
            settlementAmount: 1187500,
            status: "정산완료"
        },
        {
            id: 2,
            settlementDate: "2025-02-22",
            businessName: "신선식탁",
            totalSales: 980000,
            commissionFee: 49000,
            settlementAmount: 931000,
            status: "정산대기"
        },
        {
            id: 3,
            settlementDate: "2025-02-21",
            businessName: "로컬 팜스토어",
            totalSales: 1750000,
            commissionFee: 87500,
            settlementAmount: 1662500,
            status: "정산중"
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setSettlements(mockSettlements);
            setLoading(false);
        }, 500);
    }, []);

    const getFilteredSettlements = () => {
        let filtered = settlements;

        // Apply status filter
        if (filter !== "all") {
            filtered = filtered.filter(settlement => settlement.status === filter);
        }

        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(settlement =>
                settlement.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                settlement.settlementDate.includes(searchTerm)
            );
        }

        return filtered;
    };

    const exportSettlementData = () => {
        alert("정산 데이터를 엑셀 파일로 내보냅니다.");
        // Actual Excel export API call would be implemented here
    };

    const filteredSettlements = getFilteredSettlements();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">정산 관리</h1>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FiDollarSign className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 정산 금액</p>
                        <p className="text-xl font-bold">
                            {settlements.reduce((sum, s) => sum + s.settlementAmount, 0).toLocaleString()}원
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiList className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">정산 대기</p>
                        <p className="text-xl font-bold">
                            {settlements.filter(s => s.status === "정산대기").length}건
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiPieChart className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 수수료</p>
                        <p className="text-xl font-bold">
                            {settlements.reduce((sum, s) => sum + s.commissionFee, 0).toLocaleString()}원
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filtering */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-2 items-center">
                        <select
                            className="border rounded p-2"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">전체 보기</option>
                            <option value="정산대기">정산 대기</option>
                            <option value="정산중">정산중</option>
                            <option value="정산완료">정산 완료</option>
                        </select>
                        <input
                            type="text"
                            placeholder="업체명, 날짜 검색"
                            className="border rounded p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={exportSettlementData}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                    >
                        <FiDownload className="mr-2" /> 엑셀 다운로드
                    </button>
                </div>
            </div>

            {/* Settlement List */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredSettlements.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정산 날짜</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업체명</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총 매출</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수수료</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">정산 금액</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSettlements.map((settlement) => (
                                <tr key={settlement.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{settlement.settlementDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{settlement.businessName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{settlement.totalSales.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{settlement.commissionFee.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{settlement.settlementAmount.toLocaleString()}원</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-medium
                                            ${settlement.status === '정산완료' ? 'bg-green-100 text-green-800' :
                                            settlement.status === '정산중' ? 'bg-blue-100 text-blue-800' :
                                            settlement.status === '정산대기' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'}`}
                                        >
                                            {settlement.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        표시할 정산 정보가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}