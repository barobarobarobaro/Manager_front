import mockData from '@/datas/mockData/index';

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

// 사용자 역할 가져오기
const getUserRole = (userId) => {
  const data = getInitialData();
  const id = userId || getCurrentUserID();
  const userRole = data.user_roles.find(role => role.user_id === id);
  return userRole ? userRole.role : 'buyer'; // 기본값은 buyer
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

    // 사용자 역할 확인
    const role = getUserRole(user.id);

    // 토큰 생성 (실제로는 서버에서 받음)
    const mockToken = `mock_token_${user.id}_${Date.now()}`;

    // 로그인 정보 저장
    setCurrentUserID(user.id);
    setUserToken(mockToken);

    // 이벤트 발생
    triggerEvent('userLoggedIn');

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role
      }
    };
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

// 회원가입 함수
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

    // 새 사용자 ID 생성
    const newUserId = String(data.users.length + 1);

    // 새 사용자 객체 생성
    const newUser = {
      id: newUserId,
      email: userData.email,
      password: userData.password, // 실제로는 해싱 처리 필요
      name: userData.name,
      profileImage: null,
      joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
      phone: userData.phone || ''
    };

    console.debug("생성된 새 사용자 객체:", newUser);

    // 역할 설정 (buyer 또는 seller)
    const role = userData.role || "buyer";
    const newUserRole = {
      id: String(data.user_roles.length + 1),
      user_id: newUserId,
      role: role
    };

    console.debug("새 사용자 역할 객체:", newUserRole);

    // 역할에 따른 프로필 정보 생성
    if (role === "buyer") {
      // 구매자 프로필 정보
      const buyerProfile = {
        likedStores: [],
        recentOrders: [],
        cartItems: [],
        address: userData.address || {
          zipCode: "",
          address1: "",
          address2: "",
          recipient: userData.name,
          recipientPhone: userData.phone || "",
          isDefault: true
        },
        termsAgreed: userData.termsAgreed,
        privacyAgreed: userData.privacyAgreed,
        marketingAgreed: userData.marketingAgreed || false
      };

      // 구매자 프로필 추가
      data.buyer_profiles = {
        ...data.buyer_profiles,
        [newUserId]: buyerProfile
      };
    } else if (role === "seller") {
      // 판매자가 사업자인 경우
      if (userData.isBusinessOwner && userData.businessInfo) {
        // 판매자 프로필 정보
        const sellerProfile = {
          businessInfo: {
            businessNumber: userData.businessInfo.businessNumber,
            companyName: userData.businessInfo.companyName,
            ceoName: userData.businessInfo.ceoName,
            businessAddress: userData.businessInfo.businessAddress,
            businessType: userData.businessInfo.businessType,
            businessCategory: userData.businessInfo.businessCategory,
            openDate: userData.businessInfo.openDate
          },
          stores: [],
          bankInfo: {
            bankName: "",
            accountNumber: "",
            accountHolder: userData.name
          }
        };

        // 판매자 프로필 추가
        data.seller_profiles = {
          ...data.seller_profiles,
          [newUserId]: sellerProfile
        };
      }
    }

    // 데이터 업데이트
    const updatedData = {
      ...data,
      users: [...data.users, newUser],
      user_roles: [...data.user_roles, newUserRole]
    };

    saveData(updatedData);
    console.debug("회원가입 데이터 저장 완료");

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: role }
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

    // 새 가게 ID 생성
    const newStoreId = String(data.stores.length + 1);

    // 새 가게 객체 생성
    const newStore = {
      id: newStoreId,
      name: storeData.storeName,
      owner_id: userId,
      location: storeData.location || "",
      description: storeData.storeDescription || '',
      address: storeData.storeAddress,
      phone: storeData.storePhone,
      business_hours: storeData.businessHours || '',
      closed_days: storeData.closedDays || [],
      rating: 0,
      productCount: 0,
      image: storeData.image || null,
      banner_image: storeData.bannerImage || null,
      status: 'active',
      created_at: new Date().toISOString(),
      category_id: storeData.categoryId || "1",
      is_organic: storeData.isOrganic || false,
      delivery_available: storeData.deliveryAvailable || true,
      min_order_amount: storeData.minOrderAmount || 10000
    };

    console.debug("생성된 새 가게 객체:", newStore);

    // 판매자 프로필 업데이트 (stores 배열에 새 가게 ID 추가)
    const sellerProfile = data.seller_profiles[userId];
    if (sellerProfile) {
      data.seller_profiles[userId] = {
        ...sellerProfile,
        stores: [...(sellerProfile.stores || []), newStoreId]
      };
    }

    // 데이터 업데이트 (새 가게 정보 추가)
    const updatedData = {
      ...data,
      stores: [...data.stores, newStore],
      products: {
        ...data.products,
        [newStoreId]: [] // 빈 상품 배열 초기화
      }
    };

    saveData(updatedData);
    console.debug("가게 정보 저장 완료");

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
const getUserProfile = (userID = null) => {
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

    // 사용자 역할 확인
    const role = getUserRole(id);

    // 역할에 따른 추가 정보 가져오기
    let profileInfo = {};

    if (role === "buyer") {
      // 구매자 프로필 정보
      profileInfo = data.buyer_profiles[id] || {};
    } else if (role === "seller") {
      // 판매자 프로필 정보
      profileInfo = data.seller_profiles[id] || {};
    }

    // 비밀번호는 제외하고 반환
    const { password, ...userInfo } = user;

    return {
      ...userInfo,
      role,
      profileInfo
    };
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }
};

