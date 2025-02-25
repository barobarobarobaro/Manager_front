// components/products/ProductOptionManager.js
import { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function ProductOptionManager({ options = [], onChange }) {
  // 새 옵션 추가 상태
  const [newOption, setNewOption] = useState({ name: '', values: [], affectsPrice: true });
  const [newValue, setNewValue] = useState({ name: '', priceModifier: 0 });
  
  // 옵션 추가
  const addOption = () => {
    if (!newOption.name) return;
    
    const updatedOptions = [...options, { ...newOption, id: Date.now() }];
    onChange(updatedOptions);
    setNewOption({ name: '', values: [], affectsPrice: true });
  };
  
  // 옵션 삭제
  const removeOption = (optionId) => {
    const updatedOptions = options.filter(option => option.id !== optionId);
    onChange(updatedOptions);
  };
  
  // 옵션 값 추가
  const addOptionValue = (optionId) => {
    if (!newValue.name) return;
    
    const updatedOptions = options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: [...option.values, { ...newValue, id: Date.now() }]
        };
      }
      return option;
    });
    
    onChange(updatedOptions);
    setNewValue({ name: '', priceModifier: 0 });
  };
  
  // 옵션 값 삭제
  const removeOptionValue = (optionId, valueId) => {
    const updatedOptions = options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: option.values.filter(value => value.id !== valueId)
        };
      }
      return option;
    });
    
    onChange(updatedOptions);
  };
  
  // 옵션 가격 영향 여부 변경
  const toggleAffectsPrice = (optionId) => {
    const updatedOptions = options.map(option => {
      if (option.id === optionId) {
        return { ...option, affectsPrice: !option.affectsPrice };
      }
      return option;
    });
    
    onChange(updatedOptions);
  };
  
  return (
    <div>
      {/* 등록된 옵션 목록 */}
      {options.length > 0 ? (
        <div className="space-y-4 mb-4">
          {options.map(option => (
            <div key={option.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-medium">{option.name}</h3>
                  <div className="flex items-center mt-1">
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={option.affectsPrice}
                        onChange={() => toggleAffectsPrice(option.id)}
                        className="mr-1"
                      />
                      가격에 영향
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              {/* 옵션 값 목록 */}
              <div className="space-y-2 mb-3">
                {option.values.map(value => (
                  <div key={value.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>{value.name}</div>
                    {option.affectsPrice && (
                      <div>
                        {value.priceModifier > 0 ? '+' : ''}{value.priceModifier.toLocaleString()}원
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeOptionValue(option.id, value.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 새 옵션 값 추가 */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="새 옵션 값"
                  value={newValue.name}
                  onChange={(e) => setNewValue({ ...newValue, name: e.target.value })}
                  className="flex-1 p-2 border rounded"
                />
                {option.affectsPrice && (
                  <input
                    type="number"
                    placeholder="가격 조정"
                    value={newValue.priceModifier}
                    onChange={(e) => setNewValue({ ...newValue, priceModifier: parseInt(e.target.value) || 0 })}
                    className="w-28 p-2 border rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() => addOptionValue(option.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border rounded-lg bg-gray-50">
          <p className="text-gray-500">등록된 옵션이 없습니다. 새 옵션을 추가해주세요.</p>
        </div>
      )}
      
      {/* 새 옵션 추가 */}
      <div className="mt-4 border-t pt-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">옵션 이름</label>
            <input
              type="text"
              placeholder="사이즈, 색상 등"
              value={newOption.name}
              onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={addOption}
            disabled={!newOption.name}
            className={`px-4 py-2 rounded ${
              !newOption.name 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <FiPlus className="inline mr-1" /> 옵션 추가
          </button>
        </div>
      </div>
    </div>
  );
}