import {useEffect, useMemo, useRef, useState} from "react";
import postApi from "../../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostList.css";
import useNaviService from "../../../hooks/useNaviService.js";
import {useLocation, useNavigate, useNavigationType} from "react-router-dom";

// 게시판 페이지(/posts)에서 사용하는 전체 목록 컴포넌트 (페이징 포함)
export default function PostList(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const isPopNavigation = navigationType === "POP";
    const restoreEligible = location.state?.restoreScroll
        || sessionStorage.getItem("postListRestoreEligible") === "1"
        || isPopNavigation;
    const initialPage = () => {
        const fromState = location.state?.page;
        return Number.isFinite(fromState) ? fromState : 0;
    };
    const [page, setPage] = useState(initialPage);
    const [size] = useState(10);
    const [sort] = useState("createdAt,desc");
    const [totalPages, setTotalPages] = useState(0);

    const naviService = useNaviService();
    const savedScrollRef = useRef(location.state?.scrollY ?? 0);
    const shouldRestoreScrollRef = useRef(Boolean(location.state?.restoreScroll));
    const prevPageRef = useRef(page);

    useEffect(() => {
        const navEntry = performance.getEntriesByType("navigation")[0];
        const isReload = navEntry?.type === "reload" || performance.navigation?.type === 1;
        if (!isReload) return;
        sessionStorage.removeItem("postListRestoreEligible");
        sessionStorage.removeItem("postListScrollY");
        shouldRestoreScrollRef.current = false;
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });
    }, []);

    useEffect(() => {
        const postList = async() => {
            try{
                const response = await getPosts(page, size, sort);
                console.log(response);
                setPosts(response.content || []);
                setTotalPages(response.totalPages || 0);
            }catch(e){
                console.error("postList 불러오기 에러", e);
            }
        }
        postList();
    }, [page, size, sort, getPosts]);

    useEffect(() => {
        if (prevPageRef.current === page) return;
        if (shouldRestoreScrollRef.current) {
            prevPageRef.current = page;
            return;
        }
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });
        prevPageRef.current = page;
    }, [page]);

    useEffect(() => {
        if (!shouldRestoreScrollRef.current) return;
        if (!posts.length) return;

        // requestAnimationFrame 한 번으로는 DOM 반영이 안 될 수 있어서 두 번 중첩
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, savedScrollRef.current);
                shouldRestoreScrollRef.current = false;
            });
        });
    }, [posts]);

    const handlePageChange = (nextPage) => {
        shouldRestoreScrollRef.current = false;
        sessionStorage.removeItem("postListRestoreEligible");
        sessionStorage.removeItem("postListScrollY");
        setPage(nextPage);
    };

    if (!posts.length) return <div className="post-list-empty">게시글이 없습니다.</div>;

    // 페이지 번호 배열 생성 (현재 페이지 기준 앞뒤 2개씩)
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="post-list-container">
            <div className="post-list-preview-header">
                <h1 className="post-list-preview-title">전체 글</h1>
            </div>
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    onClick={() => {
                        const scrollY = window.scrollY || 0;
                        // 현재 /posts history entry에 state를 저장
                        navigate("/posts", {
                            state: { page, scrollY, restoreScroll: true },
                            replace: true  // 현재 entry를 교체
                        });
                        naviService.goToPost(post.id);
                    }}
                />
            ))}

            <div className="post-list-pagination">
                <button
                    onClick={() => handlePageChange(0)}
                    disabled={page === 0}
                    className="pagination-btn-first"
                >
                    ««
                </button>
                <button
                    onClick={() => handlePageChange(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="pagination-btn-prev"
                >
                    ‹
                </button>

                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn-number ${page === pageNum ? 'active' : ''}`}
                    >
                        {pageNum + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="pagination-btn-next"
                >
                    ›
                </button>
                <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className="pagination-btn-last"
                >
                    »»
                </button>
            </div>
        </div>
    );
}
