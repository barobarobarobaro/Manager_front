"use client";
import { useState } from "react";
import { FiSearch, FiCalendar, FiDownload, FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import Link from "next/link";

export default function OrderSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchType, setSearchType] = useState("orderNumber");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // 모바일에서 검색 폼 보기/숨기기
  const [showFilters, setShowFilters] = useState(false);
  // 모바일에서 확장된 주문 항목 관리
  const [expandedOrders, setExpandedOrders] = useState([]);
  // 주문 상태 체크박스 상태 관리
  const [statusFilters, setStatusFilters] = useState({
    결제완료: false,
    주문확인: false,
    배송준비: false,
    배송중: false,
    배송완료: false,
    취소환불: false,
  });

  // 예시 검색 결과
  const mockResults = [
    { id: 1, orderNumber: "ORD-20250224-001", customerName: "홍길동", items: "유기농 사과 1kg 외 2건", orderDate: "2025-02-24", status: "배송완료", amount: 34500 },
    { id: 2, orderNumber: "ORD-20250223-042", customerName: "김철수", items: "신선한 토마토 500g 외 1건", orderDate: "2025-02-23", status: "배송중", amount: 16800 },
    { id: 3, orderNumber: "ORD-20250222-088", customerName: "이영희", items: "국내산 참외 2kg", orderDate: "2025-02-22", status: "주문확인", amount: 15000 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 실제로는 API 호출이 필요함
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsLoading(false);
      // 모바일에서는 검색 후 자동으로 필터 접기
      setShowFilters(false);
    }, 500);
  };

  const handleExport = () => {
    alert("주문 데이터가 엑셀 파일로 내보내기 되었습니다.");
  };

  // 주문 상태 필터 변경 핸들러
  const handleStatusFilterChange = (status) => {
    setStatusFilters({
      ...statusFilters,
      [status]: !statusFilters[status],
    });
  };

  // 모바일에서 주문 상세 정보 토글
  const toggleOrderExpand = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  // 주문 상태에 따른 스타일 적용
  const getStatusStyle = (status) => {
    switch (status) {
      case '배송완료':
        return 'bg-green-100 text-green-800';
      case '배송중':
        return 'bg-blue-100 text-blue-800';
      case '주문확인':
      case '배송준비':
        return 'bg-yellow-100 text-yellow-800';
      case '결제완료':
        return 'bg-purple-100 text-purple-800';
      case '취소':
      case '환불':
      case '취소/환불':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">주문 통합 검색</h1>

      {/* 모바일 필터 토글 버튼 */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-between"
        >
          <span className="flex items-center">
            <FiFilter className="mr-2" /> 검색 필터
          </span>
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {/* 검색 폼 - 모바일에서는 토글로 보이고 숨김 */}
      <div className={`bg-white p-4 rounded-lg shadow mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색 유형</label>
            <select
              className="w-full p-2 border rounded"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="orderNumber">주문번호</option>
              <option value="customerName">고객명</option>
              <option value="phoneNumber">전화번호</option>
              <option value="productName">상품명</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pl-10 border rounded"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문일자</label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  className="w-full p-2 pl-10 border rounded"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <span>~</span>
              <div className="relative flex-1">
                <input
                  type="date"
                  className="w-full p-2 pl-10 border rounded"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주문상태</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.결제완료}
                  onChange={() => handleStatusFilterChange('결제완료')}
                />
                <span className="ml-2">결제완료</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.주문확인}
                  onChange={() => handleStatusFilterChange('주문확인')}
                />
                <span className="ml-2">주문확인</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.배송준비}
                  onChange={() => handleStatusFilterChange('배송준비')}
                />
                <span className="ml-2">배송준비</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.배송중}
                  onChange={() => handleStatusFilterChange('배송중')}
                />
                <span className="ml-2">배송중</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.배송완료}
                  onChange={() => handleStatusFilterChange('배송완료')}
                />
                <span className="ml-2">배송완료</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={statusFilters.취소환불}
                  onChange={() => handleStatusFilterChange('취소환불')}
                />
                <span className="ml-2">취소/환불</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      {/* 검색 결과 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">검색 결과</h2>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
          >
            <FiDownload className="mr-2" /> 엑셀
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            {/* 데스크톱 테이블 뷰 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품정보</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문일자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제금액</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.orderDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.amount.toLocaleString()}원</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Link 
                          href={`/main/sellmanagement/searchorder/${order.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 뷰 */}
            <div className="md:hidden">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((order) => (
                  <li key={order.id} className="py-4">
                    <div 
                      className="flex justify-between items-start cursor-pointer"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div>
                        <p className="font-medium text-blue-600">{order.orderNumber}</p>
                        <p className="text-sm">{order.customerName}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        {expandedOrders.includes(order.id) ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                    
                    {expandedOrders.includes(order.id) && (
                      <div className="mt-3 pl-1 border-l-2 border-gray-200 space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-500">주문일자:</span> {order.orderDate}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">상품정보:</span> {order.items}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">결제금액:</span> {order.amount.toLocaleString()}원
                        </p>
                        <div className="pt-2">
                          <Link 
                            href={`/main/sellmanagement/searchorder/${order.id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm inline-block"
                          >
                            상세보기
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}