// components/products/ProductTableRow.js
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import Link from "next/link";

export default function ProductTableRow({
  product,
  isSelected,
  isEditing,
  editData,
  onToggleSelect,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onEditChange
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
        />
      </td>
      <td className="p-3 font-medium">
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => onEditChange(e, 'name')}
            className="w-full p-1 border rounded"
          />
        ) : (
          <Link
            href={`/admin/product/detail/${product.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {product.name}
          </Link>
        )}
      </td>
      <td className="p-3">
        {isEditing ? (
          <select
            value={editData.category}
            onChange={(e) => onEditChange(e, 'category')}
            className="w-full p-1 border rounded"
          >
            <option value="과일">과일</option>
            <option value="채소">채소</option>
            <option value="허브">허브</option>
            <option value="수입과일">수입과일</option>
          </select>
        ) : (
          product.category
        )}
      </td>
      <td className="p-3">
        {isEditing ? (
          <input
            type="number"
            value={editData.price}
            onChange={(e) => onEditChange(e, 'price')}
            className="w-full p-1 border rounded"
          />
        ) : (
          `₩${product.price.toLocaleString()}`
        )}
      </td>
      <td className="p-3">
        {isEditing ? (
          <input
            type="number"
            value={editData.stock}
            onChange={(e) => onEditChange(e, 'stock')}
            className="w-full p-1 border rounded"
          />
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.stock === 0 ? 'bg-red-100 text-red-800' :
            product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {product.stock === 0 ? '품절' :
             product.stock <= 10 ? `${product.stock}개 (부족)` :
             `${product.stock}개`}
          </span>
        )}
      </td>
      <td className="p-3 text-sm text-gray-600">
        {product.created}
      </td>
      <td className="p-3">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onSaveEditing(product.id)}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            >
              <FiSave className="inline mr-1" /> 저장
            </button>
            <button
              onClick={onCancelEditing}
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
            >
              <FiX className="inline mr-1" /> 취소
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onStartEditing(product)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <FiEdit className="inline mr-1" /> 수정
            </button>
            <Link
              href={`/admin/product/detail/${product.id}`}
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm inline-block"
            >
              상세
            </Link>
          </div>
        )}
      </td>
    </tr>
  );
}