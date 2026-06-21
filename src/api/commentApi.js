import { axiosInstance } from "./axiosInstance.js";

const commentApi = {
    getCommentsByPostId(postId) {
        return axiosInstance({
            method: "get",
            url: "/api/comments",
            params: { postId },
        });
    },

    createComment(body) {
        return axiosInstance({
            method: "post",
            url: "/api/comments",
            data: body,
        });
    },

    verifyPassword(commentId, password) {
        return axiosInstance({
            method: "post",
            url: `/api/comments/${commentId}/verify-password`,
            data: { password },
        });
    },

    updateComment(commentId, body) {
        return axiosInstance({
            method: "put",
            url: `/api/comments/${commentId}`,
            data: body,
        });
    },

    deleteComment(commentId, password) {
        return axiosInstance({
            method: "delete",
            url: `/api/comments/${commentId}`,
            data: { password },
        });
    },
};

export default commentApi;