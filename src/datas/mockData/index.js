// index.js - 모든 모의 데이터를 중앙에서 관리하고 내보내는 파일
import { users } from './mockUsers.json';
import { roles } from './mockUserRoles.json';
import { stores } from './mockStores.json';
import { products } from './mockProducts.json';
import { mockBusinessInfo } from './mockBusinessInfo.json';
import { buyer_profiles } from './mockBuyers.json';
import { seller_profiles } from './mockSellers.json';
import { orders } from './mockOrders.json';
import { notices } from './mockNotice.json';

// 각 데이터 세트를 개별적으로 내보내기
export {
  users,
  roles,
  stores,
  products,
  mockBusinessInfo,
  buyer_profiles,
  seller_profiles,
  orders,
  notices
};

// 전체 데이터를 하나의 객체로 합쳐서 내보내기 (기존 코드와 호환성 유지)
const mockData = {
  users,
  user_roles: roles,
  stores,
  products,
  businessInfo: mockBusinessInfo,
  buyer_profiles,
  seller_profiles,
  orders,
  notices
  // 필요에 따라 다른 데이터 세트 추가
};

export default mockData;