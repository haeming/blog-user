import {useEffect, useMemo, useState} from "react";
import postApi from "../../api/postApi.js";
import PostItem from "./PostItem.jsx";
import "./PostList.css";

export default function PostList(){
    const { getPosts } = useMemo(() => postApi(), []);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [sort] = useState("createdAt,desc");

    useEffect(() => {
        const postList = async() => {
            try{
                const response = await getPosts(page, size, sort);
                console.log(response);
                setPosts(response.content || []);
            }catch(e){
                console.error("postList 불러오기 에러", e);
            }
        }
        postList();
    }, [page, size, sort, getPosts]);

    if (!posts.length) return <div className="post-list-empty">게시글이 없습니다.</div>;

    return (
        <div className="post-list-container">
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    onClick={() => {
                        // 여기서 라우팅 연결
                        // 예: navigate(`/posts/${post.id}`)
                    }}
                />
            ))}

            <div className="post-list-pagination">
                <button onClick={() => setPage((p) => Math.max(0, p - 1))}>이전</button>
                <span className="post-list-page-number">{page + 1}</span>
                <button onClick={() => setPage((p) => p + 1)}>다음</button>
            </div>
        </div>
    );
}