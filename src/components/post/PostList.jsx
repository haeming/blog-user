import {useEffect, useMemo, useState} from "react";
import postApi from "../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostList.css";
import useNaviService from "../../hooks/useNaviService.js";

// 게시판 페이지(/posts)에서 사용하는 전체 목록 컴포넌트 (페이징 포함)
export default function PostList(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [sort] = useState("createdAt,desc");
    const [totalPages, setTotalPages] = useState(0);

    const naviService = useNaviService();

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

    if (!posts.length) return <div className="post-list-empty">게시글이 없습니다.</div>;

    // 페이지 번호 배열 생성 (현재 페이지 기준 앞뒤 2개씩)
    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(0, page - 2);
        const endPage = Math.min(totalPages - 1, page + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="post-list-container">
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    onClick={() => {
                        naviService.goToPost(post.id)
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