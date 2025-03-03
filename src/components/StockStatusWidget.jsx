"use client";
import Link from "next/link";
import React, { useRef } from "react";
import ImageOrIcon from "./common/ImageOrIcon";

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
                    <Link href="/admin/product/list">
                    상품 조회 및 수정
                    </Link>
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
                                
                                <ImageOrIcon
                                    src={item.icon}
                                    alt={item.name}
                                    className=" mx-auto mt-2"
                                    iconColor="#999"
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