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

    const verifyPassword = (commentId, password) => {
        return axiosInstance({
            method: "post",
            url: `/api/comments/${commentId}/verify-password`,
            data: { password },
        });
    };

    const updateComment = (commentId, body) => {
        return axiosInstance({
            method: "put",
            url: `/api/comments/${commentId}`,
            data: body,
        });
    };

    // DELETE /api/comments/{id}
    // body: { password }
    const deleteComment = (commentId, password) => {
        return axiosInstance({
            method: "delete",
            url: `/api/comments/${commentId}`,
            data: { password },
        });
    };

    return { getCommentsByPostId, createComment, verifyPassword, updateComment, deleteComment };
}