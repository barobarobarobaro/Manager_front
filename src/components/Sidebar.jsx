"use client";
import { useState } from "react";
import Link from "next/link";
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
    return (
        <div className="h-full top-0 left-0 h-full w-64 bg-gray-800 text-white">
            <div className="p-6 flex flex-col items-center">
                {/* 프로필 영역 */}
                <img
                    src="/images/profile.jpeg"
                    alt="프로필 사진"
                    className="w-32 h-32 rounded-full mb-2"
                />
                <h2 className="text-2xl font-bold mb-1">화정 팜</h2>
                <span className="text-sm text-gray-300">
                    <Link href="/main/profile">프로필 수정</Link>
                </span>
            </div>

            <nav className="flex-grow mt-4">
                <ul>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main">메인으로</Link>
                    </li>
                </ul>
                <hr className="my-2 border-gray-600" />
                <CollapsibleNavSection title="상품 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/product/list">상품 조회 / 수정</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/product/add">상품 등록</Link>
                    </li>
                    {/* <li className="px-6 py-2 hover:bg-gray-700">상품 일괄등록</li> */}
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="판매 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/sellmanagement/searchorder">주문 통합 검색</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/sellmanagement/checkorder">주문 확인</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/sellmanagement/manageshipping">배송 현황 관리</Link>
                    </li>
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="정산 관리">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/settlement/content">정산 내역</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/settlement/taxbill">세금계산서 발급 및 조회</Link>
                    </li>
                </CollapsibleNavSection>
                <hr className="my-2 border-gray-600" />

                <CollapsibleNavSection title="고객 응대">
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/customerservice/qna">문의 관리</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/customerservice/review">리뷰 관리</Link>
                    </li>
                    <li className="px-6 py-2 hover:bg-gray-700">
                        <Link href="/main/customerservice/notice">공지사항 관리</Link>
                    </li>
                </CollapsibleNavSection>
            </nav>
        </div>
    );
}


