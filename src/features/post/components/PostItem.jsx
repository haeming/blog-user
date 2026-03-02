import "./PostItem.css";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../../utils/dateUtils.js";
import categoryApi from "../../../api/categoryApi.js";

export default function PostItem({ post, onClick }) {
    const title = post?.title ?? "(?쒕ぉ ?놁쓬)";
    const summary = post?.summary ?? post?.content ?? "";
    const createdAt = formatDate(post?.createdAt);
    const { getCategoryByPostId } = useMemo(() => categoryApi(), []);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        if (!post?.id) {
            setCategoryName("");
            return;
        }

        let isMounted = true;
        getCategoryByPostId(post.id)
            .then((data) => {
                let name = "";

                if (Array.isArray(data)) {
                    name = data[0]?.categoryName ?? data[0]?.name ?? "";
                } else {
                    name = data?.categoryName ?? data?.name ?? data?.category?.name ?? "";
                }

                if (isMounted) setCategoryName(name);
            })
            .catch(() => {
                if (isMounted) setCategoryName("");
            });

        return () => {
            isMounted = false;
        };
    }, [post?.id, getCategoryByPostId]);

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
