import mockData from '@/datas/mockData/mockUser.json';

// 로컬 스토리지 키 정의
const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_ID: 'user_id',
  CART_ITEMS: 'cart_items',
  USER_DATA: 'user_data'
};

// 초기 데이터 로드 (로컬 스토리지 또는 mock)
const getInitialData = () => {
  if (typeof window === 'undefined') return mockData; // SSR 대비
  localStorage.clear();
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

// 현재 사용자 ID 설정
const setCurrentUserID = (userID) => {
  if (typeof window === 'undefined') return userID;
  localStorage.setItem(STORAGE_KEYS.USER_ID, userID);
  return userID;
};

// 사용자 토큰 관리
const getUserToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
};

const setUserToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  }
};

// 이벤트 발생 헬퍼 함수
const triggerEvent = (eventName) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(eventName));
};

// 로그인 함수
const login = async (email, password) => {
  try {
    // 실제 환경에서는 API 호출
    const data = getInitialData();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 토큰 생성 (실제로는 서버에서 받음)
    const mockToken = `mock_token_${user.id}_${Date.now()}`;

    // 로그인 정보 저장
    setCurrentUserID(user.id);
    setUserToken(mockToken);

    // 이벤트 발생
    triggerEvent('userLoggedIn');

    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, message: error.message };
  }
};

// 로그아웃 함수
const logout = () => {
  try {
    // 로그인 정보 삭제
    setCurrentUserID('');
    setUserToken(null);
    localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);

    // 이벤트 발생
    triggerEvent('userLoggedOut');

    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { success: false, message: error.message };
  }
};

// 회원가입 함수 (수정 버전)
const register = async (userData) => {
  try {
    console.debug("회원가입 시작:", userData);
    const data = getInitialData();

    // 이메일 중복 확인
    const existingUser = data.users.find(u => u.email === userData.email);
    if (existingUser) {
      console.debug("중복 이메일 발견:", userData.email);
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 필수 약관 동의 여부 확인 (개인정보 및 서비스 이용 약관)
    if (!userData.termsAgreed || !userData.privacyAgreed) {
      console.debug("약관 동의 부족:", { termsAgreed: userData.termsAgreed, privacyAgreed: userData.privacyAgreed });
      throw new Error('필수 약관에 동의해야 합니다.');
    }

    // 새 사용자 객체 생성
    const newUser = {
      id: String(data.users.length + 1), // 실제 환경에서는 서버에서 ID 생성
      name: userData.name,
      email: userData.email,
      password: userData.password, // 실제로는 해싱 처리 필요
      phone: userData.phone || '',
      address: userData.address || '',
      termsAgreed: userData.termsAgreed,
      privacyAgreed: userData.privacyAgreed,
      marketingAgreed: userData.marketingAgreed || false,
      // 사업자인 경우, 사업자 정보 저장 (없으면 null)
      businessInfo: userData.isBusinessOwner ? {
        businessNumber: userData.businessInfo.businessNumber,
        companyName: userData.businessInfo.companyName,
        ceoName: userData.businessInfo.ceoName,
        businessAddress: userData.businessInfo.businessAddress, // 완성된 주소
        businessType: userData.businessInfo.businessType,
        businessCategory: userData.businessInfo.businessCategory,
        openDate: userData.businessInfo.openDate
      } : null,
      likedStores: [],
      cartItems: [],
      createdAt: new Date().toISOString()
    };

    console.debug("생성된 새 사용자 객체:", newUser);

    // role 설정: userData.role가 있으면 사용, 없으면 기본값 "buyer"
    const role = userData.role ? userData.role : "buyer";
    const newUserRole = {
      id: String((data.user_roles ? data.user_roles.length : 0) + 1),
      user_id: newUser.id,
      role: role
    };

    console.debug("새 사용자 역할 객체:", newUserRole);

    // 데이터 업데이트 (새 사용자와 역할 정보 추가)
    const updatedData = {
      ...data,
      users: [...data.users, newUser],
      user_roles: [...(data.user_roles || []), newUserRole]
    };

    saveData(updatedData);
    console.debug("회원가입 데이터 저장 완료. updatedData:", updatedData);

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUserRole.role }
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, message: error.message };
  }
};
// 판매자의 가게 정보 등록을 위한 별도 함수
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
// 사용자 프로필 가져오기
const getUserProfile = (userID =null) => {
  try {
    const id = userID || getCurrentUserID();
    const data = getInitialData();

    // 사용자 찾기
    const user = data.users.find(user => user.id === id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 로그인한 사용자면 ID 설정
    if (!userID) {
      setCurrentUserID(id);
    }

    // 비밀번호는 제외하고 반환
    const { password, ...userInfo } = user;
    return userInfo;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }
};
// userService.js 내부에 추가
const isEmailDuplicate = (email) => {
  try {
    const data = getInitialData();
    const existingUser = data.users.find(u => u.email === email);
    console.debug("이메일 중복 확인:", email, !!existingUser);
    return !!existingUser;
  } catch (error) {
    console.error("이메일 중복 검증 오류:", error);
    return false;
  }
};
// 좋아요한 가게 목록 가져오기
const getLikedStores = () => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 사용자의 좋아요한 가게 ID 목록
    const user = data.users.find(user => user.id === userId);
    if (!user) {
      return [];
    }

    const likedStoreIds = user.likedStores;

    // 가게 정보 가져오기
    return data.stores.filter(store => likedStoreIds.includes(store.id));
  } catch (error) {
    console.error('좋아요한 가게 조회 오류:', error);
    return [];
  }
};

