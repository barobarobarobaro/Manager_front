"use client";
import React, { useState, useEffect } from "react";
import { FiFileText, FiDollarSign, FiPrinter, FiDownload } from "react-icons/fi";

export default function TaxManagementPage() {
    const [taxReports, setTaxReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Mock tax report data
    const mockTaxReports = [
        {
            id: 1,
            year: 2025,
            month: 1,
            businessName: "오가닉 푸드마켓",
            totalSales: 15000000,
            taxableAmount: 13636364,
            taxAmount: 1363636,
            status: "발행완료"
        },
        {
            id: 2,
            year: 2025,
            month: 1,
            businessName: "신선식탁",
            totalSales: 12000000,
            taxableAmount: 10909091,
            taxAmount: 1090909,
            status: "발행대기"
        },
        {
            id: 3,
            year: 2025,
            month: 1,
            businessName: "로컬 팜스토어",
            totalSales: 20000000,
            taxableAmount: 18181818,
            taxAmount: 1818182,
            status: "발행중"
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setTaxReports(mockTaxReports);
            setLoading(false);
        }, 500);
    }, []);

    const getFilteredTaxReports = () => {
        let filtered = taxReports;

        // Apply status filter
        if (filter !== "all") {
            filtered = filtered.filter(report => report.status === filter);
        }

        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.year.toString().includes(searchTerm)
            );
        }

        return filtered;
    };

    const printTaxReports = () => {
        alert("세금계산서를 인쇄합니다.");
        // Actual print API call would be implemented here
    };

    const exportTaxData = () => {
        alert("세금 데이터를 엑셀 파일로 내보냅니다.");
        // Actual Excel export API call would be implemented here
    };

    const filteredTaxReports = getFilteredTaxReports();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">세금 관리</h1>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FiFileText className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 세금계산서</p>
                        <p className="text-xl font-bold">{taxReports.length}건</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiDollarSign className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 세금 금액</p>
                        <p className="text-xl font-bold">
                            {taxReports.reduce((sum, r) => sum + r.taxAmount, 0).toLocaleString()}원
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiFileText className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">발행 대기</p>
                        <p className="text-xl font-bold">
                            {taxReports.filter(r => r.status === "발행대기").length}건
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
                            <option value="발행대기">발행 대기</option>
                            <option value="발행중">발행중</option>
                            <option value="발행완료">발행 완료</option>
                        </select>
                        <input
                            type="text"
                            placeholder="업체명, 연도 검색"
                            className="border rounded p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={printTaxReports}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center"
                        >
                            <FiPrinter className="mr-2" /> 세금계산서 인쇄
                        </button>
                        <button
                            onClick={exportTaxData}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                        >
                            <FiDownload className="mr-2" /> 엑셀 다운로드
                        </button>
                    </div>
                </div>
            </div>

            {/* Tax Report List */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredTaxReports.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연도/월</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업체명</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총 매출</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">과세 표준액</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">세금 금액</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTaxReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {report.year}년 {report.month}월
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{report.businessName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {report.totalSales.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {report.taxableAmount.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {report.taxAmount.toLocaleString()}원
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-medium
                                            ${report.status === '발행완료' ? 'bg-green-100 text-green-800' :
                                            report.status === '발행중' ? 'bg-blue-100 text-blue-800' :
                                            report.status === '발행대기' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'}`}
                                        >
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        표시할 세금계산서 정보가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}