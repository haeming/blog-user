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

    return { getCategoryByPostId, getCategories };
}