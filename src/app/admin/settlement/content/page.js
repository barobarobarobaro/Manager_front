"use client";
import React, { useState, useEffect } from "react";
import { FiDollarSign, FiList, FiPieChart, FiDownload, FiFilter, FiSearch,FiChevronDown,FiChevronUp } from "react-icons/fi";
import ResponsiveTable from "@/components/table/ResponsiveTable";
import Pagination from "@/components/common/Pagination";

export default function SettlementManagementPage() {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // 모바일 필터 토글
    const [showFilters, setShowFilters] = useState(false);

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
        },
        {
            id: 4,
            settlementDate: "2025-02-20",
            businessName: "건강한 먹거리",
            totalSales: 890000,
            commissionFee: 44500,
            settlementAmount: 845500,
            status: "정산완료"
        },
        {
            id: 5,
            settlementDate: "2025-02-19",
            businessName: "자연 팜",
            totalSales: 1120000,
            commissionFee: 56000,
            settlementAmount: 1064000,
            status: "정산대기"
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

    // 정산 상태에 따른 스타일 클래스 반환
    const getStatusClass = (status) => {
        switch (status) {
            case '정산완료':
                return 'bg-green-100 text-green-800';
            case '정산중':
                return 'bg-blue-100 text-blue-800';
            case '정산대기':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // 상태 렌더러
    const renderStatus = (status) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(status)}`}>
            {status}
        </span>
    );

    // 테이블 헤더 정의
    const tableHeaders = [
        { field: 'settlementDate', title: '정산 날짜', align: 'left' },
        { field: 'businessName', title: '업체명', align: 'left' },
        { field: 'totalSales', title: '총 매출', align: 'right',
          render: (row) => `${row.totalSales.toLocaleString()}원` },
        { field: 'commissionFee', title: '수수료', align: 'right', 
          render: (row) => `${row.commissionFee.toLocaleString()}원` },
        { field: 'settlementAmount', title: '정산 금액', align: 'right',
          render: (row) => `${row.settlementAmount.toLocaleString()}원` },
        { field: 'status', title: '상태', align: 'left' }
    ];

    // 모바일 카드 렌더러
    const renderMobileCard = (row, { isExpanded, toggleExpand }) => (
        <div>
            <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={toggleExpand}
            >
                <div>
                    <div className="font-medium">{row.businessName}</div>
                    <div className="text-sm text-gray-500">{row.settlementDate}</div>
                </div>
                <div className="flex items-center">
                    {renderStatus(row.status)}
                </div>
            </div>
            
            {isExpanded && (
                <div className="mt-3 ml-2 pl-2 border-l-2 border-gray-200 space-y-2">
                    <div className="text-sm">
                        <span className="text-gray-500">총 매출:</span>{' '}
                        <span className="font-medium">{row.totalSales.toLocaleString()}원</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">수수료:</span>{' '}
                        <span className="font-medium">{row.commissionFee.toLocaleString()}원</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">정산 금액:</span>{' '}
                        <span className="font-medium">{row.settlementAmount.toLocaleString()}원</span>
                    </div>
                </div>
            )}
        </div>
    );

    const exportSettlementData = () => {
        alert("정산 데이터를 엑셀 파일로 내보냅니다.");
        // Actual Excel export API call would be implemented here
    };

    const filteredSettlements = getFilteredSettlements();
    
    // 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSettlements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">정산 관리</h1>

            {/* Summary Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

            {/* 모바일 필터 토글 버튼 */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-between"
                >
                    <span className="flex items-center">
                        <FiFilter className="mr-2" /> 검색 및 필터
                    </span>
                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>

            {/* Search and Filtering */}
            <div className={`bg-white p-4 rounded-lg shadow mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-col w-full md:w-auto md:flex-row md:flex-wrap gap-4 items-start md:items-center">
                        <div className="w-full md:w-auto">
                            <select
                                className="w-full border rounded p-2"
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">전체 보기</option>
                                <option value="정산대기">정산 대기</option>
                                <option value="정산중">정산중</option>
                                <option value="정산완료">정산 완료</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="업체명, 날짜 검색"
                                className="w-full border rounded p-2 pl-8"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <button
                        onClick={exportSettlementData}
                        className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        <FiDownload className="mr-2" /> 엑셀 다운로드
                    </button>
                </div>
            </div>

            {/* Settlement List using ResponsiveTable */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <ResponsiveTable
                        headers={tableHeaders}
                        data={currentItems}
                        renderStatus={renderStatus}
                        renderMobileCard={renderMobileCard}
                        emptyMessage="표시할 정산 정보가 없습니다."
                        keyField="id"
                    />
                    
                    {filteredSettlements.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredSettlements.length}
                            itemsPerPage={itemsPerPage}
                            startIndex={indexOfFirstItem}
                            endIndex={Math.min(indexOfLastItem, filteredSettlements.length)}
                        />
                    )}
                </>
            )}
        </div>
    );
}