import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import postApi from "../../api/postApi.js";
import useNaviService from "../../hooks/useNaviService.js";
import "./PostDetail.css";

export default function PostDetail() {
    const { id } = useParams();
    const { getPost } = useMemo(() => postApi(), []);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const naviService = useNaviService();

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

    if (loading) return <div className="post-detail-loading">불러오는 중...</div>;
    if (error)   return <div className="post-detail-error">{error}</div>;
    if (!post)   return <div className="post-detail-error">게시글이 존재하지 않습니다.</div>;

    const createdAt  = post.createdAt  ? new Date(post.createdAt).toLocaleString()  : null;
    const updatedAt  = post.updatedAt  ? new Date(post.updatedAt).toLocaleString()  : null;
    const isUpdated  = post.updatedAt && post.updatedAt !== post.createdAt;

    return (
        <div className="post-detail-wrapper">

            {/* 뒤로가기 */}
            <button className="post-detail-back-btn" onClick={naviService.goToBack}>
                <span className="post-detail-back-arrow">←</span>
                목록으로
            </button>

            {/* 헤더 */}
            <div className="post-detail-header">
                <h1 className="post-detail-title">{post.title ?? "(제목 없음)"}</h1>
                <div className="post-detail-meta">
                    {createdAt && (
                        <span className="post-detail-date">{createdAt}</span>
                    )}
                    {isUpdated && (
                        <>
                            <span className="post-detail-divider" />
                            <span className="post-detail-updated">수정됨 {updatedAt}</span>
                        </>
                    )}
                </div>
            </div>

            {/* 본문 */}
            <div className="post-detail-body">
                {post.content ?? ""}
            </div>

            {/* 하단 목록 버튼 */}
            <div className="post-detail-footer">
                <button className="post-detail-list-btn" onClick={naviService.goToBack}>
                    목록 보기 →
                </button>
            </div>

        </div>
    );
}