// 가게 좋아요 토글
const toggleLikeStore = (storeId) => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 사용자 찾기
    const userIndex = data.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 사용자 정보 복사
    const updatedUsers = [...data.users];
    const user = { ...updatedUsers[userIndex] };

    // 좋아요 토글
    const likedIndex = user.likedStores.indexOf(storeId);
    if (likedIndex === -1) {
      user.likedStores = [...user.likedStores, storeId];
    } else {
      user.likedStores = user.likedStores.filter(id => id !== storeId);
    }

    // 업데이트된 사용자 정보 저장
    updatedUsers[userIndex] = user;
    saveData({
      ...data,
      users: updatedUsers
    });

    // 이벤트 발생
    triggerEvent('likedStoresUpdated');

    return user.likedStores.includes(storeId);
  } catch (error) {
    console.error('가게 좋아요 토글 오류:', error);
    return false;
  }
};

// 가게 목록 전체 가져오기
const getAllStores = () => {
  try {
    const data = getInitialData();
    return data.stores;
  } catch (error) {
    console.error('가게 목록 조회 오류:', error);
    return [];
  }
};

// 가게별 상품 목록 가져오기
const getStoreProducts = (storeId) => {
  try {
    const data = getInitialData();
    return data.products[storeId] || [];
  } catch (error) {
    console.error('가게 상품 조회 오류:', error);
    return [];
  }
};

// 주문 내역 가져오기
const getRecentOrders = () => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 사용자의 주문 필터링
    return data.orders.filter(order => order.userId === userId);
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    return [];
  }
};

// 장바구니 관련 함수
const getCartItems = () => {
  try {
    // 로컬 스토리지에서 장바구니 가져오기
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    }

    // 저장된 장바구니가 없으면 사용자 데이터에서 가져오기
    const userId = getCurrentUserID();
    const data = getInitialData();
    const user = data.users.find(user => user.id === userId);

    const cartItems = user?.cartItems || [];

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
    }

    return cartItems;
  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    return [];
  }
};

const addToCart = (item) => {
  try {
    // 현재 장바구니 가져오기
    const cartItems = getCartItems();
    console.log('userService.addToCart 호출됨:', item);
    // 이미 같은 상품이 장바구니에 있는지 확인
    const existingItemIndex = cartItems.findIndex(
      cartItem =>
        cartItem.product.id === item.product.id &&
        cartItem.option === item.option
    );

    let updatedCart = [...cartItems];

    if (existingItemIndex >= 0) {
      // 이미 있는 경우 수량만 증가
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + item.quantity
      };
    } else {
      // 새 상품인 경우 목록에 추가
      updatedCart.push({
        id: Date.now(), // 고유 ID 생성
        product: item.product,
        quantity: item.quantity,
        option: item.option
      });
    }

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(updatedCart));
    }

    // 사용자 데이터에도 업데이트 (선택적)
    updateUserCartItems(updatedCart);

    // 이벤트 발생
    triggerEvent('cartUpdated');

    return updatedCart;
  } catch (error) {
    console.error('장바구니 추가 오류:', error);
    return getCartItems(); // 현재 상태 반환
  }
};

const removeFromCart = (itemId) => {
  try {
    // 현재 장바구니 가져오기
    const cartItems = getCartItems();

    // 아이템 제거
    const updatedCart = cartItems.filter(item => item.id !== itemId);

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(updatedCart));
    }

    // 사용자 데이터에도 업데이트 (선택적)
    updateUserCartItems(updatedCart);

    // 이벤트 발생
    triggerEvent('cartUpdated');

    return updatedCart;
  } catch (error) {
    console.error('장바구니 제거 오류:', error);
    return getCartItems(); // 현재 상태 반환
  }
};

