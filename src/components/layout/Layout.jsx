import "./Layout.css"
import {Outlet} from "react-router-dom";
import TopBar from "./TopBar.jsx";

export default function Layout(){
    return (
        <div className="min-h-screen home-bg">
            <TopBar/>
            <div className="w-full mx-auto p-3 md:px-4 md:max-w-4xl md:pt-20">
                <Outlet/>
            </div>
        </div>
    );
}