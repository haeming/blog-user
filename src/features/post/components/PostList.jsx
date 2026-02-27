import {useEffect, useMemo, useRef, useState} from "react";
import postApi from "../../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostList.css";
import useNaviService from "../../../hooks/useNaviService.js";
import {useLocation} from "react-router-dom";

// 게시판 페이지(/posts)에서 사용하는 전체 목록 컴포넌트 (페이징 포함)
export default function PostList(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const initialPage = () => {
        const fromState = location.state?.page;
        if (Number.isFinite(fromState)) return fromState;
        const fromStorage = Number(sessionStorage.getItem("postListPage"));
        return Number.isFinite(fromStorage) ? fromStorage : 0;
    };
    const [page, setPage] = useState(initialPage);
    const [size] = useState(10);
    const [sort] = useState("createdAt,desc");
    const [totalPages, setTotalPages] = useState(0);

    const naviService = useNaviService();
    const savedScrollRef = useRef(() => {
        const fromState = location.state?.scrollY;
        if (Number.isFinite(fromState)) return fromState;
        const fromStorage = Number(sessionStorage.getItem("postListScrollY"));
        return Number.isFinite(fromStorage) ? fromStorage : 0;
    });
    const shouldRestoreScrollRef = useRef(
        Boolean(location.state?.restoreScroll || sessionStorage.getItem("postListScrollY"))
    );

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
        sessionStorage.setItem("postListPage", String(page));
    }, [page]);

    useEffect(() => {
        if (!shouldRestoreScrollRef.current) return;
        if (!posts.length) return;
        const target = typeof savedScrollRef.current === "function"
            ? savedScrollRef.current()
            : savedScrollRef.current;
        requestAnimationFrame(() => {
            window.scrollTo(0, Math.max(0, target || 0));
        });
        shouldRestoreScrollRef.current = false;
    }, [posts.length]);

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
                        sessionStorage.setItem("postListScrollY", String(scrollY));
                        sessionStorage.setItem("postListPage", String(page));
                        naviService.goToPost(post.id, {
                            page,
                            scrollY,
                            restoreScroll: true
                        });
                    }}
                />
            ))}

            <div className="post-list-pagination">
                <button
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                    className="pagination-btn-first"
                >
                    ««
                </button>
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="pagination-btn-prev"
                >
                    ‹
                </button>

                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`pagination-btn-number ${page === pageNum ? 'active' : ''}`}
                    >
                        {pageNum + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages - 1}
                    className="pagination-btn-next"
                >
                    ›
                </button>
                <button
                    onClick={() => setPage(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className="pagination-btn-last"
                >
                    »»
                </button>
            </div>
        </div>
    );
}
