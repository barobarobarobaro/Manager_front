// components/table/ResponsiveTable.js
"use client";
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ResponsiveTable = ({
  headers = [],
  data = [],
  onRowClick = () => {},
  renderMobileCard = null,
  renderStatus = null,
  renderAction = null,
  emptyMessage = "표시할 데이터가 없습니다.",
  keyField = "id"
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트와 동시에 클라이언트 사이드 처리
  useEffect(() => {
    setMounted(true);
    setViewportWidth(window.innerWidth);

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 행 확장 토글
  const toggleRowExpand = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  // 마운트 전이거나 SSR 중이면 빈 컨테이너 반환
  if (!mounted) {
    return <div className="bg-white rounded-lg shadow min-h-[100px]"></div>;
  }

  // 반응형 결정 (768px 기준)
  const isDesktop = viewportWidth >= 768;

  return (
    <div className="bg-white rounded-lg shadow">
      {isDesktop ? (
        // 데스크톱 테이블 뷰
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${header.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr 
                    key={row[keyField]} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick(row)}
                  >
                    {headers.map((header, index) => (
                      <td 
                        key={index} 
                        className={`px-6 py-4 whitespace-nowrap ${header.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        {header.field === 'status' && renderStatus ? (
                          renderStatus(row[header.field])
                        ) : header.field === 'action' && renderAction ? (
                          renderAction(row)
                        ) : header.render ? (
                          header.render(row)
                        ) : (
                          row[header.field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-10 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // 모바일 카드 뷰
        <div>
          {data.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.map((row) => (
                <li key={row[keyField]} className="p-4">
                  {renderMobileCard ? (
                    // 커스텀 모바일 카드 렌더링
                    renderMobileCard(row, {
                      isExpanded: expandedRows.includes(row[keyField]),
                      toggleExpand: () => toggleRowExpand(row[keyField])
                    })
                  ) : (
                    // 기본 모바일 카드 레이아웃
                    <div>
                      <div 
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleRowExpand(row[keyField])}
                      >
                        {/* 기본 요약 정보 */}
                        <div className="flex-1">
                          {headers[0] && (
                            <div className="font-medium text-blue-600">
                              {headers[0].render ? headers[0].render(row) : row[headers[0].field]}
                            </div>
                          )}
                          {headers[1] && (
                            <div className="text-sm text-gray-600">
                              {headers[1].render ? headers[1].render(row) : row[headers[1].field]}
                            </div>
                          )}
                        </div>

                        {/* 상태 및 토글 버튼 */}
                        <div className="flex items-center">
                          {headers.find(h => h.field === 'status') && renderStatus && (
                            <div className="mr-2">
                              {renderStatus(row.status)}
                            </div>
                          )}
                          {expandedRows.includes(row[keyField]) ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* 확장된 세부 정보 */}
                      {expandedRows.includes(row[keyField]) && (
                        <div className="mt-3 ml-2 pl-2 border-l-2 border-gray-200 space-y-2">
                          {headers.slice(2).map((header, index) => (
                            header.field !== 'status' && header.field !== 'action' && (
                              <div key={index} className="text-sm">
                                <span className="text-gray-500">{header.title}: </span>
                                <span className="font-medium">
                                  {header.render ? header.render(row) : row[header.field]}
                                </span>
                              </div>
                            )
                          ))}
                          {headers.find(h => h.field === 'action') && renderAction && (
                            <div className="mt-3 pt-2">
                              {renderAction(row)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;