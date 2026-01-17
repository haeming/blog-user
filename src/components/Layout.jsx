import "../css/Layout.css"
import {Outlet} from "react-router-dom";

export default function Layout(){
    return (
        <div className="min-h-screen home-bg p-3">
            <div className="w-full mx-auto px-0 md:px-4 md:max-w-4xl md:pt-20">
                <Outlet/>
            </div>
        </div>
    );
}