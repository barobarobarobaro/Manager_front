// services/productService.js
import { apiClient } from './apiClient';

export const productService = {
  // 모든 상품 가져오기
  async getProducts() {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('상품 목록 조회 중 오류:', error);
      throw error;
    }
  },
  
  // 상품 ID로 단일 상품 조회
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`상품 ID ${id} 조회 중 오류:`, error);
      throw error;
    }
  },
  
  // 새 상품 생성
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('상품 생성 중 오류:', error);
      throw error;
    }
  },
  
  // 상품 정보 업데이트
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`상품 ID ${id} 업데이트 중 오류:`, error);
      throw error;
    }
  },
  
  // 상품 삭제
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`상품 ID ${id} 삭제 중 오류:`, error);
      throw error;
    }
  },
  
  // 상품 필터링 (프론트엔드에서 수행)
  filterProducts(products, filters = {}) {
    let filtered = [...products];
    
    // 검색어로 필터링
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term)
      );
    }
    
    // 카테고리로 필터링
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      );
    }
    
    // 재고 상태로 필터링
    if (filters.stockFilter) {
      if (filters.stockFilter === 'out') {
        filtered = filtered.filter(product => product.stock === 0);
      } else if (filters.stockFilter === 'low') {
        filtered = filtered.filter(product => 
          product.stock > 0 && product.stock <= 10
        );
      } else if (filters.stockFilter === 'normal') {
        filtered = filtered.filter(product => product.stock > 10);
      }
    }
    
    return filtered;
  },
  
  // 상품 정렬 (프론트엔드에서 수행)
  sortProducts(products, sortBy = 'name') {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock':
        return sorted.sort((a, b) => a.stock - b.stock);
      case 'date':
        return sorted.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
};

export default productService;