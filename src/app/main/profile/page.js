export default function ProfilePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">프로필 수정</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700">이름</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <div>
                    <label className="block text-gray-700">이메일</label>
                    <input type="email" className="w-full p-2 border border-gray-300 rounded" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    저장하기
                </button>
            </form>
        </div>
    );
}