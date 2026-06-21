import {axiosInstance} from "./axiosInstance.js";

export default function categoryApi(){
    const getCategoryByPostId = (postId) => {
        return axiosInstance({
                method: "get",
                url: `/api/categories/post/${postId}`,
        });
    }

    const getCategories = () => {
        return axiosInstance({
            method: "get",
            url: "/api/categories",
        });
    }

    const getPostCountByCategoryId = (categoryId) => {
        return axiosInstance({
            method: "get",
            url: `/api/categories/${categoryId}/post-count`,
        });
    };

    return { getCategoryByPostId, getCategories, getPostCountByCategoryId };
}