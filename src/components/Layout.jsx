import "../css/Layout.css"
import {Outlet} from "react-router-dom";

export default function Layout(){
    return (
        <div className="home-bg w-full">
            <div className="w-full md:max-w-4xl mx-auto px-0 md:px-4">
                <Outlet/>
            </div>
        </div>
    );
}