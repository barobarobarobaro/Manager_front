"use client";
import React, { useState, useEffect } from "react";
import { FiMessageSquare, FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiDownload } from "react-icons/fi";

export default function NoticeManagementPage() {
    // 공지사항 상태 및 로딩 상태 관리를 위한 상태 변수
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedNotice, setExpandedNotice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState(null);

    // 모의 공지사항 데이터 (실제 애플리케이션에서는 API에서 가져올 데이터)
    const mockNotices = [
        {
            id: 1,
            title: "설 연휴 배송 안내",
            content: "설 연휴 기간 동안 배송이 지연될 수 있습니다. 고객 여러분의 양해 부탁드립니다.",
            type: "배송",
            isImportant: true,
            author: "관리자",
            createdAt: "2025-02-23",
            views: 1250
        },
        {
            id: 2,
            title: "신규 상품 할인 이벤트",
            content: "봄맞이 신규 상품 최대 50% 할인 이벤트를 진행합니다. 다양한 상품을 저렴하게 만나보세요!",
            type: "이벤트",
            isImportant: false,
            author: "마케팅팀",
            createdAt: "2025-02-22",
            views: 890
        },
        {
            id: 3,
            title: "서비스 점검 안내",
            content: "시스템 점검으로 인해 2025년 3월 1일 오전 2시부터 4시까지 서비스가 일시 중단될 예정입니다.",
            type: "시스템",
            isImportant: true,
            author: "기술팀",
            createdAt: "2025-02-21",
            views: 456
        }
    ];

    // 컴포넌트 마운트 시 데이터 로딩 (API 호출 시뮬레이션)
    useEffect(() => {
        setTimeout(() => {
            setNotices(mockNotices);
            setLoading(false);
        }, 500);
    }, []);

    // 공지사항 필터링 함수
    const getFilteredNotices = () => {
        let filtered = notices;

        // 중요 공지 필터링
        if (filter !== "all") {
            filtered = filtered.filter(notice =>
                filter === "important" ? notice.isImportant : notice.type === filter
            );
        }

        // 검색어 필터링
        if (searchTerm) {
            filtered = filtered.filter(notice =>
                notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notice.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    // 공지사항 상세 내용 토글 함수
    const toggleNoticeExpand = (noticeId) => {
        setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
    };

    // 공지사항 추가/수정 모달 열기 함수
    const openNoticeModal = (notice = null) => {
        setCurrentNotice(notice);
        setIsModalOpen(true);
    };

    // 공지사항 삭제 함수
    const deleteNotice = (noticeId) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            setNotices(notices.filter(notice => notice.id !== noticeId));
        }
    };

    // 엑셀 다운로드 함수
    const exportNoticeData = () => {
        alert("공지사항 데이터를 엑셀 파일로 내보냅니다.");
        // 실제 엑셀 다운로드 API 호출 로직 필요
    };

    // 공지사항 저장 함수 (모달에서 호출)
    const saveNotice = (noticeData) => {
        if (currentNotice) {
            // 기존 공지사항 수정
            setNotices(notices.map(notice =>
                notice.id === currentNotice.id ? { ...noticeData, id: currentNotice.id } : notice
            ));
        } else {
            // 새 공지사항 추가
            const newNotice = {
                ...noticeData,
                id: notices.length + 1,
                createdAt: new Date().toISOString().split('T')[0],
                views: 0,
                author: "관리자" // 현재 로그인한 관리자 이름으로 변경 가능
            };
            setNotices([...notices, newNotice]);
        }
        setIsModalOpen(false);
        setCurrentNotice(null);
    };

    // 필터링된 공지사항 목록
    const filteredNotices = getFilteredNotices();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">공지사항 관리</h1>

            {/* 요약 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiMessageSquare className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 공지사항</p>
                        <p className="text-xl font-bold">{notices.length}건</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-red-100 p-3 mr-4">
                        <FiMessageSquare className="text-red-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">중요 공지</p>
                        <p className="text-xl font-bold">
                            {notices.filter(n => n.isImportant).length}건
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiEye className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">총 조회수</p>
                        <p className="text-xl font-bold">
                            {notices.reduce((sum, n) => sum + n.views, 0).toLocaleString()}회
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
                            <option value="important">중요 공지</option>
                            <option value="배송">배송</option>
                            <option value="이벤트">이벤트</option>
                            <option value="시스템">시스템</option>
                        </select>

                        {/* 검색 입력 */}
                        <input
                            type="text"
                            placeholder="제목, 내용, 작성자 검색"
                            className="border rounded p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2">
                        {/* 엑셀 다운로드 버튼 */}
                        <button
                            onClick={exportNoticeData}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                        >
                            <FiDownload className="mr-2" /> 엑셀 다운로드
                        </button>

                        {/* 공지사항 추가 버튼 */}
                        <button
                            onClick={() => openNoticeModal()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <FiPlus className="mr-2" /> 공지사항 작성
                        </button>
                    </div>
                </div>
            </div>

            {/* 공지사항 목록 */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredNotices.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredNotices.map((notice) => (
                                <React.Fragment key={notice.id}>
                                    <tr className={`hover:bg-gray-50 ${notice.isImportant ? 'bg-red-50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleNoticeExpand(notice.id)}
                                                className={`text-left ${notice.isImportant ? 'font-bold text-red-600' : 'text-blue-600'} hover:underline`}
                                            >
                                                {notice.isImportant && '🔥 '}
                                                {notice.title}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${notice.type === '배송' ? 'bg-blue-100 text-blue-800' :
                                                    notice.type === '이벤트' ? 'bg-green-100 text-green-800' :
                                                        notice.type === '시스템' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-gray-100 text-gray-800'}`}
                                            >
                                                {notice.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{notice.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{notice.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{notice.views.toLocaleString()}회</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                            <button
                                                onClick={() => openNoticeModal(notice)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteNotice(notice.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                    {/* 공지사항 상세 내용 확장 */}
                                    {expandedNotice === notice.id && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="font-medium">공지 내용:</span>
                                                        <p>{notice.content}</p>
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
                        표시할 공지사항이 없습니다.
                    </div>
                )}
            </div>

            {/* 공지사항 작성/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {currentNotice ? '공지사항 수정' : '공지사항 작성'}
                        </h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            saveNotice({
                                title: formData.get('title'),
                                content: formData.get('content'),
                                type: formData.get('type'),
                                isImportant: formData.get('isImportant') === 'on'
                            });
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={currentNotice?.title || ''}
                                    required
                                    className="w-full border rounded p-2"
                                    placeholder="공지사항 제목을 입력하세요"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                                <textarea
                                    name="content"
                                    rows="4"
                                    required
                                    defaultValue={currentNotice?.content || ''}
                                    className="w-full border rounded p-2"
                                    placeholder="공지사항 내용을 입력하세요"
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">분류</label>
                                <select
                                    name="type"
                                    defaultValue={currentNotice?.type || '배송'}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="배송">배송</option>
                                    <option value="이벤트">이벤트</option>
                                    <option value="시스템">시스템</option>
                                </select>
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    name="isImportant"
                                    defaultChecked={currentNotice?.isImportant || false}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-700">중요 공지로 표시</label>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}