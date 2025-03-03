"use client";
import React, { useState, useEffect } from "react";
import { 
  FiTruck, FiPackage, FiCheckCircle, FiFilter, 
  FiPrinter, FiDownload, FiChevronDown, FiChevronUp, 
  FiMoreVertical, FiSearch
} from "react-icons/fi";
import TableHeaderWithHelp from "@/components/table/ProductTableHeader";
import Pagination from "@/components/common/Pagination";

export default function ManageShippingPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    // 모바일 관련 상태
    const [showFilters, setShowFilters] = useState(false);
    const [mobileActionMenu, setMobileActionMenu] = useState(null);

    // 예시 주문 데이터
    const mockOrders = [
        {
            id: 1,
            orderNumber: "ORD-20250223-042",
            customerName: "김철수",
            items: [
                { id: 101, name: "유기농 사과 1kg", quantity: 2, price: 12000 },
                { id: 102, name: "신선한 토마토 500g", quantity: 1, price: 8000 }
            ],
            phoneNumber: "010-9876-5432",
            address: "경기도 성남시 분당구 판교로 456",
            orderDate: "2025-02-23",
            shippingStatus: "배송준비",
            trackingNumber: "",
            shippingCompany: "",
            totalAmount: 32000,
            shippingFee: 2500,
            deliveryMessage: "문 앞에 놓아주세요.",
            recipientName: "김철수",
            recipientPhone: "010-9876-5432"
        },
        {
            id: 2,
            orderNumber: "ORD-20250222-088",
            customerName: "이영희",
            items: [
                { id: 201, name: "국내산 참외 2kg", quantity: 1, price: 15000 },
                { id: 202, name: "제철 딸기 500g", quantity: 2, price: 16000 }
            ],
            phoneNumber: "010-2345-6789",
            address: "부산시 해운대구 해운대로 789",
            orderDate: "2025-02-22",
            shippingStatus: "배송준비",
            trackingNumber: "",
            shippingCompany: "",
            totalAmount: 47000,
            shippingFee: 2500,
            deliveryMessage: "경비실에 맡겨주세요.",
            recipientName: "이영희",
            recipientPhone: "010-2345-6789"
        },
        {
            id: 3,
            orderNumber: "ORD-20250221-156",
            customerName: "박민준",
            items: [
                { id: 301, name: "유기농 양파 3kg", quantity: 1, price: 6000 },
                { id: 302, name: "껍질 얇은 감자 2kg", quantity: 1, price: 7800 }
            ],
            phoneNumber: "010-3456-7890",
            address: "서울시 강남구 역삼로 123",
            orderDate: "2025-02-21",
            shippingStatus: "배송중",
            trackingNumber: "1234567890",
            shippingCompany: "우체국택배",
            totalAmount: 13800,
            shippingFee: 2500,
            deliveryMessage: "",
            recipientName: "박민준",
            recipientPhone: "010-3456-7890"
        },
        {
            id: 4,
            orderNumber: "ORD-20250220-212",
            customerName: "최지우",
            items: [
                { id: 401, name: "제철 무 1개", quantity: 2, price: 5200 },
                { id: 402, name: "아삭한 오이 10개 묶음", quantity: 1, price: 4800 }
            ],
            phoneNumber: "010-4567-8901",
            address: "인천시 서구 서곶로 456",
            orderDate: "2025-02-20",
            shippingStatus: "배송완료",
            trackingNumber: "9876543210",
            shippingCompany: "CJ대한통운",
            totalAmount: 15200,
            shippingFee: 2500,
            deliveryMessage: "벨 누르지 말고 문자 주세요.",
            recipientName: "최지우",
            recipientPhone: "010-4567-8901"
        }
    ];
    useEffect(() => {
        // 실제로는 API 호출
        setTimeout(() => {
            setOrders(mockOrders);
            setLoading(false);
        }, 500);
    }, []);

    const getFilteredOrders = () => {
        let filtered = orders;

        // 상태 필터 적용
        if (filter !== "all") {
            filtered = filtered.filter(order => order.shippingStatus === filter);
        }

        // 검색어 필터 적용
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    };

    const handleSelectOrder = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(getFilteredOrders().map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleShipOrders = () => {
        if (selectedOrders.length === 0) {
            AlertManager.info("발송할 주문을 선택해주세요.");
            return;
        }

        // 배송준비 상태가 아닌 주문이 있는지 확인
        const invalidOrders = selectedOrders.filter(id => {
            const order = orders.find(o => o.id === id);
            return order.shippingStatus !== "배송준비";
        });

        if (invalidOrders.length > 0) {
            AlertManager.info("배송준비 상태인 주문만 발송할 수 있습니다.");
            return;
        }

        // 실제로는 송장번호 입력 모달 등이 필요함
        const shippingCompany = prompt("택배사를 입력하세요:", "우체국택배");
        if (!shippingCompany) return;

        const trackingNumber = prompt("송장번호를 입력하세요:");
        if (!trackingNumber) return;

        // 선택된 주문 업데이트
        const updatedOrders = orders.map(order => {
            if (selectedOrders.includes(order.id)) {
                return {
                    ...order,
                    shippingStatus: "배송중",
                    shippingCompany,
                    trackingNumber
                };
            }
            return order;
        });

        setOrders(updatedOrders);
        setSelectedOrders([]);
        setMobileActionMenu(null); // 모바일 액션 메뉴 닫기
        AlertManager.info(`${selectedOrders.length}건의 주문이 발송 처리되었습니다.`);
    };

    const handleCompleteShipping = () => {
        if (selectedOrders.length === 0) {
            AlertManager.info("배송 완료 처리할 주문을 선택해주세요.");
            return;
        }

        // 배송중 상태가 아닌 주문이 있는지 확인
        const invalidOrders = selectedOrders.filter(id => {
            const order = orders.find(o => o.id === id);
            return order.shippingStatus !== "배송중";
        });

        if (invalidOrders.length > 0) {
            AlertManager.info("배송중 상태인 주문만 배송 완료 처리할 수 있습니다.");
            return;
        }

        // 선택된 주문 업데이트
        const updatedOrders = orders.map(order => {
            if (selectedOrders.includes(order.id)) {
                return {
                    ...order,
                    shippingStatus: "배송완료"
                };
            }
            return order;
        });

        setOrders(updatedOrders);
        setSelectedOrders([]);
        setMobileActionMenu(null); // 모바일 액션 메뉴 닫기
        AlertManager.info(`${selectedOrders.length}건의 주문이 배송 완료 처리되었습니다.`);
    };

    const printShippingLabels = () => {
        if (selectedOrders.length === 0) {
            AlertManager.info("송장을 출력할 주문을 선택해주세요.");
            return;
        }

        AlertManager.info(`${selectedOrders.length}건의 송장을 출력합니다.`);
        setMobileActionMenu(null); // 모바일 액션 메뉴 닫기
        // 실제로는 인쇄 API 호출 필요
    };

    const exportShippingData = () => {
        AlertManager.info("배송 데이터를 엑셀 파일로 내보냅니다.");
        // 실제로는 엑셀 다운로드 API 호출 필요
    };

    const toggleExpandOrder = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    // 모바일 액션 메뉴 토글
    const toggleMobileActionMenu = (orderId) => {
        if (mobileActionMenu === orderId) {
            setMobileActionMenu(null);
        } else {
            setMobileActionMenu(orderId);
        }
    };

    // 주문 상태에 따른 스타일 클래스 반환
    const getStatusClass = (status) => {
        switch (status) {
            case '배송완료':
                return 'bg-green-100 text-green-800';
            case '배송중':
                return 'bg-blue-100 text-blue-800';
            case '배송준비':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = getFilteredOrders();
    // 테이블 헤더 도움말 텍스트
    const helpTexts = {
        order: "주문번호, 고객명, 주문일자 및 주문 상품 정보입니다.",
        address: "상품을 배송할 수령인 정보와 배송지 주소입니다.",
        shipping: "택배사 및 송장번호 정보입니다. 배송 조회 링크를 제공합니다.",
        status: "현재 배송 진행 상태를 표시합니다.\n배송대기: 송장 출력 후 배송을 기다리고 있습니다.\n배송 중: 택배사에 인계되어 배송 중입니다.\n배송 완료: 고객에게 배송이 완료되었습니다.",
        action: "각 주문에 대해 수행할 수 있는 작업입니다."
    };
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">배송 현황 관리</h1>

            {/* 요약 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                        <FiPackage className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">배송 준비</p>
                        <p className="text-xl font-bold">{orders.filter(order => order.shippingStatus === "배송준비").length}건</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FiTruck className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">배송중</p>
                        <p className="text-xl font-bold">{orders.filter(order => order.shippingStatus === "배송중").length}건</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FiCheckCircle className="text-green-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">배송 완료</p>
                        <p className="text-xl font-bold">{orders.filter(order => order.shippingStatus === "배송완료").length}건</p>
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

            {/* 검색 및 필터링 */}
            <div className={`bg-white p-4 rounded-lg shadow mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-col w-full md:w-auto md:flex-row flex-wrap gap-2 items-start md:items-center">
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <FiFilter className="text-gray-500" />
                            <select
                                className="border rounded p-2 w-full md:w-auto"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">전체 보기</option>
                                <option value="배송준비">배송 준비</option>
                                <option value="배송중">배송중</option>
                                <option value="배송완료">배송 완료</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="주문번호, 고객명, 주소 검색"
                                className="border rounded p-2 pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {/* 모바일용 단축 버튼 */}
                        <div className="md:hidden grid grid-cols-2 gap-2 w-full">
                            <button
                                onClick={handleShipOrders}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                                disabled={selectedOrders.length === 0}
                            >
                                <FiTruck className="mr-2" /> 배송 시작
                            </button>
                            <button
                                onClick={handleCompleteShipping}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                                disabled={selectedOrders.length === 0}
                            >
                                <FiCheckCircle className="mr-2" /> 배송 완료
                            </button>
                            
                            <button
                                onClick={exportShippingData}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                <FiDownload className="mr-2" /> 엑셀
                            </button>
                        </div>

                        {/* 데스크톱용 버튼 */}
                        <div className="hidden md:flex flex-wrap gap-2">
                            <button
                                onClick={handleShipOrders}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                                disabled={selectedOrders.length === 0}
                            >
                                <FiTruck className="mr-2" /> 배송 시작
                            </button>
                            <button
                                onClick={handleCompleteShipping}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
                                disabled={selectedOrders.length === 0}
                            >
                                <FiCheckCircle className="mr-2" /> 배송 완료
                            </button>
                            
                            <button
                                onClick={exportShippingData}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                            >
                                <FiDownload className="mr-2" /> 엑셀 다운로드
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 배송 목록 */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <>
                        {/* 데스크톱 테이블 뷰 */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                            />
                                        </th>
                                        <TableHeaderWithHelp title="주문정보" helpText={helpTexts.order} />
                                        <TableHeaderWithHelp title="배송지" helpText={helpTexts.address} />
                                        <TableHeaderWithHelp title="배송정보" helpText={helpTexts.shipping} />
                                        <TableHeaderWithHelp title="배송상태" helpText={helpTexts.status} />
                                        <TableHeaderWithHelp title="액션" helpText={helpTexts.action} />
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <tr className={`hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.includes(order.id)}
                                                        onChange={() => handleSelectOrder(order.id)}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm font-medium text-blue-600">{order.orderNumber}</div>
                                                    <div className="text-sm">{order.customerName}</div>
                                                    <div className="text-sm text-gray-500">{order.orderDate}</div>
                                                    <div className="text-sm">{order.items.length}개 상품</div>
                                                    <button
                                                        className="text-xs text-blue-500 hover:underline mt-1"
                                                        onClick={() => toggleExpandOrder(order.id)}
                                                    >
                                                        {expandedOrder === order.id ? '상품 접기' : '상품 보기'}
                                                    </button>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm font-medium">{order.recipientName}</div>
                                                    <div className="text-sm">{order.recipientPhone}</div>
                                                    <div className="text-sm">{order.address}</div>
                                                    {order.deliveryMessage && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            <span className="font-medium">배송메시지:</span> {order.deliveryMessage}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {order.shippingStatus !== "배송준비" ? (
                                                        <>
                                                            <div className="text-sm">{order.shippingCompany}</div>
                                                            <div className="text-sm font-medium">{order.trackingNumber}</div>
                                                            {order.trackingNumber && (
                                                                <a
                                                                    href="#"
                                                                    className="text-xs text-blue-500 hover:underline"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        AlertManager.info(`${order.trackingNumber} 배송조회 페이지로 이동합니다.`);
                                                                    }}
                                                                >
                                                                    배송조회
                                                                </a>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">미발송</span>
                                                    )}
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.shippingStatus)}`}>
                                                        {order.shippingStatus}
                                                    </span>
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                    {order.shippingStatus === "배송준비" && (
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                                            onClick={() => {
                                                                setSelectedOrders([order.id]);
                                                                handleShipOrders();
                                                            }}
                                                        >
                                                            발송처리
                                                        </button>
                                                    )}
                                                    {order.shippingStatus === "배송중" && (
                                                        <button
                                                            className="text-green-600 hover:text-green-900 text-sm"
                                                            onClick={() => {
                                                                setSelectedOrders([order.id]);
                                                                handleCompleteShipping();
                                                            }}
                                                        >
                                                            완료처리
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {expandedOrder === order.id && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan="6" className="px-6 py-4">
                                                        <div className="text-sm font-medium mb-2">주문 상품 목록</div>
                                                        <div className="space-y-2">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between">
                                                                    <span>{item.name} x {item.quantity}</span>
                                                                    <span>{(item.price * item.quantity).toLocaleString()}원</span>
                                                                </div>
                                                            ))}
                                                            <div className="border-t pt-2 flex justify-between font-medium">
                                                                <span>총 상품금액</span>
                                                                <span>{order.totalAmount.toLocaleString()}원</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 모바일 카드 뷰 */}
                        <div className="md:hidden">
                            <ul className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <li key={order.id} className={`p-4 ${selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}`}>
                                        {/* 주문 헤더 영역 */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-3"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => handleSelectOrder(order.id)}
                                                />
                                                <div>
                                                    <div className="font-medium text-blue-600">{order.orderNumber}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getStatusClass(order.shippingStatus)}`}>
                                                    {order.shippingStatus}
                                                </span>
                                                <button
                                                    onClick={() => toggleMobileActionMenu(order.id)}
                                                    className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                                                >
                                                    <FiMoreVertical />
                                                </button>
                                            </div>
                                        </div>

                                        {/* 주문 기본 정보 */}
                                        <div className="ml-8 mb-2">
                                            <div className="text-sm">{order.customerName}</div>
                                            <div className="text-sm text-gray-500">{order.orderDate}</div>
                                            <div className="text-sm mb-1">{order.items.length}개 상품</div>
                                            
                                            {/* 토글 가능한 상세 정보 버튼 */}
                                            <button
                                                className="text-xs text-blue-500 hover:underline"
                                                onClick={() => toggleExpandOrder(order.id)}
                                            >
                                                {expandedOrder === order.id ? '상세정보 접기' : '상세정보 보기'}
                                            </button>
                                        </div>

                                        {/* 확장된 상세 정보 */}
                                        {expandedOrder === order.id && (
                                            <div className="ml-8 mt-3 border-t border-gray-100 pt-3 space-y-4">
                                                {/* 수령인 정보 */}
                                                <div>
                                                    <h4 className="text-sm font-medium">수령인 정보</h4>
                                                    <p className="text-sm mt-1">{order.recipientName}</p>
                                                    <p className="text-sm">{order.recipientPhone}</p>
                                                    <p className="text-sm">{order.address}</p>
                                                    {order.deliveryMessage && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            <span className="font-medium">배송메시지:</span> {order.deliveryMessage}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* 배송 정보 */}
                                                <div>
                                                    <h4 className="text-sm font-medium">배송 정보</h4>
                                                    {order.shippingStatus !== "배송준비" ? (
                                                        <div className="mt-1">
                                                            <p className="text-sm">{order.shippingCompany}</p>
                                                            <p className="text-sm font-medium">{order.trackingNumber}</p>
                                                            {order.trackingNumber && (
                                                                <a
                                                                    href="#"
                                                                    className="text-xs text-blue-500 hover:underline"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        AlertManager.info(`${order.trackingNumber} 배송조회 페이지로 이동합니다.`);
                                                                    }}
                                                                >
                                                                    배송조회
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 mt-1">미발송</p>
                                                    )}
                                                </div>

                                                {/* 주문 상품 목록 */}
                                                <div>
                                                    <h4 className="text-sm font-medium">주문 상품 목록</h4>
                                                    <div className="space-y-2 mt-1">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span>{item.name} x {item.quantity}</span>
                                                                <span>{(item.price * item.quantity).toLocaleString()}원</span>
                                                            </div>
                                                        ))}
                                                        <div className="border-t pt-2 flex justify-between font-medium text-sm">
                                                            <span>총 상품금액</span>
                                                            <span>{order.totalAmount.toLocaleString()}원</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 모바일 액션 메뉴 */}
                                        {mobileActionMenu === order.id && (
                                            <div className="mt-3 ml-8 border-t border-gray-100 pt-3 grid grid-cols-2 gap-2">
                                                {order.shippingStatus === "배송준비" && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrders([order.id]);
                                                            handleShipOrders();
                                                        }}
                                                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded flex items-center justify-center"
                                                    >
                                                        <FiTruck className="mr-1" /> 발송처리
                                                    </button>
                                                )}
                                                {order.shippingStatus === "배송중" && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrders([order.id]);
                                                            handleCompleteShipping();
                                                        }}
                                                        className="px-3 py-2 bg-green-500 text-white text-sm rounded flex items-center justify-center"
                                                    >
                                                        <FiCheckCircle className="mr-1" /> 완료처리
                                                    </button>
                                                )}
                                                
                                                <button
                                                    onClick={() => toggleMobileActionMenu(null)}
                                                    className="px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded flex items-center justify-center"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        표시할 배송 정보가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}