// services/userService.js
import { mockUsers } from '@/datas/mockData/mockUsers';

// 환경에 따라 실제 API URL 또는 목업 데이터 사용
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' //여기에 실제 서버 api 주소를 넣어주세요
  : '';

// 현재 로그인한 사용자 ID (실제로는 인증 시스템에서 가져옴)
const CURRENT_USER_ID = 1;

// 서비스 함수 구현
export const userService = {
  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    if (!API_URL) {
      console.log('[DEV] Getting current user data');
      // 모의 데이터 사용
      const user = mockUsers.find(user => user.id === CURRENT_USER_ID);
      return new Promise(resolve => {
        setTimeout(() => resolve({ data: user }), 300);
      });
    }
    
    // 실제 API 호출
    const response = await fetch(`${API_URL}/users/current`);
    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다');
    }
    return response.json();
  },
  
  // 사용자 프로필 업데이트
  async updateUserProfile(userData) {
    if (!API_URL) {
      console.log('[DEV] Updating user profile', userData);
      // 모의 데이터 업데이트
      const userIndex = mockUsers.findIndex(user => user.id === CURRENT_USER_ID);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        return new Promise(resolve => {
          setTimeout(() => resolve({ data: mockUsers[userIndex] }), 500);
        });
      }
      return Promise.reject(new Error('사용자를 찾을 수 없습니다'));
    }
    
    // 실제 API 호출
    const response = await fetch(`${API_URL}/users/${CURRENT_USER_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('프로필 업데이트에 실패했습니다');
    }
    return response.json();
  },
  
  // 비밀번호 변경
  async changePassword(passwordData) {
    if (!API_URL) {
      console.log('[DEV] Changing password', passwordData);
      // 모의 비밀번호 변경 (실제 검증 없음)
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }
    
    // 실제 API 호출
    const response = await fetch(`${API_URL}/users/${CURRENT_USER_ID}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
      throw new Error('비밀번호 변경에 실패했습니다');
    }
    return response.json();
  },
  
  // 프로필 이미지 업로드
  async uploadProfileImage(imageFile) {
    if (!API_URL) {
      console.log('[DEV] Uploading profile image', imageFile.name);
      // 모의 파일 업로드 (파일 URL 생성)
      const imageUrl = URL.createObjectURL(imageFile);
      
      // 모의 데이터 업데이트
      const userIndex = mockUsers.findIndex(user => user.id === CURRENT_USER_ID);
      if (userIndex !== -1) {
        mockUsers[userIndex].profileImage = imageUrl;
        return new Promise(resolve => {
          setTimeout(() => resolve({ data: { imageUrl } }), 1000);
        });
      }
      return Promise.reject(new Error('사용자를 찾을 수 없습니다'));
    }
    
    // 실제 API 호출
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_URL}/users/${CURRENT_USER_ID}/profile-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다');
    }
    return response.json();
  },
  
  // 사업자 정보 업데이트
  async updateBusinessInfo(businessData) {
    if (!API_URL) {
      console.log('[DEV] Updating business info', businessData);
      // 모의 데이터 업데이트
      const userIndex = mockUsers.findIndex(user => user.id === CURRENT_USER_ID);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...businessData };
        return new Promise(resolve => {
          setTimeout(() => resolve({ data: mockUsers[userIndex] }), 500);
        });
      }
      return Promise.reject(new Error('사용자를 찾을 수 없습니다'));
    }
    
    // 실제 API 호출
    const response = await fetch(`${API_URL}/users/${CURRENT_USER_ID}/business`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData),
    });
    
    if (!response.ok) {
      throw new Error('사업자 정보 업데이트에 실패했습니다');
    }
    return response.json();
  },
  
  // 계좌 정보 업데이트
  async updateBankAccount(accountData) {
    if (!API_URL) {
      console.log('[DEV] Updating bank account info', accountData);
      // 모의 데이터 업데이트
      const userIndex = mockUsers.findIndex(user => user.id === CURRENT_USER_ID);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...accountData };
        return new Promise(resolve => {
          setTimeout(() => resolve({ data: mockUsers[userIndex] }), 500);
        });
      }
      return Promise.reject(new Error('사용자를 찾을 수 없습니다'));
    }
    
    // 실제 API 호출
    const response = await fetch(`${API_URL}/users/${CURRENT_USER_ID}/bank-account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });
    
    if (!response.ok) {
      throw new Error('계좌 정보 업데이트에 실패했습니다');
    }
    return response.json();
  }
};

export default userService;