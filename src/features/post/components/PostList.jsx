import { useEffect, useMemo, useRef, useState } from "react";
import postApi from "../../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostList.css";
import useNaviService from "../../../hooks/useNaviService.js";
import { useNavigationType } from "react-router-dom";
import useScrollRestore from "../../../utils/useScrollRestore.js"

export default function PostList() {
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const [size] = useState(10);
    const [sort] = useState("createdAt,desc");
    const [totalPages, setTotalPages] = useState(0);
    const naviService = useNaviService();
    const navigationType = useNavigationType();

    const { savedScroll, savedPage, savePage, clear } = useScrollRestore('post-list');

    // POP(뒤로가기)이면 복원, 아니면 0부터
    const isBack = navigationType === 'POP';
    const [page, setPage] = useState(isBack ? savedPage : 0);
    const shouldRestoreRef = useRef(isBack && savedScroll > 0);
    const restoredRef = useRef(false);

    useEffect(() => {
        if (!isBack) clear();
    }, []);

    useEffect(() => {
        const postList = async () => {
            try {
                const response = await getPosts(page, size, sort);

                // 페이지 범위 보정
                if (page >= response.totalPages && response.totalPages > 0) {
                    setPage(response.totalPages - 1);
                    return;
                }

                setPosts(response.content || []);
                setTotalPages(response.totalPages || 0);
            } catch (e) {
                console.error("postList 불러오기 에러", e);
            }
        };
        postList();
    }, [page, size, sort, getPosts]);

    // 스크롤 복원: posts가 로드되고 아직 복원 안 했을 때
    useEffect(() => {
        if (!shouldRestoreRef.current) return;
        if (!posts.length) return;
        if (restoredRef.current) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, savedScroll);
                restoredRef.current = true;
                shouldRestoreRef.current = false;
            });
        });
    }, [posts]);

    const handlePageChange = (nextPage) => {
        shouldRestoreRef.current = false;
        savePage(nextPage);
        setPage(nextPage);
        window.scrollTo(0, 0);
    };

    if (!posts.length) return <div className="post-list-empty">게시글이 없습니다.</div>;

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) pages.push(i);
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
                        savePage(page);
                        naviService.goToPost(post.id);
                    }}
                />
            ))}

            <div className="post-list-pagination">
                <button onClick={() => handlePageChange(0)} disabled={page === 0} className="pagination-btn-first">««</button>
                <button onClick={() => handlePageChange(Math.max(0, page - 1))} disabled={page === 0} className="pagination-btn-prev">‹</button>
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn-number ${page === pageNum ? 'active' : ''}`}
                    >
                        {pageNum + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1} className="pagination-btn-next">›</button>
                <button onClick={() => handlePageChange(totalPages - 1)} disabled={page >= totalPages - 1} className="pagination-btn-last">»»</button>
            </div>
        </div>
    );
}