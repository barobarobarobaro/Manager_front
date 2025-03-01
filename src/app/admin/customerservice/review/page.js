"use client";
import React, { useState, useEffect } from "react";
import { FiStar, FiMessageSquare, FiFilter, FiDownload, FiX, FiCheck } from "react-icons/fi";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function ReviewManagementPage() {
    // 리뷰 상태 및 로딩 상태 관리를 위한 상태 변수
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedReview, setExpandedReview] = useState(null);
    
    // 답변 관련 상태
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    // 모의 리뷰 데이터 (실제 애플리케이션에서는 API에서 가져올 데이터)
    const mockReviews = [
        {
            id: 1,
            productName: "유기농 사과 1kg",
            customerName: "김철수",
            rating: 5,
            content: "정말 신선하고 맛있는 사과예요! 다음에도 구매하고 싶습니다.",
            imageUrls: ["/api/placeholder/200/200", "/api/placeholder/200/200"],
            status: "승인",
            createdAt: "2025-02-23",
            sellerResponse: null
        },
        {
            id: 2,
            productName: "국내산 참외 2kg",
            customerName: "이영희",
            rating: 4,
            content: "참외가 꽤 괜찮습니다. 다만 조금 비싼 편이에요.",
            imageUrls: ["/api/placeholder/200/200"],
            status: "대기",
            createdAt: "2025-02-22",
            sellerResponse: null
        },
        {
            id: 3,
            productName: "제철 딸기 500g",
            customerName: "박민준",
            rating: 3,
            content: "딸기 상태가 조금 아쉬웠어요. 다음에는 더 신선한 상품을 선택하고 싶습니다.",
            imageUrls: ["/api/placeholder/200/200"],
            status: "대기",
            createdAt: "2025-02-22",
            sellerResponse: null
        },
        {
            id: 4, // ID가 3에서 4로 수정되었습니다(중복 key 해결)
            productName: "제철 딸기 500g",
            customerName: "박민준",
            rating: 3,
            content: "딸기 상태가 조금 아쉬웠어요. 다음에는 더 신선한 상품을 선택하고 싶습니다.",
            imageUrls: [],
            status: "숨김",
            createdAt: "2025-02-21",
            sellerResponse: "고객님의 소중한 의견 감사드립니다. 더 나은 품질 관리를 위해 노력하겠습니다."
        }
    ];

    // 컴포넌트 마운트 시 데이터 로딩 (API 호출 시뮬레이션)
    useEffect(() => {
        setTimeout(() => {
            setReviews(mockReviews);
            setLoading(false);
        }, 500);
    }, []);

    // 리뷰 필터링 함수
    const getFilteredReviews = () => {
        let filtered = reviews;

        // 상태별 필터링
        if (filter !== "all") {
            filtered = filtered.filter(review => review.status === filter);
        }

        // 검색어 필터링
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    // 리뷰 상세 내용 토글 함수
    const toggleReviewExpand = (reviewId) => {
        setExpandedReview(expandedReview === reviewId ? null : reviewId);
        // 답변 모드를 닫음
        setReplyingTo(null);
    };

    // 답변 모드 시작
    const startReplying = (reviewId) => {
        const review = reviews.find(r => r.id === reviewId);
        setReplyingTo(reviewId);
        // 기존 답변이 있으면 에디터에 표시
        setReplyContent(review.sellerResponse || "");
    };

    // 답변 취소
    const cancelReply = () => {
        setReplyingTo(null);
        setReplyContent("");
    };

    // 답변 저장
    const saveReply = (reviewId) => {
        // 실제로는 API 호출로 저장해야 함
        const updatedReviews = reviews.map(review => 
            review.id === reviewId
                ? { ...review, sellerResponse: replyContent }
                : review
        );
        
        setReviews(updatedReviews);
        setReplyingTo(null);
        setReplyContent("");
        alert("답변이 저장되었습니다.");
    };

    // 리뷰 상태 변경 함수
    const changeReviewStatus = (reviewId, newStatus) => {
        // 실제로는 API 호출로 상태 변경
        const updatedReviews = reviews.map(review => 
            review.id === reviewId
                ? { ...review, status: newStatus }
                : review
        );
        
        setReviews(updatedReviews);
        alert(`리뷰가 ${newStatus} 상태로 변경되었습니다.`);
    };

    // 엑셀 다운로드 함수
    const exportReviewData = () => {
        alert("리뷰 데이터를 엑셀 파일로 내보냅니다.");
        // 실제 엑셀 다운로드 API 호출 로직 필요
    };

    // 별점 렌더링 함수
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        className={`${star <= rating ? 'text-yellow-500' : 'text-gray-300'} w-5 h-5`}
                        fill={star <= rating ? 'currentColor' : 'none'}
                    />
                ))}
            </div>
        );
    };

    // 필터링된 리뷰 목록
    const filteredReviews = getFilteredReviews();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">리뷰 관리</h1>

            {/* 요약 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiMessageSquare className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">대기 리뷰</p>
                        <p className="text-xl font-bold">
                            {reviews.filter(r => r.status === "대기").length}건
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiStar className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">평균 별점</p>
                        <p className="text-xl font-bold">
                            {reviews.length > 0 
                                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
                                : "0.0"}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FiMessageSquare className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 리뷰 수</p>
                        <p className="text-xl font-bold">
                            {reviews.length}건
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
                            <option value="승인">승인</option>
                            <option value="대기">대기</option>
                            <option value="숨김">숨김</option>
                        </select>

                        {/* 검색 입력 */}
                        <input
                            type="text"
                            placeholder="상품명, 고객명, 내용 검색"
                            className="border rounded p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 엑셀 다운로드 버튼 */}
                    <button
                        onClick={exportReviewData}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                    >
                        <FiDownload className="mr-2" /> 엑셀 다운로드
                    </button>
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">리뷰 일자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">별점</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReviews.map((review) => (
                                <React.Fragment key={review.id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{review.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{review.productName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{review.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${review.status === '승인' ? 'bg-green-100 text-green-800' :
                                                    review.status === '대기' ? 'bg-yellow-100 text-yellow-800' :
                                                        review.status === '숨김' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-gray-100 text-gray-800'}`}
                                            >
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleReviewExpand(review.id)}
                                                className="text-blue-600 hover:text-blue-900 text-sm"
                                            >
                                                자세히 보기
                                            </button>
                                        </td>
                                    </tr>
                                    {/* 리뷰 상세 내용 확장 */}
                                    {expandedReview === review.id && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="font-medium">리뷰 내용:</span>
                                                        <p className="mt-1">{review.content}</p>
                                                    </div>
                                                    {review.imageUrls.length > 0 && (
                                                        <div>
                                                            <span className="font-medium">첨부 이미지:</span>
                                                            <div className="flex space-x-2 mt-2">
                                                                {review.imageUrls.map((url, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={url}
                                                                        alt={`리뷰 이미지 ${index + 1}`}
                                                                        className="w-20 h-20 object-cover rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* 판매자 답변 섹션 */}
                                                    {replyingTo === review.id ? (
                                                        <div className="mt-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium">판매자 답변 작성:</span>
                                                                <button 
                                                                    onClick={cancelReply}
                                                                    className="text-gray-600 hover:text-gray-800"
                                                                >
                                                                    <FiX />
                                                                </button>
                                                            </div>
                                                            <RichTextEditor 
                                                                value={replyContent} 
                                                                onChange={setReplyContent} 
                                                            />
                                                            <div className="flex justify-end mt-2">
                                                                <button
                                                                    onClick={() => saveReply(review.id)}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                >
                                                                    답변 저장
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : review.sellerResponse ? (
                                                        <div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">판매자 답변:</span>
                                                                <button
                                                                    onClick={() => startReplying(review.id)}
                                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                                >
                                                                    수정
                                                                </button>
                                                            </div>
                                                            <div 
                                                                className="p-3 bg-blue-50 rounded mt-1"
                                                                dangerouslySetInnerHTML={{ __html: review.sellerResponse }}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    
                                                    {/* 액션 버튼 */}
                                                    <div className="flex space-x-2">
                                                        {!replyingTo && !review.sellerResponse && (
                                                            <button 
                                                                onClick={() => startReplying(review.id)}
                                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                                            >
                                                                답변하기
                                                            </button>
                                                        )}
                                                        
                                                        {review.status !== '승인' && (
                                                            <button 
                                                                onClick={() => changeReviewStatus(review.id, '승인')}
                                                                className="px-3 py-1 bg-green-500 text-white rounded text-sm flex items-center"
                                                            >
                                                                <FiCheck className="mr-1" /> 승인
                                                            </button>
                                                        )}
                                                        
                                                        {review.status !== '숨김' && (
                                                            <button 
                                                                onClick={() => changeReviewStatus(review.id, '숨김')}
                                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                            >
                                                                숨기기
                                                            </button>
                                                        )}
                                                        
                                                        {review.status === '숨김' && (
                                                            <button 
                                                                onClick={() => changeReviewStatus(review.id, '대기')}
                                                                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                                                            >
                                                                복원하기
                                                            </button>
                                                        )}
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
                        표시할 리뷰 정보가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}