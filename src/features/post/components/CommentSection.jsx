import { useState } from "react";
import "./CommentSection.css";

// 임시 더미 데이터 (실제 사용 시 API로 교체)
const DUMMY_COMMENTS = [
    {
        id: 1,
        author: "김개발",
        createdAt: "2025-03-01T10:23:00",
        content: "정말 유익한 글이네요! 덕분에 개념을 잡을 수 있었습니다. 감사합니다 :)",
    },
    {
        id: 2,
        author: "박코딩",
        createdAt: "2025-03-02T14:05:00",
        content: "예시 코드가 이해하기 쉽게 작성되어 있어서 좋았습니다. 혹시 심화 내용도 다루실 예정인가요?",
    },
    {
        id: 3,
        author: "이프론트",
        createdAt: "2025-03-03T09:47:00",
        content: "실무에서 바로 적용해봤는데 잘 동작합니다. 좋은 포스팅 감사합니다!",
    },
];

function formatCommentDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function CommentItem({ comment }) {
    return (
        <div className="comment-item">
            <div className="comment-item-header">
                <div className="comment-avatar">
                    {comment.author.charAt(0)}
                </div>
                <div className="comment-meta">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-date">{formatCommentDate(comment.createdAt)}</span>
                </div>
            </div>
            <p className="comment-content">{comment.content}</p>
        </div>
    );
}

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState(DUMMY_COMMENTS);
    const [author, setAuthor] = useState("");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!author.trim()) { setError("닉네임을 입력해주세요."); return; }
        if (!password.trim()) { setError("비밀번호를 입력해주세요."); return; }
        if (!content.trim()) { setError("댓글 내용을 입력해주세요."); return; }
        if (content.trim().length > 500) { setError("댓글은 500자 이내로 입력해주세요."); return; }

        setError("");
        setSubmitting(true);

        // 실제 API 연동 시 아래 블록을 교체하세요
        try {
            await new Promise((res) => setTimeout(res, 600)); // 임시 딜레이
            const newComment = {
                id: Date.now(),
                author: author.trim(),
                createdAt: new Date().toISOString(),
                content: content.trim(),
            };
            setComments((prev) => [...prev, newComment]);
            setAuthor("");
            setPassword("");
            setContent("");
        } catch {
            setError("댓글 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    const remaining = 500 - content.length;

    return (
        <section className="comment-section">

            {/* 섹션 헤더 */}
            <div className="comment-section-header">
                <h2 className="comment-section-title">
                    댓글
                    <span className="comment-count">{comments.length}</span>
                </h2>
            </div>

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
                <div className="comment-empty">
                    <span className="comment-empty-icon">💬</span>
                    <p>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                </div>
            ) : (
                <div className="comment-list">
                    {comments.map((c) => (
                        <CommentItem key={c.id} comment={c} />
                    ))}
                </div>
            )}

            {/* 구분선 */}
            <div className="comment-divider" />

            {/* 댓글 입력창 */}
            <div className="comment-form">
                <h3 className="comment-form-title">댓글 작성</h3>

                <div className="comment-form-row">
                    <div className="comment-form-field">
                        <label className="comment-form-label" htmlFor="comment-author">닉네임</label>
                        <input
                            id="comment-author"
                            className="comment-form-input"
                            type="text"
                            placeholder="닉네임"
                            maxLength={20}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>
                    <div className="comment-form-field">
                        <label className="comment-form-label" htmlFor="comment-password">비밀번호</label>
                        <input
                            id="comment-password"
                            className="comment-form-input"
                            type="password"
                            placeholder="비밀번호 (삭제 시 필요)"
                            maxLength={20}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="comment-form-textarea-wrap">
                    <textarea
                        className="comment-form-textarea"
                        placeholder="댓글을 입력하세요... (최대 500자)"
                        maxLength={500}
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <span className={`comment-char-count ${remaining < 50 ? "comment-char-warn" : ""}`}>
                        {remaining}자 남음
                    </span>
                </div>

                {error && <p className="comment-form-error">{error}</p>}

                <div className="comment-form-footer">
                    <button
                        className="comment-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span className="comment-submit-spinner" />
                        ) : (
                            "등록하기"
                        )}
                    </button>
                </div>
            </div>

        </section>
    );
}