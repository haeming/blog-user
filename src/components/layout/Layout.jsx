import "./Layout.css"
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import SideBar from "./SideBar.jsx";

export default function Layout(){
    return (
        <div className="min-h-screen home-bg">
            <TopBar/>

            {/* 콘텐츠 영역 */}
            <div className="w-full mx-auto md:max-w-6xl md:pt-20 flex">

                {/* 좌측 사이드바 */}
                <aside className="w-64 hidden md:block">
                    <SideBar/>
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="flex-1 p-3 md:px-4">
                    <Outlet/>
                </main>

            </div>
        </div>
    );
}
