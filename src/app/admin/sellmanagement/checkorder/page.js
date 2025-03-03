"use client";
import { useState, useEffect } from "react";
import { 
  FiCheckCircle, FiAlertCircle, FiTruck, FiFileText, 
  FiFilter, FiChevronDown, FiChevronUp, FiClipboard,
  FiInfo, FiBox, FiPrinter
} from "react-icons/fi";

export default function CheckOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  // 모바일 뷰에서 확장된 항목을 추적하기 위한 상태
  const [expandedOrders, setExpandedOrders] = useState([]);
  // 선택된 주문의 준비 방법 모달 상태
  const [preparationModalOpen, setPreparationModalOpen] = useState(false);
  const [selectedOrderForPrep, setSelectedOrderForPrep] = useState(null);

  // 예시 주문 데이터
  const mockOrders = [
    { 
      id: 1, 
      orderNumber: "ORD-20250224-001", 
      customerName: "홍길동", 
      items: [
        { 
          name: "유기농 사과 1kg", 
          quantity: 2, 
          price: 12000,
          packagingType: "과일용 포장재",
          specialNotes: "사과는 충격에 약하니 주의해서 포장해주세요."
        }, 
        { 
          name: "신선한 토마토 500g", 
          quantity: 1, 
          price: 8000,
          packagingType: "과일용 포장재",
          specialNotes: ""
        }
      ],
      phoneNumber: "010-1234-5678", 
      address: "서울시 강남구 테헤란로 123", 
      orderDate: "2025-02-24 14:30", 
      paymentMethod: "카드결제",
      status: "결제완료", 
      amount: 32000,
      shippingFee: 2500,
      totalAmount: 34500,
      isNewOrder: true,
      deliveryNotes: "문 앞에 놓아주세요",
      packagingNotes: "친환경 포장재 사용 요청"
    },
    { 
      id: 2, 
      orderNumber: "ORD-20250223-042", 
      customerName: "김철수", 
      items: [
        { 
          name: "국내산 참외 2kg", 
          quantity: 1, 
          price: 15000,
          specialNotes: "참외는 분리 포장해 주세요."
        }
      ],
      phoneNumber: "010-9876-5432", 
      address: "경기도 성남시 분당구 판교로 456", 
      orderDate: "2025-02-23 09:15", 
      paymentMethod: "무통장입금",
      status: "결제완료", 
      amount: 15000,
      shippingFee: 2500,
      totalAmount: 17500,
      isNewOrder: false,
      deliveryNotes: "",
      packagingNotes: ""
    },
    { 
      id: 3, 
      orderNumber: "ORD-20250222-088", 
      customerName: "이영희", 
      items: [
        { 
          name: "제철 딸기 500g", 
          quantity: 2, 
          price: 16000,
          packagingType: "냉장 포장재",
          specialNotes: "딸기는 상하기 쉬우니 아이스팩과 함께 포장해주세요."
        }, 
        { 
          name: "유기농 샐러드 200g", 
          quantity: 1, 
          price: 9500,
          packagingType: "냉장 포장재",
          specialNotes: "신선도 유지를 위해 냉장 포장해주세요."
        }
      ],
      phoneNumber: "010-2345-6789", 
      address: "부산시 해운대구 해운대로 789", 
      orderDate: "2025-02-22 16:45", 
      paymentMethod: "간편결제",
      status: "주문확인", 
      amount: 41500,
      shippingFee: 0,
      totalAmount: 41500,
      isNewOrder: false,
      deliveryNotes: "경비실에 맡겨주세요",
      packagingNotes: "아이스팩 추가 요청"
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
    if (filter === "all") return orders;
    if (filter === "new") return orders.filter(order => order.isNewOrder);
    return orders.filter(order => order.status === filter);
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

  const confirmOrders = () => {
    if (selectedOrders.length === 0) {
      AlertManager.success("확인할 주문을 선택해주세요.");
      return;
    }
    
    // 실제로는 API 호출 필요
    const updatedOrders = orders.map(order => {
      if (selectedOrders.includes(order.id)) {
        return { ...order, status: "주문확인", isNewOrder: false };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setSelectedOrders([]);
    AlertManager.success(`${selectedOrders.length}건의 주문이 확인되었습니다.`);
  };

  const prepareShipping = () => {
    if (selectedOrders.length === 0) {
      AlertManager.success("배송 준비할 주문을 선택해주세요.");
      return;
    }
    
    // 실제로는 API 호출 필요
    const updatedOrders = orders.map(order => {
      if (selectedOrders.includes(order.id)) {
        return { ...order, status: "배송준비" };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setSelectedOrders([]);
    AlertManager.success(`${selectedOrders.length}건의 주문이 배송 준비로 변경되었습니다.`);
  };

  // 아이템 확장/축소 토글
  const toggleOrderExpand = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  // 주문 준비 방법 모달 열기
  const openPreparationModal = (order) => {
    setSelectedOrderForPrep(order);
    setPreparationModalOpen(true);
  };

  // 주문 준비 방법 모달 닫기
  const closePreparationModal = () => {
    setPreparationModalOpen(false);
    setSelectedOrderForPrep(null);
  };

  // 피킹 리스트 인쇄
  const printPickingList = () => {
    if (selectedOrderForPrep) {
      // 실제로는 여기서 인쇄 기능 구현
      AlertManager.success("피킹 리스트가 인쇄되었습니다.");
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">주문 확인</h1>

      {/* 요약 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiFileText className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">전체 주문</p>
            <p className="text-xl font-bold">{orders.length}건</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <FiAlertCircle className="text-red-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">신규 주문</p>
            <p className="text-xl font-bold">{orders.filter(order => order.isNewOrder).length}건</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FiCheckCircle className="text-yellow-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">주문 확인</p>
            <p className="text-xl font-bold">{orders.filter(order => order.status === "주문확인").length}건</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FiTruck className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">배송 준비</p>
            <p className="text-xl font-bold">{orders.filter(order => order.status === "배송준비").length}건</p>
          </div>
        </div>
      </div>

      {/* 필터 및 액션 버튼 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <FiFilter className="text-gray-500" />
            <select
              className="border rounded p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">전체 주문</option>
              <option value="new">신규 주문</option>
              <option value="결제완료">결제완료</option>
              <option value="주문확인">주문확인</option>
              <option value="배송준비">배송준비</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={confirmOrders}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              disabled={selectedOrders.length === 0}
            >
              <FiCheckCircle className="mr-2" /> 주문 확인
            </button>
            <button
              onClick={prepareShipping}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
              disabled={selectedOrders.length === 0}
            >
              <FiTruck className="mr-2" /> 배송 준비
            </button>
          </div>
        </div>
      </div>

      {/* 주문 목록 - 데스크톱 뷰 (md 이상에서만 표시) */}
      <div className="bg-white rounded-lg shadow hidden md:block">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문정보</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문상품</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제정보</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배송정보</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-gray-50 ${order.isNewOrder ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">{order.orderNumber}</div>
                      <div className="text-sm">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                      <div className="text-sm text-gray-500">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.name} x {item.quantity} ({item.price.toLocaleString()}원)
                        </div>
                      ))}
                      <div className="text-sm font-medium mt-1">
                        총 {order.totalAmount.toLocaleString()}원
                        <span className="text-xs text-gray-500">
                          (상품 {order.amount.toLocaleString()}원 + 배송비 {order.shippingFee.toLocaleString()}원)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{order.address}</div>
                      {order.deliveryNotes && (
                        <div className="text-xs text-gray-500 mt-1">메모: {order.deliveryNotes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${order.status === '배송준비' ? 'bg-green-100 text-green-800' : 
                          order.status === '주문확인' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === '결제완료' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                      {order.isNewOrder && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(order.status === "주문확인" || order.status === "배송준비") && (
                        <button
                          onClick={() => openPreparationModal(order)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center"
                        >
                          <FiBox className="mr-1" /> 준비 방법
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            표시할 주문이 없습니다.
          </div>
        )}
      </div>

      {/* 주문 목록 - 모바일 뷰 (md 미만에서만 표시) */}
      <div className="bg-white rounded-lg shadow md:hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li 
                key={order.id} 
                className={`hover:bg-gray-50 ${order.isNewOrder ? 'bg-yellow-50' : ''}`}
              >
                <div className="p-4">
                  {/* 주문 헤더 - 항상 표시됨 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                      <div>
                        <div className="font-medium text-blue-600">{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">{order.customerName}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium mr-2
                        ${order.status === '배송준비' ? 'bg-green-100 text-green-800' : 
                          order.status === '주문확인' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === '결제완료' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                      {order.isNewOrder && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          NEW
                        </span>
                      )}
                      <button 
                        onClick={() => toggleOrderExpand(order.id)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {expandedOrders.includes(order.id) ? 
                          <FiChevronUp /> : 
                          <FiChevronDown />
                        }
                      </button>
                    </div>
                  </div>
                  
                  {/* 확장 내용 - 확장된 경우에만 표시 */}
                  {expandedOrders.includes(order.id) && (
                    <div className="mt-4 pl-8">
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-700">주문 정보</h4>
                          <p>{order.orderDate}</p>
                          <p>{order.phoneNumber}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">상품 정보</h4>
                          {order.items.map((item, idx) => (
                            <p key={idx}>
                              {item.name} x {item.quantity} ({item.price.toLocaleString()}원)
                            </p>
                          ))}
                          <p className="font-medium mt-1">
                            총 {order.totalAmount.toLocaleString()}원
                            <span className="text-xs text-gray-500 block">
                              상품 {order.amount.toLocaleString()}원 + 배송비 {order.shippingFee.toLocaleString()}원
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">결제 정보</h4>
                          <p>{order.paymentMethod}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">배송 정보</h4>
                          <p>{order.address}</p>
                          {order.deliveryNotes && (
                            <p className="text-xs text-gray-500 mt-1">메모: {order.deliveryNotes}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => {
                              handleSelectOrder(order.id);
                              confirmOrders();
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          >
                            주문 확인
                          </button>
                          <button
                            onClick={() => {
                              handleSelectOrder(order.id);
                              prepareShipping();
                            }}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          >
                            배송 준비
                          </button>
                          {(order.status === "주문확인" || order.status === "배송준비") && (
                            <button
                              onClick={() => openPreparationModal(order)}
                              className="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors flex items-center"
                            >
                              <FiBox className="mr-1" /> 준비 방법
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-500">
            표시할 주문이 없습니다.
          </div>
        )}
      </div>

      {/* 주문 준비 방법 모달 */}
      {preparationModalOpen && selectedOrderForPrep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">주문 준비 방법</h2>
                <button 
                  onClick={closePreparationModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <FiInfo className="mr-2" /> 주문 정보
                </h3>
                <div className="bg-gray-50 p-3 rounded mt-2">
                  <p><span className="font-medium">주문번호:</span> {selectedOrderForPrep.orderNumber}</p>
                  <p><span className="font-medium">고객명:</span> {selectedOrderForPrep.customerName}</p>
                  <p><span className="font-medium">주문일자:</span> {selectedOrderForPrep.orderDate}</p>
                  {selectedOrderForPrep.packagingNotes && (
                    <p className="text-red-600"><span className="font-medium">포장 요청사항:</span> {selectedOrderForPrep.packagingNotes}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 flex items-center mb-2">
                  <FiClipboard className="mr-2" /> 피킹 리스트
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrderForPrep.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <FiInfo className="mr-2" /> 특이사항
                </h3>
                <ul className="mt-2 space-y-2">
                  {selectedOrderForPrep.items.map((item, idx) => (
                    item.specialNotes ? (
                      <li key={idx} className="bg-yellow-50 p-3 rounded">
                        <span className="font-medium">{item.name}:</span> {item.specialNotes}
                      </li>
                    ) : null
                  ))}
                  {!selectedOrderForPrep.items.some(item => item.specialNotes) && (
                    <li className="text-gray-500 italic">특이사항이 없습니다.</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={printPickingList}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FiPrinter className="mr-2" /> 피킹 리스트 인쇄
                </button>
                <button
                  onClick={closePreparationModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                >
                  닫기
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}