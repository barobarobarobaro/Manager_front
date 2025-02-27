// services/apiClient.js
import { products as mockProducts } from '../datas/mockData/mockProducts';

// 개발환경에서 사용할 지연시간 (ms)
const DELAY = 300;

// 개발 환경용 모의 API 응답
const mockAPI = (data, error = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    }, DELAY);
  });
};

// 환경에 따라 실제 API URL 또는 목업 데이터 사용
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' //여기에 실제 서버 api 주소를 넣어주세요
  : '';

// 기본 API 클라이언트 함수
export const apiClient = {
  // 데이터 가져오기 
  async get(endpoint, params = {}) {
    // 개발 환경에서는 목업 데이터 반환
    if (!API_URL) {
      console.log(`[DEV] GET ${endpoint}`, params);
      
      if (endpoint === '/products') {
        return mockAPI({ data: mockProducts });
      }
      
      // 단일 상품 조회
      if (endpoint.startsWith('/products/')) {
        const id = parseInt(endpoint.split('/').pop());
        const product = mockProducts.find(p => p.id === id);
        return mockAPI({ data: product || null });
      }
      
      return mockAPI({ data: null });
    }
    
    // 프로덕션 환경에서는 실제 API 요청
    const url = new URL(`${API_URL}${endpoint}`);
    Object.keys(params).forEach(key => 
      url.searchParams.append(key, params[key])
    );
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    return response.json();
  },
  
  // 데이터 생성하기
  async post(endpoint, data) {
    // 개발 환경에서는 목업 응답
    if (!API_URL) {
      console.log(`[DEV] POST ${endpoint}`, data);
      
      if (endpoint === '/products') {
        // 새 상품 생성 로직 (ID 자동 생성 등)
        const newProduct = { 
          ...data, 
          id: Math.max(...mockProducts.map(p => p.id)) + 1,
          created: new Date().toISOString().slice(0, 10)
        };
        mockProducts.push(newProduct);
        return mockAPI({ data: newProduct });
      }
      
      return mockAPI({ data: null });
    }
    
    // 프로덕션 환경에서는 실제 API 요청
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    return response.json();
  },
  
  // 데이터 업데이트하기
  async put(endpoint, data) {
    // 개발 환경에서는 목업 응답
    if (!API_URL) {
      console.log(`[DEV] PUT ${endpoint}`, data);
      
      if (endpoint.startsWith('/products/')) {
        const id = parseInt(endpoint.split('/').pop());
        const index = mockProducts.findIndex(p => p.id === id);
        
        if (index >= 0) {
          mockProducts[index] = { ...mockProducts[index], ...data };
          return mockAPI({ data: mockProducts[index] });
        }
        
        return mockAPI(null, new Error('상품을 찾을 수 없습니다.'));
      }
      
      return mockAPI({ data: null });
    }
    
    // 프로덕션 환경에서는 실제 API 요청
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    return response.json();
  },
  
  // 데이터 삭제하기
  async delete(endpoint) {
    // 개발 환경에서는 목업 응답
    if (!API_URL) {
      console.log(`[DEV] DELETE ${endpoint}`);
      
      if (endpoint.startsWith('/products/')) {
        const id = parseInt(endpoint.split('/').pop());
        const index = mockProducts.findIndex(p => p.id === id);
        
        if (index >= 0) {
          const deleted = mockProducts.splice(index, 1)[0];
          return mockAPI({ success: true, data: deleted });
        }
        
        return mockAPI(null, new Error('상품을 찾을 수 없습니다.'));
      }
      
      return mockAPI({ success: false });
    }
    
    // 프로덕션 환경에서는 실제 API 요청
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    return response.json();
  }
};