import Image from "next/image";
// app/page.js
import { redirect } from "next/navigation";


export default function Home() {
  redirect("/login");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      잘못된 접근입니다.
    </div>
  );
}
