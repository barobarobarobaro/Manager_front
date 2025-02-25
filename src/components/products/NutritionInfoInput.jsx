// components/products/NutritionInfoInput.js
export default function NutritionInfoInput({ value, onChange }) {
    // 영양소 정보 변경 핸들러
    const handleChange = (nutrient, newValue) => {
      onChange({
        ...value,
        [nutrient]: newValue
      });
    };
    
    // 표시할 영양소 목록
    const nutrients = [
      { id: 'calories', name: '칼로리', unit: 'kcal' },
      { id: 'protein', name: '단백질', unit: 'g' },
      { id: 'carbs', name: '탄수화물', unit: 'g' },
      { id: 'sugar', name: '당류', unit: 'g' },
      { id: 'fat', name: '지방', unit: 'g' },
      { id: 'saturatedFat', name: '포화지방', unit: 'g' },
      { id: 'transFat', name: '트랜스지방', unit: 'g' },
      { id: 'cholesterol', name: '콜레스테롤', unit: 'mg' },
      { id: 'sodium', name: '나트륨', unit: 'mg' },
      { id: 'fiber', name: '식이섬유', unit: 'g' }
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nutrients.map(nutrient => (
          <div key={nutrient.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {nutrient.name} ({nutrient.unit})
            </label>
            <input
              type="number"
              min="0"
              step={nutrient.id === 'calories' ? '1' : '0.1'}
              value={value[nutrient.id] || 0}
              onChange={(e) => handleChange(nutrient.id, parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>
    );
  }