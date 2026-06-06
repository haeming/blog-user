import {axiosInstance} from "./axiosInstance.js";

export default function postApi(){
    const getPost = (id) => {
        return axiosInstance({
            method: "get",
            url: `/api/posts/${id}`,
        });
    }

    const getPosts = (page = 0, size = 10, sort="createdAt,desc", categoryId) => {
        return axiosInstance({
            method: "get",
            url: categoryId ? `/api/categories/${categoryId}/posts` : "/api/posts",
            params: { page, size, sort },
        });
    };

    return {getPost, getPosts};
}