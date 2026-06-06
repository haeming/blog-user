import {axiosInstance} from "./axiosInstance.js";

export default function postApi(){
    const getPost = (id) => {
        return axiosInstance({
            method: "get",
            url: `/api/posts/${id}`,
        });
    }

    const getPosts = (page = 0, size = 10, sort="createdAt,desc", categoryId) => {
        const params = { page, size, sort };
        if (categoryId) params.categoryId = categoryId;
        return axiosInstance({
            method: "get",
            url: "/api/posts",
            params,
        });
    };

    return {getPost, getPosts};
}