import "../css/TopBar.css"
import {useState} from "react";

export default function TopBar(){
    const [open, setOpen] = useState(false);

    return(
        <>
            <header className="top-bg">
                <div className="top-inner">
                    <div className="logo">HOME</div>

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