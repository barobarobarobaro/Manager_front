"use client";
import { useState, useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiTruck, FiFileText, FiFilter } from "react-icons/fi";

export default function CheckOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);

  // 예시 주문 데이터
  const mockOrders = [
    { 
      id: 1, 
      orderNumber: "ORD-20250224-001", 
      customerName: "홍길동", 
      items: [{ name: "유기농 사과 1kg", quantity: 2, price: 12000 }, { name: "신선한 토마토 500g", quantity: 1, price: 8000 }],
      phoneNumber: "010-1234-5678", 
      address: "서울시 강남구 테헤란로 123", 
      orderDate: "2025-02-24 14:30", 
      paymentMethod: "카드결제",
      status: "결제완료", 
      amount: 32000,
      shippingFee: 2500,
      totalAmount: 34500,
      isNewOrder: true
    },
    { 
      id: 2, 
      orderNumber: "ORD-20250223-042", 
      customerName: "김철수", 
      items: [{ name: "국내산 참외 2kg", quantity: 1, price: 15000 }],
      phoneNumber: "010-9876-5432", 
      address: "경기도 성남시 분당구 판교로 456", 
      orderDate: "2025-02-23 09:15", 
      paymentMethod: "무통장입금",
      status: "결제완료", 
      amount: 15000,
      shippingFee: 2500,
      totalAmount: 17500,
      isNewOrder: false
    },
    { 
      id: 3, 
      orderNumber: "ORD-20250222-088", 
      customerName: "이영희", 
      items: [{ name: "제철 딸기 500g", quantity: 2, price: 16000 }, { name: "유기농 샐러드 200g", quantity: 1, price: 9500 }],
      phoneNumber: "010-2345-6789", 
      address: "부산시 해운대구 해운대로 789", 
      orderDate: "2025-02-22 16:45", 
      paymentMethod: "간편결제",
      status: "주문확인", 
      amount: 41500,
      shippingFee: 0,
      totalAmount: 41500,
      isNewOrder: false
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
      alert("확인할 주문을 선택해주세요.");
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
    alert(`${selectedOrders.length}건의 주문이 확인되었습니다.`);
  };

  const prepareShipping = () => {
    if (selectedOrders.length === 0) {
      alert("배송 준비할 주문을 선택해주세요.");
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
    alert(`${selectedOrders.length}건의 주문이 배송 준비로 변경되었습니다.`);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">주문 확인</h1>

      {/* 요약 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

      {/* 주문 목록 */}
      <div className="bg-white rounded-lg shadow">
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
    </div>
  );
}