// 이메일 중복 확인
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
    const role = getUserRole(userId);

    // 사용자의 역할에 따라 다른 곳에서 좋아요 목록 가져오기
    let likedStoreIds = [];

    if (role === "buyer") {
      // 구매자 프로필에서 가져오기
      const buyerProfile = data.buyer_profiles[userId];
      if (buyerProfile && buyerProfile.likedStores) {
        likedStoreIds = buyerProfile.likedStores;
      }
    } else {
      // 다른 역할(판매자)도 같은 방식으로 처리 가능
      return [];
    }

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
    const role = getUserRole(userId);

    // 구매자만 좋아요 가능
    if (role !== "buyer") {
      throw new Error('구매자만 가게를 좋아요할 수 있습니다.');
    }

    // 구매자 프로필 가져오기
    const buyerProfile = data.buyer_profiles[userId];
    if (!buyerProfile) {
      throw new Error('구매자 프로필을 찾을 수 없습니다.');
    }

    // 좋아요한 가게 목록 확인
    const likedStores = buyerProfile.likedStores || [];

    // 좋아요 토글
    let updatedLikedStores;
    if (likedStores.includes(storeId)) {
      // 이미 좋아요 한 경우 제거
      updatedLikedStores = likedStores.filter(id => id !== storeId);
    } else {
      // 새로 좋아요 추가
      updatedLikedStores = [...likedStores, storeId];
    }

    // 구매자 프로필 업데이트
    const updatedBuyerProfile = {
      ...buyerProfile,
      likedStores: updatedLikedStores
    };

    // 데이터 업데이트
    const updatedData = {
      ...data,
      buyer_profiles: {
        ...data.buyer_profiles,
        [userId]: updatedBuyerProfile
      }
    };

    saveData(updatedData);

    // 이벤트 발생
    triggerEvent('likedStoresUpdated');

    return updatedLikedStores.includes(storeId);
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
    const role = getUserRole(userId);
    const data = getInitialData();

    let cartItems = [];

    if (role === "buyer") {
      // 구매자 프로필에서 장바구니 가져오기
      const buyerProfile = data.buyer_profiles[userId];
      if (buyerProfile) {
        cartItems = buyerProfile.cartItems || [];
      }
    }

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

    // 아이템 유효성 검사
    if (!item || !item.product || !item.quantity) {
      throw new Error('유효하지 않은 상품 정보입니다.');
    }

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
        id: Date.now().toString(), // 고유 ID 생성
        product: item.product,
        quantity: item.quantity,
        option: item.option
      });
    }

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(updatedCart));
    }

    // 사용자 데이터에도 업데이트
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

    // 사용자 데이터에도 업데이트
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

    // 사용자 데이터에도 업데이트
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

    // 사용자 데이터에도 업데이트
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
    const role = getUserRole(userId);
    const data = getInitialData();

    if (role === "buyer") {
      // 구매자 프로필 업데이트
      const buyerProfile = data.buyer_profiles[userId];
      if (buyerProfile) {
        const updatedBuyerProfile = {
          ...buyerProfile,
          cartItems
        };

        // 데이터 업데이트
        const updatedData = {
          ...data,
          buyer_profiles: {
            ...data.buyer_profiles,
            [userId]: updatedBuyerProfile
          }
        };

        saveData(updatedData);
      }
    }
  } catch (error) {
    console.error('사용자 장바구니 업데이트 오류:', error);
  }
};

