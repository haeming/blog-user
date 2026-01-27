import {axiosInstance} from "./axiosInstance.js";

export default function postApi(){
    const getPost = async (id) => {
        return await axiosInstance("get", `/api/guest/posts/${id}`, null);
    }

    const getPosts = async( page = 0, size = 10, sort="createdAt,desc" ) => {
        const params = new URLSearchParams({ page, size, sort }).toString();
        return await axiosInstance("get", `/api/guest/posts?${params}`, null);
    }

    return {getPost, getPosts};
}