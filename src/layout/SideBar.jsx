import "./SideBar.css"

export default function SideBar(){
    return(
        <>
            <div className="side-box">
                <img
                    src="/newlogo2.jpg"
                    className="
                        w-full
                        max-w-[240px]
                        mx-auto
                        md:max-w-none
                        object-contain
                        rounded-full
                        aspect-square
                        side-image-option
                    "
                    alt="HaemCake"/>
                <p className="side-name-text">
                    Haeming
                </p>
                <p className="side-email-text">goalsgoals0417@gmail.com</p>
            </div>
        </>
    )
}