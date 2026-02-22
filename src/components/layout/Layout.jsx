import "./Layout.css"
import "./SideBar.css"
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import SideBar from "./SideBar.jsx";
import {useState} from "react";

export default function Layout(){
    const [sideOpen, setSideOpen] = useState(false);

    return (
        <div className="min-h-screen home-bg">
            {/* 모바일 블러 바 */}
            <div className="mobile-blur-bar" />

            {/*<TopBar/>*/}

            {/* 모바일 버튼 (md 미만에서만 표시) */}
            <div className="md:hidden fixed top-3 left-3 z-50">
                <button
                    onClick={() => setSideOpen(true)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300"
                >
                    <img src="/newlogo2.jpg" alt="profile" className="w-full h-full object-cover"/>
                </button>
            </div>

            {/* 모바일 오버레이 */}
            {sideOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={() => setSideOpen(false)}
                />
            )}

            {/* 모바일 슬라이드 사이드바 */}
            <aside className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 bg-white
                ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button onClick={() => setSideOpen(false)} className="absolute top-3 right-3 text-gray-500">✕</button>
                <SideBar/>
            </aside>

            {/* 콘텐츠 영역 */}
            <div className="w-full md:flex content-area">

                {/* 데스크탑 사이드바 */}
                <aside className="w-64 hidden side-bg side-position md:block">
                    <SideBar/>
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="flex-1 flex justify-center p-3 md:px-4">
                    <div className="w-full max-w-6xl">
                        <Outlet/>
                    </div>
                </main>

            </div>
        </div>
    );
}
