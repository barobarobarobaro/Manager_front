import mockData from '@/datas/mockData/index';

// 로컬 스토리지 키 정의
const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_ID: 'user_id',
  USER_DATA: 'user_data'
};

// 초기 데이터 로드 (로컬 스토리지 또는 mock)
const getInitialData = () => {
  if (typeof window === 'undefined') return mockData; // SSR 대비
  const storedData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return storedData ? JSON.parse(storedData) : mockData;
};

// 데이터 저장
const saveData = (data) => {
  if (typeof window === 'undefined') return; // SSR 대비
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
};

// 현재 사용자 ID 가져오기
const getCurrentUserID = () => {
  if (typeof window === 'undefined') return '1'; // 기본값
  return localStorage.getItem(STORAGE_KEYS.USER_ID) || '1';
};

// 이벤트 발생 헬퍼 함수
const triggerEvent = (eventName) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(eventName));
};

// 판매자의 가게 정보 등록을 위한 함수
const registerStore = async (userId, storeData) => {
  try {
    console.debug("가게 정보 등록 시작:", storeData);
    const data = getInitialData();

    // 사용자 확인
    const user = data.users.find(u => u.id === userId);
    if (!user) {
      console.debug("사용자를 찾을 수 없음:", userId);
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 사용자 역할 확인 (판매자만 가게 등록 가능)
    const userRole = data.user_roles.find(ur => ur.user_id === userId);
    if (!userRole || userRole.role !== "seller") {
      console.debug("판매자 권한이 없음:", userRole);
      throw new Error('판매자만 가게를 등록할 수 있습니다.');
    }

    // 새 가게 객체 생성
    const newStore = {
      id: String(data.stores ? data.stores.length + 1 : 1),
      owner_id: userId,
      name: storeData.storeName,
      description: storeData.storeDescription || '',
      phone: storeData.storePhone,
      address: storeData.storeAddress,
      category_id: storeData.categoryId,
      business_hours: storeData.businessHours || '',
      delivery_info: storeData.deliveryInfo || '',
      bank_info: {
        bank_name: storeData.bankName,
        account_number: storeData.accountNumber,
        account_holder: storeData.accountHolder
      },
      created_at: new Date().toISOString(),
      status: 'active'
    };

    console.debug("생성된 새 가게 객체:", newStore);

    // 데이터 업데이트 (새 가게 정보 추가)
    const updatedData = {
      ...data,
      stores: [...(data.stores || []), newStore]
    };

    saveData(updatedData);
    console.debug("가게 정보 저장 완료. updatedData:", updatedData);

    return {
      success: true,
      message: '가게 정보가 등록되었습니다.',
      store: { id: newStore.id, name: newStore.name }
    };
  } catch (error) {
    console.error('가게 등록 오류:', error);
    return { success: false, message: error.message };
  }
};

// 가게 정보 수정
const updateStore = async (storeId, storeData) => {
  try {
    console.debug("가게 정보 수정 시작:", storeData);
    const data = getInitialData();
    
    // 가게 찾기
    const storeIndex = data.stores.findIndex(s => s.id === storeId);
    if (storeIndex === -1) {
      throw new Error('가게를 찾을 수 없습니다.');
    }
    
    // 권한 확인 (가게 소유자 또는 관리자만 수정 가능)
    const userId = getCurrentUserID();
    const store = data.stores[storeIndex];
    
    if (store.owner_id !== userId) {
      const userRole = data.user_roles.find(ur => ur.user_id === userId);
      if (!userRole || userRole.role !== "admin") {
        throw new Error('가게 정보를 수정할 권한이 없습니다.');
      }
    }
    
    // 업데이트할 가게 정보
    const updatedStore = {
      ...store,
      name: storeData.storeName || store.name,
      description: storeData.storeDescription || store.description,
      phone: storeData.storePhone || store.phone,
      address: storeData.storeAddress || store.address,
      category_id: storeData.categoryId || store.category_id,
      business_hours: storeData.businessHours || store.business_hours,
      delivery_info: storeData.deliveryInfo || store.delivery_info,
      updated_at: new Date().toISOString()
    };
    
    // 은행 정보가 제공된 경우 업데이트
    if (storeData.bankName || storeData.accountNumber || storeData.accountHolder) {
      updatedStore.bank_info = {
        bank_name: storeData.bankName || store.bank_info?.bank_name,
        account_number: storeData.accountNumber || store.bank_info?.account_number,
        account_holder: storeData.accountHolder || store.bank_info?.account_holder
      };
    }
    
    // 데이터 업데이트
    const updatedStores = [...data.stores];
    updatedStores[storeIndex] = updatedStore;
    
    const updatedData = {
      ...data,
      stores: updatedStores
    };
    
    saveData(updatedData);
    console.debug("가게 정보 수정 완료:", updatedStore);
    
    return {
      success: true,
      message: '가게 정보가 수정되었습니다.',
      store: updatedStore
    };
  } catch (error) {
    console.error('가게 정보 수정 오류:', error);
    return { success: false, message: error.message };
  }
};

// 가게 상품 관리 함수
const addProduct = async (storeId, productData) => {
  try {
    console.debug("상품 추가 시작:", productData);
    const data = getInitialData();
    
    // 가게 확인
    const store = data.stores.find(s => s.id === storeId);
    if (!store) {
      throw new Error('가게를 찾을 수 없습니다.');
    }
    
    // 권한 확인
    const userId = getCurrentUserID();
    if (store.owner_id !== userId) {
      const userRole = data.user_roles.find(ur => ur.user_id === userId);
      if (!userRole || userRole.role !== "admin") {
        throw new Error('상품을 추가할 권한이 없습니다.');
      }
    }
    
    // 상품 ID 생성
    let productId = '1';
    if (data.products && data.products[storeId] && data.products[storeId].length > 0) {
      const maxId = Math.max(...data.products[storeId].map(p => parseInt(p.id)));
      productId = String(maxId + 1);
    }
    
    // 새 상품 객체 생성
    const newProduct = {
      id: productId,
      store_id: storeId,
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      discount_price: productData.discountPrice || null,
      category_id: productData.categoryId || null,
      options: productData.options || [],
      images: productData.images || [],
      stock: productData.stock || 0,
      status: productData.status || 'active',
      created_at: new Date().toISOString()
    };
    
    // 데이터 업데이트
    const products = { ...data.products };
    if (!products[storeId]) {
      products[storeId] = [];
    }
    
    products[storeId].push(newProduct);
    
    const updatedData = {
      ...data,
      products
    };
    
    saveData(updatedData);
    console.debug("상품 추가 완료:", newProduct);
    
    return {
      success: true,
      message: '상품이 추가되었습니다.',
      product: newProduct
    };
  } catch (error) {
    console.error('상품 추가 오류:', error);
    return { success: false, message: error.message };
  }
};

// 상품 정보 수정
const updateProduct = async (storeId, productId, productData) => {
  try {
    console.debug("상품 수정 시작:", productData);
    const data = getInitialData();
    
    // 가게 및 상품 확인
    const products = data.products[storeId];
    if (!products) {
      throw new Error('가게의 상품을 찾을 수 없습니다.');
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    
    // 권한 확인
    const userId = getCurrentUserID();
    const store = data.stores.find(s => s.id === storeId);
    if (!store || (store.owner_id !== userId)) {
      const userRole = data.user_roles.find(ur => ur.user_id === userId);
      if (!userRole || userRole.role !== "admin") {
        throw new Error('상품을 수정할 권한이 없습니다.');
      }
    }
    
    // 기존 상품 정보
    const product = products[productIndex];
    
    // 업데이트된 상품 정보
    const updatedProduct = {
      ...product,
      name: productData.name || product.name,
      description: productData.description || product.description,
      price: productData.price !== undefined ? productData.price : product.price,
      discount_price: productData.discountPrice !== undefined ? productData.discountPrice : product.discount_price,
      category_id: productData.categoryId || product.category_id,
      options: productData.options || product.options,
      images: productData.images || product.images,
      stock: productData.stock !== undefined ? productData.stock : product.stock,
      status: productData.status || product.status,
      updated_at: new Date().toISOString()
    };
    
    // 데이터 업데이트
    const updatedProducts = [...products];
    updatedProducts[productIndex] = updatedProduct;
    
    const allProducts = { ...data.products };
    allProducts[storeId] = updatedProducts;
    
    const updatedData = {
      ...data,
      products: allProducts
    };
    
    saveData(updatedData);
    console.debug("상품 수정 완료:", updatedProduct);
    
    return {
      success: true,
      message: '상품이 수정되었습니다.',
      product: updatedProduct
    };
  } catch (error) {
    console.error('상품 수정 오류:', error);
    return { success: false, message: error.message };
  }
};

// 상품 삭제
const deleteProduct = async (storeId, productId) => {
  try {
    console.debug("상품 삭제 시작:", { storeId, productId });
    const data = getInitialData();
    
    // 가게 및 상품 확인
    const products = data.products[storeId];
    if (!products) {
      throw new Error('가게의 상품을 찾을 수 없습니다.');
    }
    
    // 권한 확인
    const userId = getCurrentUserID();
    const store = data.stores.find(s => s.id === storeId);
    if (!store || (store.owner_id !== userId)) {
      const userRole = data.user_roles.find(ur => ur.user_id === userId);
      if (!userRole || userRole.role !== "admin") {
        throw new Error('상품을 삭제할 권한이 없습니다.');
      }
    }
    
    // 상품 필터링 (삭제)
    const updatedProducts = products.filter(p => p.id !== productId);
    
    // 상품이 삭제되지 않은 경우 (찾지 못한 경우)
    if (updatedProducts.length === products.length) {
      throw new Error('해당 상품을 찾을 수 없습니다.');
    }
    
    // 데이터 업데이트
    const allProducts = { ...data.products };
    allProducts[storeId] = updatedProducts;
    
    const updatedData = {
      ...data,
      products: allProducts
    };
    
    saveData(updatedData);
    console.debug("상품 삭제 완료");
    
    return {
      success: true,
      message: '상품이 삭제되었습니다.'
    };
  } catch (error) {
    console.error('상품 삭제 오류:', error);
    return { success: false, message: error.message };
  }
};

// 주문 상태 관리
const updateOrderStatus = async (orderId, status) => {
  try {
    console.debug("주문 상태 업데이트 시작:", { orderId, status });
    const data = getInitialData();
    
    // 주문 찾기
    const orderIndex = data.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    
    const order = data.orders[orderIndex];
    
    // 권한 확인 (관리자 또는 주문된 상품의 가게 소유주)
    const userId = getCurrentUserID();
    const userRole = data.user_roles.find(ur => ur.user_id === userId);
    
    let hasPermission = userRole && userRole.role === "admin";
    
    if (!hasPermission) {
      // 가게 소유주 확인
      const storeIds = new Set();
      order.items.forEach(item => {
        if (item.product && item.product.store_id) {
          storeIds.add(item.product.store_id);
        }
      });
      
      const userStores = data.stores.filter(s => s.owner_id === userId);
      const userStoreIds = new Set(userStores.map(s => s.id));
      
      // 주문에 포함된 상품 중 하나라도 사용자의 가게 상품이면 권한 부여
      hasPermission = [...storeIds].some(id => userStoreIds.has(id));
    }
    
    if (!hasPermission) {
      throw new Error('주문 상태를 변경할 권한이 없습니다.');
    }
    
    // 유효한 상태 확인
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('유효하지 않은 주문 상태입니다.');
    }
    
    // 주문 상태 업데이트
    const updatedOrder = {
      ...order,
      status,
      updated_at: new Date().toISOString()
    };
    
    // 데이터 업데이트
    const updatedOrders = [...data.orders];
    updatedOrders[orderIndex] = updatedOrder;
    
    const updatedData = {
      ...data,
      orders: updatedOrders
    };
    
    saveData(updatedData);
    console.debug("주문 상태 업데이트 완료:", updatedOrder);
    
    // 이벤트 발생
    triggerEvent('orderStatusUpdated');
    
    return {
      success: true,
      message: `주문 상태가 ${status}로 변경되었습니다.`,
      order: updatedOrder
    };
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    return { success: false, message: error.message };
  }
};

// 상점 소유자용 주문 목록 조회
const getStoreOrders = async (storeId) => {
  try {
    console.debug("상점 주문 조회 시작:", storeId);
    const data = getInitialData();
    
    // 권한 확인
    const userId = getCurrentUserID();
    const store = data.stores.find(s => s.id === storeId);
    
    if (!store || (store.owner_id !== userId)) {
      const userRole = data.user_roles.find(ur => ur.user_id === userId);
      if (!userRole || userRole.role !== "admin") {
        throw new Error('주문 내역을 조회할 권한이 없습니다.');
      }
    }
    
    // 해당 상점의 상품이 포함된 주문 필터링
    const storeOrders = data.orders.filter(order => {
      // 주문 아이템 중에 하나라도 이 상점의 상품이 있는지 확인
      return order.items.some(item => {
        return item.product && item.product.store_id === storeId;
      });
    });
    
    console.debug(`${storeOrders.length}개의 주문을 조회했습니다.`);
    
    return storeOrders;
  } catch (error) {
    console.error('상점 주문 조회 오류:', error);
    return [];
  }
};

// 모든 가게 가져오기 (관리자용)
const getAllStores = () => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();
    
    // 관리자 권한 확인
    const userRole = data.user_roles.find(ur => ur.user_id === userId);
    if (!userRole || userRole.role !== "admin") {
      // 관리자가 아니면 자신의 가게만 반환
      return data.stores.filter(store => store.owner_id === userId);
    }
    
    // 관리자면 모든 가게 반환
    return data.stores;
  } catch (error) {
    console.error('가게 목록 조회 오류:', error);
    return [];
  }
};

