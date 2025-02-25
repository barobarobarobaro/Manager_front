// components/common/Pagination.js
export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex
  }) {
    // 페이지 번호 배열 생성 로직
    const getPageNumbers = () => {
      const pageNumbers = [];
      
      if (totalPages <= 5) {
        // 5페이지 이하면 모든 페이지 표시
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage <= 3) {
        // 현재 페이지가 앞쪽이면 1~5 표시
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // 현재 페이지가 뒤쪽이면 마지막 5개 표시
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 현재 페이지 중심으로 표시
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
      
      return pageNumbers;
    };
  
    return (
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          총 {totalItems}개 항목 중 {startIndex + 1}-{endIndex}개 표시
        </div>
  
        <div className="flex flex-wrap justify-center gap-1">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
  
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              className={`px-3 py-1 border rounded ${
                currentPage === pageNum 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
  
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    );
  }