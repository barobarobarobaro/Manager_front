'use client';
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      // 만약 이전 페이지가 없으면 홈으로 이동
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-300 p-6">
      <h1 className="text-8xl font-extrabold text-white animate-bounce">
        404
      </h1>
      <p className="mt-4 text-2xl text-white">어머, 길을 잃으셨네요!</p>
      <p className="mt-2 text-lg text-center text-white opacity-75">
        요청하신 페이지는 없는 것 같아요. <br />
        열심히 준비해볼게요!
      </p>
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          이전 페이지로
        </button>
      </div>
    </div>
  );
}