// components/common/ImageUploader.js
import { useState, useRef } from 'react';
import { FiPlus, FiX, FiImage, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function ImageUploader({ images = [], onChange, maxImages = 5 }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  
  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    addImages(files);
  };
  
  // 파일 추가 로직
  const addImages = (files) => {
    if (images.length >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }
    
    const newImages = [...images];
    const remainingSlots = maxImages - newImages.length;
    
    Array.from(files).slice(0, remainingSlots).forEach(file => {
      // 실제 업로드 대신 URL 생성
      const imageUrl = URL.createObjectURL(file);
      newImages.push({
        url: imageUrl,
        file: file,
        name: file.name
      });
    });
    
    onChange(newImages);
  };
  
  // 이미지 삭제
  const removeImage = (index) => {
    const newImages = [...images];
    // URL.revokeObjectURL로 메모리 누수 방지
    if (newImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newImages[index].url);
    }
    newImages.splice(index, 1);
    onChange(newImages);
  };
  
  // 이미지 순서 변경
  const moveImage = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };
  
  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };
  
  return (
    <div>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        
        <div className="flex flex-col items-center justify-center">
          <FiImage className="w-10 h-10 text-gray-400 mb-2" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">클릭</span>하거나 이미지를 여기에 드래그하세요
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 {maxImages}개)</p>
          
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={images.length >= maxImages}
          >
            <FiPlus className="inline mr-1" /> 이미지 추가
          </button>
        </div>
      </div>
      
      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative border rounded-lg overflow-hidden">
              <img 
                src={image.url} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-40 object-cover"
              />
              
              <div className="absolute top-0 right-0 p-1">
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <FiX size={14} />
                </button>
              </div>
              
              <div className="absolute bottom-0 right-0 p-1 flex">
                <button 
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className={`w-6 h-6 rounded-full mr-1 flex items-center justify-center ${
                    index === 0 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'
                  }`}
                >
                  <FiArrowUp size={14} />
                </button>
                <button 
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index === images.length - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'
                  }`}
                >
                  <FiArrowDown size={14} />
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.name || `이미지 ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}