// 사용자 권한 변경 (관리자 전용)
const updateUserRole = async (targetUserId, newRole) => {
  try {
    console.debug("사용자 권한 변경 시작:", { targetUserId, newRole });
    const data = getInitialData();
    
    // 관리자 권한 확인
    const userId = getCurrentUserID();
    const userRole = data.user_roles.find(ur => ur.user_id === userId);
    
    if (!userRole || userRole.role !== "admin") {
      throw new Error('사용자 권한을 변경할 수 있는 권한이 없습니다.');
    }
    
    // 타겟 사용자 확인
    const targetUser = data.users.find(u => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    // 유효한 권한 확인
    const validRoles = ["admin", "seller", "buyer"];
    if (!validRoles.includes(newRole)) {
      throw new Error('유효하지 않은 권한입니다.');
    }
    
    // 사용자 역할 찾기
    const targetRoleIndex = data.user_roles.findIndex(ur => ur.user_id === targetUserId);
    
    let updatedUserRoles = [...data.user_roles];
    
    if (targetRoleIndex === -1) {
      // 역할이 없으면 새로 생성
      const newUserRole = {
        id: String(data.user_roles.length + 1),
        user_id: targetUserId,
        role: newRole
      };
      updatedUserRoles.push(newUserRole);
    } else {
      // 기존 역할 업데이트
      updatedUserRoles[targetRoleIndex] = {
        ...updatedUserRoles[targetRoleIndex],
        role: newRole
      };
    }
    
    // 데이터 업데이트
    const updatedData = {
      ...data,
      user_roles: updatedUserRoles
    };
    
    saveData(updatedData);
    console.debug("사용자 권한 변경 완료");
    
    return {
      success: true,
      message: `사용자 권한이 ${newRole}로 변경되었습니다.`
    };
  } catch (error) {
    console.error('사용자 권한 변경 오류:', error);
    return { success: false, message: error.message };
  }
};

// 관리자 대시보드 통계
const getAdminDashboardStats = () => {
  try {
    const data = getInitialData();
    
    // 관리자 권한 확인
    const userId = getCurrentUserID();
    const userRole = data.user_roles.find(ur => ur.user_id === userId);
    
    if (!userRole || userRole.role !== "admin") {
      throw new Error('관리자 통계를 조회할 권한이 없습니다.');
    }
    
    // 통계 계산
    const totalUsers = data.users.length;
    const totalSellers = data.user_roles.filter(ur => ur.role === "seller").length;
    const totalStores = data.stores ? data.stores.length : 0;
    
    // 주문 통계
    const orders = data.orders || [];
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    // 총 매출 계산
    const totalRevenue = orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
    
    // 최근 주문 (최대 5개)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    return {
      userStats: {
        totalUsers,
        totalSellers,
        newUsersToday: 0 // 실제 구현에서는 오늘 날짜로 필터링
      },
      storeStats: {
        totalStores,
        activeStores: totalStores // 실제 구현에서는 active 상태인 가게만 계산
      },
      orderStats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      },
      recentOrders
    };
  } catch (error) {
    console.error('관리자 대시보드 통계 조회 오류:', error);
    return null;
  }
};

const adminService = {
  // 가게 관리
  registerStore,
  updateStore,
  getAllStores,
  
  // 상품 관리
  addProduct,
  updateProduct,
  deleteProduct,
  
  // 주문 관리
  updateOrderStatus,
  getStoreOrders,
  
  // 사용자 관리
  updateUserRole,
  
  // 대시보드 및 통계
  getAdminDashboardStats
};

export default adminService;