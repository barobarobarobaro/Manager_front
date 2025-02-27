// components/common/Pagination.js
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  startIndex = 0,
  endIndex = 0,
  maxPageButtons = 5
}) => {
  if (totalPages <= 1) return null;

  // 표시할 페이지 버튼 범위 계산
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // 표시 범위가 maxPageButtons보다 작으면 조정
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  // 페이지 버튼 배열 생성
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 p-3 bg-white rounded-lg shadow">
      {/* 페이지 정보 */}
      <div className="mb-3 md:mb-0 text-sm text-gray-600">
        전체 {totalItems}개 중 {startIndex + 1}-{endIndex}
      </div>
      
      {/* 페이지 버튼 */}
      <div className="flex space-x-1">
        {/* 이전 페이지 버튼 */}
        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600 disabled:bg-gray-100 disabled:text-gray-400"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>
        
        {/* 첫 페이지 버튼 (첫 페이지가 표시 범위 밖일 때) */}
        {startPage > 1 && (
          <>
            <button
              className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-3 py-1 text-gray-500">...</span>
            )}
          </>
        )}
        
        {/* 페이지 번호 버튼 */}
        {pageButtons.map(page => (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-800'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {/* 마지막 페이지 버튼 (마지막 페이지가 표시 범위 밖일 때) */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-1 text-gray-500">...</span>
            )}
            <button
              className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* 다음 페이지 버튼 */}
        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-gray-600 disabled:bg-gray-100 disabled:text-gray-400"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;