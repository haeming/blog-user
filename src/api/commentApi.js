import { axiosInstance } from "./axiosInstance.js";

export default function commentApi() {
    const getCommentsByPostId = (postId) => {
        return axiosInstance({
            method: "get",
            url: `/api/comments`,
            params: { postId },
        });
    };

    const createComment = (body) => {
        return axiosInstance({
            method: "post",
            url: `/api/comments`,
            data: body,
        });
    };

    return { getCommentsByPostId, createComment };
}