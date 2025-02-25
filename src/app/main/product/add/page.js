
// app/main/product/add/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/common/Toast";
import FormSection from "@/components/common/FormSection";
import ImageUploader from "@/components/common/ImageUploader";
import CategorySelector from "@/components/products/CategorySelector";
import PriceInput from "@/components/common/PriceInput";
import RichTextEditor from "@/components/common/RichTextEditor";
import ProductOptionManager from "@/components/products/ProductOptionManager";
import NutritionInfoInput from "@/components/products/NutritionInfoInput";
import productService from "@/services/productService";

export default function AddProductPage() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 초기 상품 데이터
  const initialProductData = {
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    images: [],
    origin: "국내산",
    nutritionInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    storageMethod: "",
    expiration: "",
    specification: "",
    salesStatus: "판매중",
    discount: {
      rate: 0,
      startDate: null,
      endDate: null
    },
    shippingFee: 0,
    purchaseLimit: 0,
    options: []
  };
  
  const [productData, setProductData] = useState(initialProductData);
  
  // 상품 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  
  // 중첩된 객체 업데이트 핸들러
  const handleNestedChange = (group, field, value) => {
    setProductData({
      ...productData,
      [group]: {
        ...productData[group],
        [field]: value
      }
    });
  };
  
  // 상품 저장 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!productData.name || !productData.category || productData.price <= 0) {
      showToast("상품명, 카테고리, 가격은 필수 입력 항목입니다.", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // API 호출하여 상품 저장
      const result = await productService.createProduct(productData);
      
      showToast("상품이 성공적으로 등록되었습니다.", "success");
      
      // 3초 후 상품 목록 페이지로 이동
      setTimeout(() => {
        router.push("/main/product");
      }, 3000);
    } catch (error) {
      console.error("상품 등록 오류:", error);
      showToast("상품 등록 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 토스트 메시지 표시 함수
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Toast {...toast} onClose={() => setToast({ show: false, message: "", type: "" })} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 등록</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <FormSection title="기본 정보" description="상품의 기본 정보를 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
              <CategorySelector
                value={productData.category}
                onChange={(value) => setProductData({ ...productData, category: value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
              <PriceInput
                value={productData.price}
                onChange={(value) => setProductData({ ...productData, price: value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">원산지</label>
              <input
                type="text"
                name="origin"
                value={productData.origin}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">판매 상태</label>
              <select
                name="salesStatus"
                value={productData.salesStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="판매중">판매중</option>
                <option value="품절">품절</option>
                <option value="판매중지">판매중지</option>
                <option value="입고예정">입고예정</option>
              </select>
            </div>
          </div>
        </FormSection>
        
        {/* 상품 이미지 섹션 */}
        <FormSection title="상품 이미지" description="상품 이미지를 업로드하세요.">
          <ImageUploader
            images={productData.images}
            onChange={(images) => setProductData({ ...productData, images })}
            maxImages={5}
          />
        </FormSection>
        
        {/* 상품 설명 섹션 */}
        <FormSection title="상품 설명" description="상품에 대한 상세한 설명을 입력하세요.">
          <RichTextEditor
            value={productData.description}
            onChange={(value) => setProductData({ ...productData, description: value })}
          />
        </FormSection>
        
        {/* 상품 옵션 섹션 */}
        <FormSection title="상품 옵션" description="고객이 선택할 수 있는 옵션을 설정하세요.">
          <ProductOptionManager
            options={productData.options}
            onChange={(options) => setProductData({ ...productData, options })}
          />
        </FormSection>
        
        {/* 영양 정보 섹션 */}
        {/* <FormSection title="영양 정보" description="상품의 영양 정보를 입력하세요.">
          <NutritionInfoInput
            value={productData.nutritionInfo}
            onChange={(value) => setProductData({ ...productData, nutritionInfo: value })}
          />
        </FormSection> */}
        
        {/* 추가 정보 섹션 */}
        {/* <FormSection title="추가 정보" description="상품의 추가 정보를 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보관 방법</label>
              <textarea
                name="storageMethod"
                value={productData.storageMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">유통기한/신선도 정보</label>
              <textarea
                name="expiration"
                value={productData.expiration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">상세 규격</label>
              <textarea
                name="specification"
                value={productData.specification}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
          </div>
        </FormSection> */}
        
        {/* 판매 정보 섹션 */}
        <FormSection title="판매 정보" description="상품의 판매 관련 정보를 입력하세요.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">할인율 (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={productData.discount.rate}
                onChange={(e) => handleNestedChange('discount', 'rate', parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송비</label>
              <input
                type="number"
                min="0"
                name="shippingFee"
                value={productData.shippingFee}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">구매 제한 수량 (0: 제한없음)</label>
              <input
                type="number"
                min="0"
                name="purchaseLimit"
                value={productData.purchaseLimit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">할인 시작일</label>
                <input
                  type="date"
                  value={productData.discount.startDate || ''}
                  onChange={(e) => handleNestedChange('discount', 'startDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">할인 종료일</label>
                <input
                  type="date"
                  value={productData.discount.endDate || ''}
                  onChange={(e) => handleNestedChange('discount', 'endDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </FormSection>
        
        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '저장 중...' : '상품 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}