"use client";

import React, { useRef } from "react";

export default function StockStatusWidget({ title, items }) {
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= 200;
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += 200;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                    상품 조회 및 수정
                </button>
            </div>

            {/* 좌우 스크롤 영역 */}
            <div className="relative">
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-10"
                >
                    ◀
                </button>

                <div ref={scrollContainerRef} className="overflow-x-auto w-full">
                    <div className="flex space-x-4">
                        {items.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-100 p-4 rounded-lg shadow-md flex-shrink-0 w-40 sm:w-48"
                            >
                                <img 
                                    src={item.image || "https://source.unsplash.com/150x150/?fruit"} 
                                    alt={item.name} 
                                    className="w-full h-24 sm:h-32 object-cover rounded"
                                />
                                <h3 className="text-lg font-medium mt-2 text-center">{item.name}</h3>
                                <p className="text-gray-700 text-center">재고: {item.stock}개</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-10"
                >
                    ▶
                </button>
            </div>
        </div>
    );
}