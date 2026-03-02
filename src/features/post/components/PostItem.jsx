import "./PostItem.css";
import { formatDate } from "../../../utils/dateUtils.js";

export default function PostItem({ post, onClick }) {
    const title = post?.title ?? "(제목 없음)";
    const summary = post?.summary ?? post?.content ?? "";
    const createdAt = formatDate(post?.createdAt);

    const categoryName = post?.categoryName ?? post?.category?.name ?? "";

    return (
        <div
            onClick={onClick}
            className={`post-item ${!onClick ? 'post-item-no-click' : ''}`}
        >
            <div className="post-item-title-row">
                <div className="post-item-title">{title}</div>
                {categoryName && (
                    <span className="post-item-category-tag">{categoryName}</span>
                )}
            </div>
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
