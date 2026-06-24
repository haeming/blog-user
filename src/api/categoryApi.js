import { axiosInstance } from "./axiosInstance.js";

const categoryApi = {
    getCategoryByPostId(postId) {
        return axiosInstance({
            method: "get",
            url: `/api/categories/post/${postId}`,
        });
    },

    getCategories() {
        return axiosInstance({
            method: "get",
            url: "/api/categories",
        });
    },

    getPostCountByCategoryId(categoryId) {
        return axiosInstance({
            method: "get",
            url: `/api/categories/${categoryId}/post-count`,
        });
    }
};

export default categoryApi;