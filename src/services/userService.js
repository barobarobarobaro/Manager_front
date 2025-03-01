import mockData from '@/datas/mockData/mockUser.json';

// 1번 사용자 프로필 가져오기
const getUserProfile = (userID="1") => {
  try {
    // 1번 사용자 찾기
    const user = mockData.users.find(user => user.id === userID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    // 비밀번호는 제외하고 반환
    const { password, ...userInfo } = user;
    return userInfo;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }
};

// 좋아요한 가게 목록 가져오기
const getLikedFarms = () => {
  try {
    // 1번 사용자의 좋아요한 가게 ID 목록
    const user = mockData.users.find(user => user.id === "1");
    if (!user) {
      return [];
    }
    
    const likedFarmIds = user.likedFarms;
    
    // 가게 정보 가져오기
    return mockData.farms.filter(farm => likedFarmIds.includes(farm.id));
  } catch (error) {
    console.error('좋아요한 가게 조회 오류:', error);
    return [];
  }
};

// 가게 목록 전체 가져오기
const getAllFarms = () => {
  try {
    return mockData.farms;
  } catch (error) {
    console.error('가게 목록 조회 오류:', error);
    return [];
  }
};

// 가게별 상품 목록 가져오기
const getFarmProducts = (farmId) => {
  try {
    return mockData.products[farmId] || [];
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

const userService = {
  getUserProfile,
  getLikedFarms,
  getAllFarms,
  getFarmProducts,
  getRecentOrders
};

export default userService;