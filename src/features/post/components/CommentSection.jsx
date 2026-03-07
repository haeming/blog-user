import { useMemo, useState } from "react";
import commentApi from "../../../api/commentApi.js";
import "./CommentSection.css";

/* ── 날짜 포맷 ────────────────────────────────────────── */
function formatCommentDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = now - date;
    const min  = Math.floor(diff / 60000);
    const hour = Math.floor(min / 60);
    const day  = Math.floor(hour / 24);

    if (min  <  1) return "방금 전";
    if (min  < 60) return `${min}분 전`;
    if (hour < 24) return `${hour}시간 전`;
    if (day  <  7) return `${day}일 전`;
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

/* ── 댓글 목록 정리 (원댓글 → 대댓글 순) ─────────────── */
function organizeComments(list) {
    const roots   = list.filter(c => c.parentId === null);
    const result  = [];
    roots.forEach(parent => {
        result.push(parent);
        list.filter(c => c.parentId === parent.id).forEach(reply => result.push(reply));
    });
    return result;
}

/* ══════════════════════════════════════════════════════
   비밀번호 확인 모달
══════════════════════════════════════════════════════ */
function PasswordModal({ mode, onConfirm, onCancel, error }) {
    const [pw, setPw] = useState("");
    return (
        <div className="cs-modal-backdrop" onClick={onCancel}>
            <div className="cs-modal" onClick={e => e.stopPropagation()}>
                <p className="cs-modal-title">
                    {mode === "edit" ? "댓글 수정" : "댓글 삭제"}
                </p>
                <p className="cs-modal-desc">비밀번호를 입력해주세요</p>
                <input
                    className={`cs-modal-input ${error ? "cs-modal-input-error" : ""}`}
                    type="password"
                    placeholder="비밀번호"
                    value={pw}
                    autoFocus
                    onChange={e => setPw(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && onConfirm(pw)}
                />
                {error && <p className="cs-modal-error-msg">{error}</p>}
                <div className="cs-modal-actions">
                    <button className="cs-modal-cancel-btn" onClick={onCancel}>취소</button>
                    <button
                        className={`cs-modal-confirm-btn ${mode === "delete" ? "cs-modal-confirm-delete" : ""}`}
                        onClick={() => onConfirm(pw)}
                    >
                        {mode === "edit" ? "확인" : "삭제"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   댓글 한 줄 (원댓글 + 대댓글 공통)
══════════════════════════════════════════════════════ */
function CommentItem({ comment, postId, onRefresh }) {
    const isReply = comment.parentId !== null;
    const { verifyPassword, updateComment, deleteComment, createComment } = useMemo(() => commentApi(), []);

    /* 모달 상태 */
    const [modal, setModal]       = useState(null); // null | "edit" | "delete"
    const [modalError, setModalError] = useState("");

    /* 수정 상태 */
    const [editContent, setEditContent] = useState("");
    const [editing, setEditing]         = useState(false);
    const [verifiedPw, setVerifiedPw]   = useState("");

    /* 대댓글 입력 상태 */
    const [replying, setReplying]         = useState(false);
    const [replyNickname, setReplyNickname] = useState("");
    const [replyPassword, setReplyPassword] = useState("");
    const [replyContent, setReplyContent]   = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [replyError, setReplyError]       = useState("");

    /* ── 비밀번호 확인 후 동작 분기 ── */
    const handlePasswordConfirm = async (pw) => {
        setModalError("");
        try {
            await verifyPassword(comment.id, pw);
            // 성공
            if (modal === "edit") {
                setVerifiedPw(pw);
                setEditContent(comment.content);
                setEditing(true);
                setModal(null);
            } else if (modal === "delete") {
                await deleteComment(comment.id, pw);
                setModal(null);
                onRefresh();
            }
        } catch {
            setModalError("비밀번호가 일치하지 않습니다.");
        }
    };

    /* ── 수정 제출 ── */
    const handleEditSubmit = async () => {
        if (!editContent.trim()) return;
        try {
            await updateComment(comment.id, { password: verifiedPw, content: editContent });
            setEditing(false);
            setVerifiedPw("");
            onRefresh();
        } catch {
            alert("수정에 실패했습니다.");
        }
    };

    /* ── 대댓글 제출 ── */
    const handleReplySubmit = async () => {
        if (!replyNickname.trim()) { setReplyError("닉네임을 입력해주세요."); return; }
        if (!replyPassword.trim()) { setReplyError("비밀번호를 입력해주세요."); return; }
        if (!replyContent.trim())  { setReplyError("내용을 입력해주세요."); return; }
        setReplyError("");
        setReplySubmitting(true);
        try {
            await createComment({
                postId,
                parentId: comment.id,
                nickname: replyNickname.trim(),
                password: replyPassword.trim(),
                content:  replyContent.trim(),
            });
            setReplying(false);
            setReplyNickname("");
            setReplyPassword("");
            setReplyContent("");
            onRefresh();
        } catch {
            setReplyError("답글 등록에 실패했습니다.");
        } finally {
            setReplySubmitting(false);
        }
    };

    const authorLabel = comment.nickname ?? comment.author ?? "익명";

    return (
        <>
            {/* ── 비밀번호 모달 ── */}
            {modal && (
                <PasswordModal
                    mode={modal}
                    onConfirm={handlePasswordConfirm}
                    onCancel={() => { setModal(null); setModalError(""); }}
                    error={modalError}
                />
            )}

            <div className={`cs-comment-item ${isReply ? "cs-comment-reply" : ""}`}>
                {/* 대댓글 들여쓰기 선 */}
                {isReply && <span className="cs-reply-indent-line" />}

                <div className="cs-comment-inner">
                    {/* 아바타 */}
                    <div className={`cs-avatar ${isReply ? "cs-avatar-sm" : ""}`}>
                        {authorLabel.charAt(0)}
                    </div>

                    {/* 본문 */}
                    <div className="cs-comment-body">
                        {/* 헤더 */}
                        <div className="cs-comment-header">
                            <div className="cs-comment-header-left">
                                <span className="cs-nickname">{authorLabel}</span>
                                {isReply && <span className="cs-reply-badge">답글</span>}
                                <span className="cs-comment-date">{formatCommentDate(comment.createdAt)}</span>
                            </div>
                            {/* 수정 / 삭제 버튼 */}
                            <div className="cs-comment-actions">
                                {!isReply && (
                                    <button
                                        className="cs-action-btn"
                                        onClick={() => setReplying(v => !v)}
                                    >
                                        답글
                                    </button>
                                )}
                                <button
                                    className="cs-action-btn"
                                    onClick={() => { setModal("edit"); setModalError(""); }}
                                >
                                    수정
                                </button>
                                <button
                                    className="cs-action-btn cs-action-delete"
                                    onClick={() => { setModal("delete"); setModalError(""); }}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        {/* 수정 인라인 폼 */}
                        {editing ? (
                            <div className="cs-edit-form">
                                <textarea
                                    className="cs-edit-textarea"
                                    value={editContent}
                                    rows={3}
                                    autoFocus
                                    onChange={e => setEditContent(e.target.value)}
                                />
                                <div className="cs-edit-actions">
                                    <button
                                        className="cs-edit-cancel-btn"
                                        onClick={() => { setEditing(false); setVerifiedPw(""); }}
                                    >
                                        취소
                                    </button>
                                    <button className="cs-edit-submit-btn" onClick={handleEditSubmit}>
                                        저장
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="cs-comment-content">{comment.content}</p>
                        )}
                    </div>
                </div>

                {/* 대댓글 입력 폼 */}
                {replying && (
                    <div className="cs-reply-form">
                        <div className="cs-reply-form-header">
                            ↩ <span>{authorLabel}</span>님에게 답글
                        </div>
                        <div className="cs-reply-form-row">
                            <div className="cs-reply-form-field">
                                <label className="cs-form-label">닉네임</label>
                                <input
                                    className="cs-form-input"
                                    type="text"
                                    placeholder="닉네임"
                                    maxLength={20}
                                    value={replyNickname}
                                    onChange={e => setReplyNickname(e.target.value)}
                                />
                            </div>
                            <div className="cs-reply-form-field">
                                <label className="cs-form-label">비밀번호</label>
                                <input
                                    className="cs-form-input"
                                    type="password"
                                    placeholder="비밀번호"
                                    maxLength={20}
                                    value={replyPassword}
                                    onChange={e => setReplyPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <textarea
                            className="cs-reply-textarea"
                            placeholder="답글을 입력하세요..."
                            rows={3}
                            maxLength={500}
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            autoFocus
                        />
                        {replyError && <p className="cs-reply-error">{replyError}</p>}
                        <div className="cs-reply-form-actions">
                            <button
                                className="cs-reply-cancel-btn"
                                onClick={() => { setReplying(false); setReplyError(""); }}
                            >
                                취소
                            </button>
                            <button
                                className="cs-reply-submit-btn"
                                onClick={handleReplySubmit}
                                disabled={replySubmitting}
                            >
                                {replySubmitting ? <span className="cs-spinner" /> : "답글 등록"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════
   CommentSection (메인)
══════════════════════════════════════════════════════ */
export default function CommentSection({ postId, comments = [], loading = false, onCommentAdded, onRefresh }) {
    const { createComment } = useMemo(() => commentApi(), []);

    const [nickname, setNickname]   = useState("");
    const [password, setPassword]   = useState("");
    const [content, setContent]     = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState("");

    const organized = useMemo(() => organizeComments(comments), [comments]);

    const handleSubmit = async () => {
        if (!nickname.trim()) { setError("닉네임을 입력해주세요."); return; }
        if (!password.trim()) { setError("비밀번호를 입력해주세요."); return; }
        if (!content.trim())  { setError("댓글 내용을 입력해주세요."); return; }
        if (content.length > 500) { setError("500자 이내로 입력해주세요."); return; }

        setError("");
        setSubmitting(true);
        try {
            const newComment = await createComment({
                postId,
                parentId: null,
                nickname: nickname.trim(),
                password: password.trim(),
                content:  content.trim(),
            });
            onCommentAdded?.(newComment);
            setNickname("");
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
        <section className="cs-section">

            {/* 헤더 */}
            <div className="cs-section-header">
                <h2 className="cs-section-title">
                    댓글
                    {!loading && <span className="cs-count">{comments.length}</span>}
                </h2>
            </div>

            {/* 댓글 목록 */}
            {loading ? (
                <div className="cs-empty">댓글을 불러오는 중...</div>
            ) : organized.length === 0 ? (
                <div className="cs-empty">
                    <span className="cs-empty-icon">💬</span>
                    <p>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                </div>
            ) : (
                <div className="cs-list">
                    {organized.map(c => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            postId={postId}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}

            {/* 구분선 */}
            <div className="cs-divider" />

            {/* 댓글 작성 폼 */}
            <div className="cs-form">
                <h3 className="cs-form-title">댓글 작성</h3>

                <div className="cs-form-row">
                    <div className="cs-form-field">
                        <label className="cs-form-label" htmlFor="cs-nickname">닉네임</label>
                        <input
                            id="cs-nickname"
                            className="cs-form-input"
                            type="text"
                            placeholder="닉네임"
                            maxLength={20}
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                        />
                    </div>
                    <div className="cs-form-field">
                        <label className="cs-form-label" htmlFor="cs-password">비밀번호</label>
                        <input
                            id="cs-password"
                            className="cs-form-input"
                            type="password"
                            placeholder="수정·삭제 시 필요"
                            maxLength={20}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="cs-textarea-wrap">
                    <textarea
                        className="cs-textarea"
                        placeholder="댓글을 입력하세요... (최대 500자)"
                        maxLength={500}
                        rows={4}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <span className={`cs-char-count ${remaining < 50 ? "cs-char-warn" : ""}`}>
                        {remaining}자 남음
                    </span>
                </div>

                {error && <p className="cs-form-error">{error}</p>}

                <div className="cs-form-footer">
                    <button className="cs-submit-btn" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <span className="cs-spinner" /> : "등록하기"}
                    </button>
                </div>
            </div>

        </section>
    );
}