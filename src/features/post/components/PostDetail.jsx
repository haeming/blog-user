import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import postApi from "../../../api/postApi.js";
import categoryApi from "../../../api/categoryApi.js";
import commentApi from "../../../api/commentApi.js";
import useNaviService from "../../../hooks/useNaviService.js";
import { formatDate } from "../../../utils/dateUtils.js";
import baseURL from "../../../config/apiBaseUrl.js";
import CommentSection from "./CommentSection.jsx";
import "./PostDetail.css";

// 🔧 이전/다음 글 API 미구현 — 완성 후 아래 DUMMY_ADJACENT 제거 후
//    주석 처리된 useEffect 블록을 활성화하세요
const DUMMY_ADJACENT = {
    prev: {
        id: "prev-001",
        title: "React에서 상태 관리를 효율적으로 하는 방법",
        excerpt: "useState, useReducer, Zustand 등 다양한 상태 관리 옵션을 비교하고, 프로젝트 규모에 따라 어떤 전략을 선택해야 할지 정리합니다.",
        createdAt: "2025-02-20T10:00:00",
    },
    next: {
        id: "next-001",
        title: "Tailwind CSS v4 마이그레이션 가이드",
        excerpt: "기존 v3 프로젝트를 v4로 업그레이드할 때 주의해야 할 Breaking Change와 새로운 유틸리티 클래스 사용법을 정리했습니다.",
        createdAt: "2025-03-01T10:00:00",
    },
};

