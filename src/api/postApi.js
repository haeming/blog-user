import { axiosInstance } from "./axiosInstance.js";

const postApi = {
    getPost(id) {
        return axiosInstance({
            method: "get",
            url: `/api/posts/${id}`,
        });
    },

    getPosts(page = 0, size = 10, sort = "createdAt,desc", categoryId, keyword) {
        if (keyword) {
            return axiosInstance({
                method: "get",
                url: "/api/posts",
                params: { page, size, sort, keyword },
            });
        }
        return axiosInstance({
            method: "get",
            url: categoryId ? `/api/categories/${categoryId}/posts` : "/api/posts",
            params: { page, size, sort },
        });
    },

    getAdjacentPosts(id) {
        return axiosInstance({
            method: "get",
            url: `/api/posts/${id}/adjacent`,
        });
    }
};

export default postApi;