const updateCartItemQuantity = (itemId, quantity) => {
  try {
    // 현재 장바구니 가져오기
    const cartItems = getCartItems();

    // 아이템 수량 업데이트
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(updatedCart));
    }

    // 사용자 데이터에도 업데이트 (선택적)
    updateUserCartItems(updatedCart);

    // 이벤트 발생
    triggerEvent('cartUpdated');

    return updatedCart;
  } catch (error) {
    console.error('장바구니 수량 업데이트 오류:', error);
    return getCartItems(); // 현재 상태 반환
  }
};

const clearCart = () => {
  try {
    // 장바구니 비우기
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify([]));
    }

    // 사용자 데이터에도 업데이트 (선택적)
    updateUserCartItems([]);

    // 이벤트 발생
    triggerEvent('cartUpdated');

    return [];
  } catch (error) {
    console.error('장바구니 비우기 오류:', error);
    return getCartItems(); // 현재 상태 반환
  }
};

// 사용자 데이터의 장바구니 정보 업데이트 (내부용)
const updateUserCartItems = (cartItems) => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 사용자 찾기
    const userIndex = data.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return;

    // 사용자 데이터 업데이트
    const updatedUsers = [...data.users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      cartItems
    };

    // 데이터 저장
    saveData({
      ...data,
      users: updatedUsers
    });
  } catch (error) {
    console.error('사용자 장바구니 업데이트 오류:', error);
  }
};

// 주문 생성 (체크아웃)
const createOrder = (orderData) => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 새 주문 생성
    const newOrder = {
      id: String(data.orders.length + 1), // 실제로는 서버에서 생성
      userId,
      items: orderData.items || getCartItems(),
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      status: 'pending', // 초기 상태
      createdAt: new Date().toISOString()
    };

    // 데이터 업데이트
    const updatedData = {
      ...data,
      orders: [...data.orders, newOrder]
    };
    saveData(updatedData);

    // 주문 후 장바구니 비우기
    clearCart();

    // 이벤트 발생
    triggerEvent('orderCreated');

    return { success: true, order: newOrder };
  } catch (error) {
    console.error('주문 생성 오류:', error);
    return { success: false, message: error.message };
  }
};

// 프로필 업데이트
const updateUserProfile = (profileData) => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 사용자 찾기
    const userIndex = data.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 수정 불가능한 필드 제외
    const { id, password, email, ...updatableFields } = profileData;

    // 사용자 정보 업데이트
    const updatedUsers = [...data.users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updatableFields
    };

    // 데이터 저장
    saveData({
      ...data,
      users: updatedUsers
    });

    // 이벤트 발생
    triggerEvent('profileUpdated');

    // 비밀번호 제외하고 반환
    const { password: _, ...updatedProfile } = updatedUsers[userIndex];
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return { success: false, message: error.message };
  }
};

// 인증 상태 확인
const isAuthenticated = () => {
  return !!getUserToken();
};
// 테스트용: 모든 주문 삭제 기능
const clearAllOrders = () => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 현재 사용자의 주문만 필터링하여 제외
    const updatedOrders = data.orders.filter(order => order.userId !== userId);

    // 데이터 업데이트
    const updatedData = {
      ...data,
      orders: updatedOrders
    };
    saveData(updatedData);

    // 이벤트 발생
    triggerEvent('orderUpdated');

    return { success: true, message: '모든 주문이 삭제되었습니다.' };
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    return { success: false, message: error.message };
  }
};
// 주문 상세 정보 가져오기 함수 추가
const getOrderDetail = (orderId) => {
  try {
    const data = getInitialData();
    const order = data.orders.find(order => order.id === orderId);
    if (!order) {
      throw new Error("주문 정보를 찾을 수 없습니다.");
    }
    return order;
  } catch (error) {
    console.error("주문 상세 조회 오류:", error);
    return null;
  }
};
const userService = {
  // 인증 관련
  login,
  logout,
  register,
  getUserToken,
  isAuthenticated,
  isEmailDuplicate,

  // 사용자 정보
  getUserProfile,
  updateUserProfile,
  getCurrentUserID,

  // 가게/상품 관련
  getLikedStores,
  toggleLikeStore,
  getAllStores,
  getStoreProducts,

  // 주문 관련
  getRecentOrders,
  createOrder,
  clearAllOrders,
  getOrderDetail,

  // 장바구니 관련
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
};

export default userService;