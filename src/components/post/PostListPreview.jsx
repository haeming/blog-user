import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import postApi from "../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostListPreview.css";

export default function PostListPreview(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentPosts = async() => {
            try{
                const response = await getPosts(0, 4, "createdAt,desc");
                console.log(response);
                setPosts(response.content || []);
            }catch(e){
                console.error("최신 게시글 불러오기 에러", e);
            }
        }
        fetchRecentPosts();
    }, [getPosts]);

    if (!posts.length) return null;

    return (
        <div className="post-list-preview-container">
            <div className="post-list-preview-header">
                <h2 className="post-list-preview-title">최신 글</h2>
                <button
                    className="view-all-btn"
                    onClick={() => navigate('/posts')}
                >
                    전체보기 →
                </button>
            </div>

            <div className="post-list-preview-items">
                {posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onClick={() => {
                            // 상세 이동이 필요하면 여기서 라우팅 연결
                            // 예: navigate(`/posts/${post.id}`)
                        }}
                    />
                ))}
            </div>
        </div>
    );
}