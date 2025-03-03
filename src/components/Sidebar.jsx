"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import userService from "@/services/adminService";

function CollapsibleNavSection({ title, children }) {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(!open);

    return (
        <div>
            <button
                onClick={toggleOpen}
                className="w-full flex justify-between items-center px-6 py-2 hover:bg-gray-700 text-left"
            >
                <span>{title}</span>
                <span>
                    {open ? (
                        // 아래 화살표 (열림)
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    ) : (
                        // 오른쪽 화살표 (닫힘)
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            ></path>
                        </svg>
                    )}
                </span>
            </button>
            {open && <ul>{children}</ul>}
        </div>
    );
}

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 사용자 정보 로드
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await userService.getCurrentUserID();
                setUser(response.data);
            } catch (error) {
                console.error("사용자 정보 로드 실패:", error);
                setError("사용자 정보를 불러오는데 실패했습니다");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // 프로필 이미지 렌더링 함수
    const renderProfileImage = () => {
        if (loading) {
            // 로딩 중 표시
            return (
                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
            );
        }

        if (error || !user) {
            // 오류 또는 사용자 정보가 없을 때 기본 이미지
            return (
                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center text-3xl">
                    👤
                </div>
            );
        }

        // 사용자 프로필 이미지 표시
        return (
            <img
                src={user.profileImage || "/images/profile.jpeg"}
                alt="프로필 사진"
                className="w-32 h-32 rounded-full mb-2 object-cover"
            />
        );
    };

    return (
        <div className="h-full top-0 left-0 h-full w-64 bg-gray-800 text-white">
            <div className="p-6 flex flex-col items-center">
                {/* 프로필 영역 */}
                {renderProfileImage()}

                <h2 className="text-2xl font-bold mb-1">
                    {loading ? "로딩 중..." : user?.businessName || user?.name || "이름 없음"}
                </h2>
                <p>
                    {loading ? "로딩 중..." : user?.name || "카테고리 없음"}
                </p>

                {!loading && user && (
                    <div className="text-center">
                        <span className="text-sm text-gray-300 block mb-1">{user.email}</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">판매자</span>
                    </div>
                )}

                <span className="text-sm text-gray-300 mt-3">
                    <Link href="/admin/profile" className="hover:text-white hover:underline">프로필 수정</Link>
                </span>
            </div>

            <nav className="flex-grow mt-4">
                <hr className="my-2 border-gray-600" />
                <CollapsibleNavSection title="메인">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/main/dashboard">대시보드</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/main/storeinfo">스토어 정보</Link>
                    </li>
                    {/* <li className="px-6 py-2 hover:bg-gray-700">상품 일괄등록</li> */}
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />
                <CollapsibleNavSection title="상품 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/product/list">상품 조회 / 수정</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/product/add">상품 등록</Link>
                    </li>
                    {/* <li className="px-6 py-2 hover:bg-gray-700">상품 일괄등록</li> */}
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="판매 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/sellmanagement/searchorder">주문 통합 검색</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/sellmanagement/checkorder">주문 확인</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/sellmanagement/manageshipping">배송 현황 관리</Link>
                    </li>
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="정산 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/settlement/content">정산 내역</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/settlement/taxbill">세금계산서 발급 및 조회</Link>
                    </li>
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="고객 응대">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/customerservice/qna">문의 관리</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/customerservice/review">리뷰 관리</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/admin/customerservice/notice">공지사항 관리</Link>
                    </li>
                </CollapsibleNavSection>
            </nav>
        </div>
    );
}