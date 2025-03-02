'use client';
import Header from '@/components/user/common/Header';
import Footer from '@/components/user/common/Footer';

// 레이아웃 컴포넌트: 전체 앱에 ProductProvider 적용
export default function RootLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}