import { FiHelpCircle } from "react-icons/fi";

// 테이블 헤더 컴포넌트
const TableHeaderWithHelp = ({ title, helpText, align = "left" }) => {
  return (
    <th className={`p-3 text-${align}`}>
      <div className="flex items-center">
        <span>{title}</span>
        {helpText && (
          <div className="relative ml-1 group">
            <FiHelpCircle className="text-gray-400 hover:text-gray-600" />
            <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
              {helpText}
            </div>
          </div>
        )}
      </div>
    </th>
  );
};

export default TableHeaderWithHelp;