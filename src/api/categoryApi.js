import {axiosInstance} from "./axiosInstance.js";

export default function categoryApi(){
    const getCategoryByPostId = (postId) => {
        return axiosInstance({
                method: "get",
                url: `/api/categories/post/${postId}`,
        });
    }

    return { getCategoryByPostId };
}