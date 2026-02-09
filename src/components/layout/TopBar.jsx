import "./TopBar.css"
import {useState} from "react";
import useNaviService from "../../hooks/useNaviService.js";

export default function TopBar(){
    const [open, setOpen] = useState(false);
    const naviService = useNaviService();

    return(
        <>
            <header className="top-bg">
                <div className="top-inner">
                    <div className="top-home" onClick={naviService.goToHome}>HOME</div>

                    <nav className="menu">
                        <span>ABOUT</span>
                        <span>POST</span>
                    </nav>

                    <button className="hamburger" onClick={() => setOpen(!open)}>
                        ☰
                    </button>

                    {open && (
                        <div className="mobile-menu">
                            <span>ABOUT</span>
                            <span>POST</span>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}