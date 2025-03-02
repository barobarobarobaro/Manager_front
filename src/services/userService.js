import mockData from '@/datas/mockData/mockUser.json';

let currentUserID = "1";

// 1번 사용자 프로필 가져오기
const getUserProfile = (userID = "1") => {
  try {
    // 1번 사용자 찾기
    const user = mockData.users.find(user => user.id === userID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    setCurrentUserID(userID);
    // 비밀번호는 제외하고 반환
    const { password, ...userInfo } = user;
    return userInfo;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }
};

// 좋아요한 가게 목록 가져오기
const getLikedStores = () => {
  try {
    // 1번 사용자의 좋아요한 가게 ID 목록
    const user = mockData.users.find(user => user.id === "1");
    if (!user) {
      return [];
    }
    
    const likedStoreIds = user.likedStores;
    
    // 가게 정보 가져오기
    return mockData.stores.filter(store => likedStoreIds.includes(store.id));
  } catch (error) {
    console.error('좋아요한 가게 조회 오류:', error);
    return [];
  }
};

// 가게 목록 전체 가져오기
const getAllStores = () => {
  try {
    return mockData.stores;
  } catch (error) {
    console.error('가게 목록 조회 오류:', error);
    return [];
  }
};

// 가게별 상품 목록 가져오기
const getStoreProducts = (storeId) => {
  try {
    return mockData.products[storeId] || [];
  } catch (error) {
    console.error('가게 상품 조회 오류:', error);
    return [];
  }
};

// 주문 내역 가져오기
const getRecentOrders = () => {
  try {
    // 1번 사용자의 주문 필터링
    return mockData.orders.filter(order => order.userId === "1");
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    return [];
  }
};

// 장바구니 관련 함수 추가
const getCartItems = () => {
  try {
    // 현재 사용자의 장바구니 아이템 반환 (모의 데이터 기준)
    const user = mockData.users.find(user => user.id === currentUserID);
    return user?.cartItems || [];
  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    return [];
  }
};

const addToCart = (item) => {
  try {
    const user = mockData.users.find(user => user.id === currentUserID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 이미 같은 상품이 장바구니에 있는지 확인
    const existingItemIndex = user.cartItems.findIndex(
      cartItem => 
        cartItem.product.id === item.product.id && 
        cartItem.option === item.option
    );

    if (existingItemIndex >= 0) {
      // 이미 있는 경우 수량만 증가
      user.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      // 새 상품인 경우 목록에 추가
      user.cartItems.push({
        id: Date.now(), // 고유 ID 생성
        product: item.product,
        quantity: item.quantity,
        option: item.option
      });
    }

    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'));

    return user.cartItems;
  } catch (error) {
    console.error('장바구니 추가 오류:', error);
    return [];
  }
};

const removeFromCart = (itemId) => {
  try {
    const user = mockData.users.find(user => user.id === currentUserID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    user.cartItems = user.cartItems.filter(item => item.id !== itemId);

    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'));

    return user.cartItems;
  } catch (error) {
    console.error('장바구니 제거 오류:', error);
    return [];
  }
};

const updateCartItemQuantity = (itemId, quantity) => {
  try {
    const user = mockData.users.find(user => user.id === currentUserID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const itemIndex = user.cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      user.cartItems[itemIndex].quantity = quantity;
    }

    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'));

    return user.cartItems;
  } catch (error) {
    console.error('장바구니 수량 업데이트 오류:', error);
    return [];
  }
};

const clearCart = () => {
  try {
    const user = mockData.users.find(user => user.id === currentUserID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    user.cartItems = [];

    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'));

    return user.cartItems;
  } catch (error) {
    console.error('장바구니 비우기 오류:', error);
    return [];
  }
};

const getCurrentUserID = () => {
  return currentUserID;
};

const setCurrentUserID = (userID) => {
  currentUserID = userID;
  return currentUserID;
};

const userService = {
  getUserProfile,
  getLikedStores,
  getAllStores,
  getStoreProducts,
  getRecentOrders,
  getCurrentUserID,
  setCurrentUserID,
  // 장바구니 관련 함수들
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
};

export default userService;