import "./PostItem.css";

export default function PostItem({ post, onClick }) {
    const title = post?.title ?? "(제목 없음)";
    const summary = post?.summary ?? post?.content ?? "";
    const createdAt = post?.createdAt ? new Date(post.createdAt).toLocaleString() : "";

    return (
        <div
            onClick={onClick}
            className={`post-item ${!onClick ? 'post-item-no-click' : ''}`}
        >
            <div className="post-item-title">{title}</div>
            {createdAt && <div className="post-item-date">{createdAt}</div>}
            {summary && (
                <div className="post-item-summary">
                    {/*{summary.length > 120 ? summary.slice(0, 120) + "..." : summary}*/}
                    {summary}
                </div>
            )}
        </div>
    );
}