// 주문 생성 (체크아웃)
const createOrder = (orderData) => {
  try {
    const userId = getCurrentUserID();
    const data = getInitialData();

    // 새 주문 ID 생성 (고유한 ID 생성)
    const newOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 가게 정보 추가
    const storeId = orderData.store?.id || 'unknown';

    // 새 주문 생성
    const newOrder = {
      id: newOrderId,
      userId: userId,
      store: {
        id: storeId,
        name: orderData.store?.name || '알 수 없는 가게'
      },
      items: orderData.items || [],
      totalAmount: orderData.totalAmount,
      shippingAddress: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        zonecode: orderData.shippingAddress.zonecode,
        roadAddress: orderData.shippingAddress.roadAddress,
        detailAddress: orderData.shippingAddress.detailAddress || '',
        message: orderData.shippingAddress.message || ''
      },
      paymentMethod: orderData.paymentMethod,
      shippingFee: orderData.shippingFee || 0,
      status: 'pending', // 초기 상태
      createdAt: new Date().toISOString()
    };

    // 데이터 업데이트
    const updatedData = {
      ...data,
      orders: [...data.orders, newOrder]
    };

    // 구매자 프로필 업데이트 (recentOrders에 추가)
    if (data.buyer_profiles[userId]) {
      const buyerProfile = data.buyer_profiles[userId];
      updatedData.buyer_profiles = {
        ...data.buyer_profiles,
        [userId]: {
          ...buyerProfile,
          recentOrders: [...(buyerProfile.recentOrders || []), newOrderId]
        }
      };
    }

    // 장바구니에서 현재 주문 상품 제거
    const remainingCartItems = getCartItems().filter(cartItem =>
      !orderData.items.some(orderItem =>
        orderItem.product.id === cartItem.product.id &&
        orderItem.quantity === cartItem.quantity
      )
    );

    // 장바구니 업데이트
    localStorage.setItem('cart_items', JSON.stringify(remainingCartItems));

    // 데이터 저장
    saveData(updatedData);

    // 이벤트 발생
    triggerEvent('orderCreated');

    return { success: true, order: newOrder };
  } catch (error) {
    console.error('주문 생성 오류:', error);
    return { success: false, message: error.message };
  }
};

// 주문 상세 정보 가져오기
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

// 프로필 업데이트
const updateUserProfile = (profileData) => {
  try {
    const userId = getCurrentUserID();
    const role = getUserRole(userId);
    const data = getInitialData();

    // 사용자 기본 정보 업데이트
    const userIndex = data.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 수정 가능한 기본 필드 추출
    const { name, phone, profileImage } = profileData;
    const updatedFields = {};

    if (name !== undefined) updatedFields.name = name;
    if (phone !== undefined) updatedFields.phone = phone;
    if (profileImage !== undefined) updatedFields.profileImage = profileImage;

    // 사용자 기본 정보 업데이트
    const updatedUsers = [...data.users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updatedFields
    };

    // 역할에 따른 프로필 정보 업데이트
    let updatedData = {
      ...data,
      users: updatedUsers
    };

    if (role === "buyer") {
      // 구매자 프로필 업데이트
      const { address, marketingAgreed } = profileData;
      const buyerProfile = data.buyer_profiles[userId];

      if (buyerProfile) {
        updatedData.buyer_profiles = {
          ...data.buyer_profiles,
          [userId]: {
            ...buyerProfile,
            ...(address && { address }),
            ...(marketingAgreed !== undefined && { marketingAgreed })
          }
        };
      }
    } else if (role === "seller") {
      // 판매자 프로필 업데이트
      const { businessInfo, bankInfo } = profileData;
      const sellerProfile = data.seller_profiles[userId];

      if (sellerProfile) {
        updatedData.seller_profiles = {
          ...data.seller_profiles,
          [userId]: {
            ...sellerProfile,
            ...(businessInfo && { businessInfo }),
            ...(bankInfo && { bankInfo })
          }
        };
      }
    }

    saveData(updatedData);

    // 이벤트 발생
    triggerEvent('profileUpdated');

    return { success: true, profile: getUserProfile(userId) };
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

    // 구매자 프로필에서도 주문 정보 제거
    if (data.buyer_profiles[userId]) {
      updatedData.buyer_profiles = {
        ...data.buyer_profiles,
        [userId]: {
          ...data.buyer_profiles[userId],
          recentOrders: []
        }
      };
    }

    saveData(updatedData);

    // 이벤트 발생
    triggerEvent('orderUpdated');

    return { success: true, message: '모든 주문이 삭제되었습니다.' };
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    return { success: false, message: error.message };
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