"use client";

import React from "react";
import { FiHelpCircle } from "react-icons/fi";

/**
 * 도움말 툴팁 컴포넌트
 * 물음표 아이콘과 호버 시 나타나는 설명 텍스트 제공
 */
export default function HelpTooltip({ 
  text, 
  position = "bottom",
  width = "w-48",
  iconClass = "text-gray-400 hover:text-gray-600",
  tooltipClass = ""
}) {
  // 툴팁 위치 설정
  const positionClasses = {
    bottom: "left-0 top-full mt-1",
    top: "left-0 bottom-full mb-1",
    left: "right-full mr-1 top-0",
    right: "left-full ml-1 top-0"
  };

  const positionClass = positionClasses[position] || positionClasses.bottom;

  return (
    <div className="relative inline-block ml-1 group">
      <FiHelpCircle className={iconClass} />
      <div className={`absolute ${positionClass} hidden group-hover:block bg-black text-white text-xs p-2 rounded ${width} z-10 ${tooltipClass}`}>
        {text}
      </div>
    </div>
  );
}