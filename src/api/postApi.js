import {axiosInstance} from "./axiosInstance.js";

export default function postApi(){
    const getPost = (id) => {
        return axiosInstance({
            method: "get",
            url: `/api/guest/posts/${id}`,
        });
    }

    const getPosts = (page = 0, size = 10, sort="createdAt,desc") => {
        return axiosInstance({
            method: "get",
            url: "/api/guest/posts",
            params: { page, size, sort },
        });
    };

    return {getPost, getPosts};
}