export default function PostDetail() {
    const { id } = useParams();
    const { getPost }             = useMemo(() => postApi(), []);
    const { getCategoryByPostId } = useMemo(() => categoryApi(), []);
    const { getCommentsByPostId } = useMemo(() => commentApi(), []);

    const [post, setPost]                       = useState(null);
    const [categoryName, setCategoryName]       = useState("");
    const [loading, setLoading]                 = useState(true);
    const [error, setError]                     = useState(null);
    const [adjacent, setAdjacent]               = useState(DUMMY_ADJACENT); // 🔧 API 연동 시 { prev: null, next: null }
    const [comments, setComments]               = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const naviService = useNaviService();

    // 게시글 fetch
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await getPost(id);
                setPost(response);
            } catch (e) {
                console.error("게시글 불러오기 에러", e);
                setError("게시글을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, getPost]);

    // 댓글 fetch
    const refreshComments = () => {
        if (!id) return;
        setCommentsLoading(true);
        getCommentsByPostId(id)
            .then((data) => setComments(Array.isArray(data) ? data : []))
            .catch(() => setComments([]))
            .finally(() => setCommentsLoading(false));
    };

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        setCommentsLoading(true);
        getCommentsByPostId(id)
            .then((data) => { if (isMounted) setComments(Array.isArray(data) ? data : []); })
            .catch(() => { if (isMounted) setComments([]); })
            .finally(() => { if (isMounted) setCommentsLoading(false); });
        return () => { isMounted = false; };
    }, [id, getCommentsByPostId]);

    // ── 이전/다음 글 fetch (API 구현 후 주석 해제 + DUMMY_ADJACENT 제거) ──
    // useEffect(() => {
    //     if (!id) return;
    //     const { getAdjacentPosts } = postApi();
    //     let isMounted = true;
    //     setAdjacent({ prev: null, next: null });
    //     getAdjacentPosts(id)
    //         .then((data) => {
    //             if (isMounted) setAdjacent({ prev: data?.prev ?? null, next: data?.next ?? null });
    //         })
    //         .catch(() => { if (isMounted) setAdjacent({ prev: null, next: null }); });
    //     return () => { isMounted = false; };
    // }, [id]);

    // 카테고리 fetch
    useEffect(() => {
        if (!id) { setCategoryName(""); return; }
        let isMounted = true;
        getCategoryByPostId(id)
            .then((data) => {
                let name = "";
                if (Array.isArray(data)) {
                    name = data[0]?.categoryName ?? data[0]?.name ?? "";
                } else {
                    name = data?.categoryName ?? data?.name ?? data?.category?.name ?? "";
                }
                if (isMounted) setCategoryName(name);
            })
            .catch(() => { if (isMounted) setCategoryName(""); });
        return () => { isMounted = false; };
    }, [id, getCategoryByPostId]);

    // 마크다운 → HTML
    const htmlContent = useMemo(() => {
        if (!post?.content) return "";
        let content = post.content;
        content = content.replace(
            /!\[([^\]]*)\]\((\/uploadFiles\/[^)]+)\)/g,
            (match, alt, path) => `![${alt}](${encodeURI(`${baseURL}${path}`)})`
        );
        content = content.replace(/\n{3,}/g, "\n\n&nbsp;\n\n");
        const rawHtml = marked.parse(content, { breaks: true, gfm: true });
        return DOMPurify.sanitize(rawHtml);
    }, [post]);

    useLayoutEffect(() => {
        if (htmlContent) Prism.highlightAll();
    }, [htmlContent]);

    if (loading) return <div className="post-detail-loading">불러오는 중...</div>;
    if (error)   return <div className="post-detail-error">{error}</div>;
    if (!post)   return <div className="post-detail-error">게시글이 존재하지 않습니다.</div>;

    const createdAt = formatDate(post.createdAt);
    const updatedAt = formatDate(post.updatedAt);
    const isUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

    return (
        <div className="post-detail-wrapper">

            {/* 뒤로가기 */}
            <button
                className="post-detail-back-btn"
                onClick={() => naviService.goToBack()}
            >
                <span className="post-detail-back-arrow">←</span>
                목록으로
            </button>

            {/* 헤더 */}
            <div className="post-detail-header">
                <div className="post-detail-title-row">
                    <h1 className="post-detail-title">{post.title ?? "(제목 없음)"}</h1>
                    {categoryName && (
                        <span className="post-detail-category-tag">{categoryName}</span>
                    )}
                </div>
                <div className="post-detail-meta">
                    {createdAt && <span className="post-detail-date">{createdAt}</span>}
                    {isUpdated && (
                        <>
                            <span className="post-detail-divider" />
                            <span className="post-detail-updated">수정됨 {updatedAt}</span>
                        </>
                    )}
                </div>
            </div>

            {/* 본문 */}
            <div
                className="post-detail-body"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* 하단 이전/다음 네비게이션 */}
            <div className="post-detail-footer">

                {adjacent.prev ? (
                    <button
                        className="post-nav-card post-nav-prev"
                        onClick={() => naviService.goToPost(adjacent.prev.id)}
                        aria-label="이전 글로 이동"
                    >
                        <span className="post-nav-label">
                            <span className="post-nav-arrow">←</span>
                            이전 글
                        </span>
                        <span className="post-nav-title">{adjacent.prev.title}</span>
                        {adjacent.prev.excerpt && (
                            <span className="post-nav-excerpt">{adjacent.prev.excerpt}</span>
                        )}
                        {adjacent.prev.createdAt && (
                            <span className="post-nav-date">{formatDate(adjacent.prev.createdAt)}</span>
                        )}
                    </button>
                ) : (
                    <div className="post-nav-card post-nav-empty" aria-disabled="true">
                        <span className="post-nav-label">
                            <span className="post-nav-arrow">←</span>
                            이전 글
                        </span>
                        <span className="post-nav-none">첫 번째 글입니다</span>
                    </div>
                )}

                {adjacent.next ? (
                    <button
                        className="post-nav-card post-nav-next"
                        onClick={() => naviService.goToPost(adjacent.next.id)}
                        aria-label="다음 글로 이동"
                    >
                        <span className="post-nav-label post-nav-label-right">
                            다음 글
                            <span className="post-nav-arrow">→</span>
                        </span>
                        <span className="post-nav-title post-nav-title-right">{adjacent.next.title}</span>
                        {adjacent.next.excerpt && (
                            <span className="post-nav-excerpt post-nav-excerpt-right">{adjacent.next.excerpt}</span>
                        )}
                        {adjacent.next.createdAt && (
                            <span className="post-nav-date post-nav-date-right">{formatDate(adjacent.next.createdAt)}</span>
                        )}
                    </button>
                ) : (
                    <div className="post-nav-card post-nav-empty post-nav-next" aria-disabled="true">
                        <span className="post-nav-label post-nav-label-right">
                            다음 글
                            <span className="post-nav-arrow">→</span>
                        </span>
                        <span className="post-nav-none post-nav-none-right">마지막 글입니다</span>
                    </div>
                )}

            </div>

            {/* 댓글 영역 */}
            <CommentSection
                postId={id}
                comments={comments}
                loading={commentsLoading}
                onCommentAdded={(newComment) => setComments((prev) => [...prev, newComment])}
                onRefresh={refreshComments}
            />

        </div>
    );
}