// pages/PostDetailPage.jsx
import PostDetail from "../features/post/components/PostDetail.jsx";
import {useParams} from "react-router-dom";
import CommentSection from "../features/post/components/CommentSection.jsx";

export default function PostDetailPage() {
    const id = useParams();

    return (
        <div>
            <PostDetail />
            <CommentSection postId={id} />
        </div>
    );
}