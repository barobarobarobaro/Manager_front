export default function ProductPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">상품 조회 / 수정</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">상품명</th>
                        <th className="border p-2">가격</th>
                        <th className="border p-2">재고</th>
                        <th className="border p-2">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">예제 상품 1</td>
                        <td className="border p-2">₩10,000</td>
                        <td className="border p-2">50개</td>
                        <td className="border p-2">
                            <button className="px-2 py-1 bg-blue-500 text-white rounded">수정</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}