"use client";
import React, { useState, useEffect } from "react";
import { FiMessageCircle, FiInbox, FiCheckCircle, FiFilter, FiDownload } from "react-icons/fi";

export default function InquiryManagementPage() {
    // 문의 상태 및 로딩 상태 관리를 위한 상태 변수
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedInquiry, setExpandedInquiry] = useState(null);

    // 모의 문의 데이터 (실제 애플리케이션에서는 API에서 가져올 데이터)
    const mockInquiries = [
        {
            id: 1,
            customerName: "김철수",
            email: "kimchul@example.com",
            phoneNumber: "010-1234-5678",
            title: "상품 배송 문의",
            content: "주문한 상품의 배송 상태가 궁금합니다.",
            category: "배송",
            status: "답변대기",
            createdAt: "2025-02-23",
            response: null
        },
        {
            id: 2,
            customerName: "이영희",
            email: "leeyh@example.com",
            phoneNumber: "010-8765-4321",
            title: "제품 불량 문의",
            content: "구매한 상품에 이상이 있어 교환을 요청드립니다.",
            category: "상품불량",
            status: "답변완료",
            createdAt: "2025-02-22",
            response: "고객님, 교환 절차를 안내해드리겠습니다. 상품을 고객센터로 보내주시면 신속하게 처리해드리겠습니다."
        },
        {
            id: 3,
            customerName: "박민준",
            email: "parkmin@example.com",
            phoneNumber: "010-5555-6666",
            title: "환불 규정 문의",
            content: "환불 정책에 대해 자세히 알고 싶습니다.",
            category: "환불",
            status: "진행중",
            createdAt: "2025-02-21",
            response: "고객님의 문의사항을 확인 중입니다. 잠시만 기다려주세요."
        }
    ];

    // 컴포넌트 마운트 시 데이터 로딩 (API 호출 시뮬레이션)
    useEffect(() => {
        setTimeout(() => {
            setInquiries(mockInquiries);
            setLoading(false);
        }, 500);
    }, []);

    // 문의 필터링 함수
    const getFilteredInquiries = () => {
        let filtered = inquiries;

        // 상태별 필터링
        if (filter !== "all") {
            filtered = filtered.filter(inquiry => inquiry.status === filter);
        }

        // 검색어 필터링
        if (searchTerm) {
            filtered = filtered.filter(inquiry =>
                inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    // 문의 상세 내용 토글 함수
    const toggleInquiryExpand = (inquiryId) => {
        setExpandedInquiry(expandedInquiry === inquiryId ? null : inquiryId);
    };

    // 엑셀 다운로드 함수
    const exportInquiryData = () => {
        alert("문의 데이터를 엑셀 파일로 내보냅니다.");
        // 실제 엑셀 다운로드 API 호출 로직 필요
    };

    // 필터링된 문의 목록
    const filteredInquiries = getFilteredInquiries();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">문의 관리</h1>

            {/* 요약 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiInbox className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">답변 대기</p>
                        <p className="text-xl font-bold">
                            {inquiries.filter(i => i.status === "답변대기").length}건
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiMessageCircle className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">진행중</p>
                        <p className="text-xl font-bold">
                            {inquiries.filter(i => i.status === "진행중").length}건
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FiCheckCircle className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">답변 완료</p>
                        <p className="text-xl font-bold">
                            {inquiries.filter(i => i.status === "답변완료").length}건
                        </p>
                    </div>
                </div>
            </div>

            {/* 검색 및 필터링 */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* 상태 필터 */}
                        <select
                            className="border rounded p-2"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">전체 보기</option>
                            <option value="답변대기">답변 대기</option>
                            <option value="진행중">진행중</option>
                            <option value="답변완료">답변 완료</option>
                        </select>

                        {/* 검색 입력 */}
                        <input
                            type="text"
                            placeholder="고객명, 제목, 내용 검색"
                            className="border rounded p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 엑셀 다운로드 버튼 */}
                    <button
                        onClick={exportInquiryData}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                    >
                        <FiDownload className="mr-2" /> 엑셀 다운로드
                    </button>
                </div>
            </div>

            {/* 문의 목록 */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredInquiries.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">문의 일자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInquiries.map((inquiry) => (
                                <React.Fragment key={inquiry.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{inquiry.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{inquiry.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => toggleInquiryExpand(inquiry.id)}
                                                className="text-blue-600 hover:underline text-left"
                                            >
                                                {inquiry.title}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{inquiry.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${inquiry.status === '답변완료' ? 'bg-green-100 text-green-800' :
                                                inquiry.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                                                inquiry.status === '답변대기' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}
                                            >
                                                {inquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                                                답변하기
                                            </button>
                                        </td>
                                    </tr>
                                    {/* 문의 상세 내용 확장 */}
                                    {expandedInquiry === inquiry.id && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="font-medium">문의 내용:</span>
                                                        <p>{inquiry.content}</p>
                                                    </div>
                                                    {inquiry.response && (
                                                        <div>
                                                            <span className="font-medium">답변 내용:</span>
                                                            <p>{inquiry.response}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-x-2">
                                                        <span className="font-medium">연락처:</span>
                                                        <span>{inquiry.phoneNumber}</span>
                                                        <span>({inquiry.email})</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        표시할 문의 정보가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}