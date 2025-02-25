"use client";

import React, { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart() {
    
  // ---------------------------
  // 1) 샘플: 지난 2주치 데이터 생성
  // ---------------------------
  const [dailySalesData] = useState(() => {
    const today = new Date();
    const data = [];
    // 2주(14일) 전부터 오늘까지
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i)); // 과거부터 오늘 순서대로
      data.push({
        date: d.toISOString().split("T")[0], // 'YYYY-MM-DD' 형태
        amount: Math.floor(Math.random() * 9000) + 1000, // 1000~9999 랜덤 매출
      });
    }
    return data;
  });

  // ---------------------------
  // 2) 일/주/월 뷰 모드 관리
  // ---------------------------
  const [viewMode, setViewMode] = useState("day"); // "day" | "week" | "month"

  // ---------------------------
  // 3) 데이터 집계 함수
  // ---------------------------
  // 일(Day) 모드: 매일 표시
  // 주(Week) 모드: 요일을 주 단위로 합산
  // 월(Month) 모드: 월 단위로 합산
  function aggregateDataByWeek(data) {
    // 예: '2023-09-01' ~ '2023-09-14'를 ISO 주차 단위로 그룹
    // 여기서는 간단히 "주차"가 아니라 "월/일" 범위를 직접 지정하거나
    // Date.getWeek() 로직을 커스텀해도 됨
    const result = {};
    data.forEach((item) => {
      const dateObj = new Date(item.date);
      // 주 식별자 (연도-주차)
      const year = dateObj.getFullYear();
      // JS에는 기본 getWeek()가 없으니, 간단히 "년 + (월 + 일)" 정도로 임시 그룹화
      // 실제론 dayjs나 date-fns의 getWeek를 쓰는 걸 권장
      const month = dateObj.getMonth(); // 0~11
      const day = dateObj.getDate();    // 1~31
      // 임시로 "year-month-(day/7)" 정도로 그룹화
      const weekKey = `${month}월-${Math.floor(day / 7)}주차`;

      if (!result[weekKey]) {
        result[weekKey] = 0;
      }
      result[weekKey] += item.amount;
    });

    // { "2023-8-0": 15000, "2023-8-1": 23000, ... } 형태
    // 키를 날짜 문자열로 변환해서 정렬
    const labels = Object.keys(result).sort();
    const amounts = labels.map((key) => result[key]);

    return { labels, amounts };
  }

  function aggregateDataByMonth(data) {
    const result = {};
    data.forEach((item) => {
      const dateObj = new Date(item.date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // 1~12
      const key = `${year}-${month < 10 ? "0" + month : month}`; // 예: "2023-09"

      if (!result[key]) {
        result[key] = 0;
      }
      result[key] += item.amount;
    });

    const labels = Object.keys(result).sort();
    const amounts = labels.map((key) => result[key]);

    return { labels, amounts };
  }

  // ---------------------------
  // 4) 뷰 모드별 데이터 변환
  // ---------------------------
  const { labels, amounts } = useMemo(() => {
    if (viewMode === "day") {
      // 일별 그대로
      const sorted = [...dailySalesData].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      return {
        labels: sorted.map((d) => d.date),
        amounts: sorted.map((d) => d.amount),
      };
    } else if (viewMode === "week") {
      return aggregateDataByWeek(dailySalesData);
    } else {
      // month
      return aggregateDataByMonth(dailySalesData);
    }
  }, [dailySalesData, viewMode]);

  // ---------------------------
  // 5) 차트 옵션 및 데이터
  // ---------------------------
  const data = {
    labels,
    datasets: [
      {
        label: "매출",
        data: amounts,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "최근 2주 매출 추이",
      },
    },
  };

  // ---------------------------
  // 6) 렌더링
  // ---------------------------
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      {/* 일/주/월 토글 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("day")}
          className={`px-4 py-2 rounded ${
            viewMode === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          일
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`px-4 py-2 rounded ${
            viewMode === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          주
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded ${
            viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          월
        </button>
      </div>

      {/* 차트 영역 (높이 설정) */}
      <div style={{ height: "400px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}