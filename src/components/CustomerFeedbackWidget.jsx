import React from "react";

export default function CustomerFeedbackWidget({ title }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-gray-500 mt-2">고객 피드백 데이터를 여기에 표시할 예정</p>
        </div>
    );
}