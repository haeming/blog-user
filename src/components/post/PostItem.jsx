export default function PostItem({ post, onClick }) {
    // const title = post?.title ?? "(제목 없음)";
    const title = post?.title ?? "(제목 없음)";
    const summary = post?.summary ?? post?.content ?? "";
    const createdAt = post?.createdAt ? new Date(post.createdAt).toLocaleString() : "";

    return (
        <div
            onClick={onClick}
            style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 10,
                cursor: onClick ? "pointer" : "default",
            }}
        >
            <div style={{ fontWeight: 700 }}>{title}</div>
            {createdAt && <div style={{ fontSize: 12, opacity: 0.7 }}>{createdAt}</div>}
            {summary && (
                <div style={{ marginTop: 8, lineHeight: 1.4 }}>
                    {summary.length > 120 ? summary.slice(0, 120) + "..." : summary}
                </div>
            )}
        </div>
    );
}
