import "../css/Home.css"

export default function Home(){
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                    <img
                        src="/guest_tab_logo.png"
                        className="
                        w-full
                        max-w-[240px]
                        mx-auto
                        md:max-w-none
                        object-contain
                    "
                        alt="HaemCake"/>
                </div>
                <div className="md:col-span-9 home-chat-bg my-auto">
                    <p>환영합니다!</p>
                    <p><span className="home-text-blog-info">HaemCake blog</span> 입니다.</p>
                    <p>
                        실제
                        <span className="home-text-bold"> 서비스에서 마주한 문제</span>
                        들과
                        <span className="home-text-bold"> 성장하는 기록</span>
                        들을 남깁니다.
                        <span className="home-text-bold">(=^o^=)</span>
                    </p>
                </div>
            </div>
        </>
    )
}