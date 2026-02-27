import {useEffect, useMemo, useState} from "react";
import postApi from "../../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostListPreview.css";
import useNaviService from "../../../hooks/useNaviService.js";

export default function PostListPreview(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const naviService = useNaviService();

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
                <h1 className="post-list-preview-title">최신 글</h1>
                <button
                    className="view-all-btn"
                    onClick={naviService.goToPosts}
                >
                    전체보기 →
                </button>
            </div>

            <div className="post-list-preview-items">
                {posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onClick={naviService.goToPosts}
                    />
                ))}
            </div>
        </div>
    );
}