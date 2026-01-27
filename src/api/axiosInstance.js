import baseURL from "../config/apiBaseUrl.js";
import axios from "axios";

export const axiosInstance = async(method, url, data) => {
    try{
        const response = await axios({
            method,
            url: `${baseURL}${url}`,data, ...null
        })
        return response.data;
    } catch (error){
        console.error("API error", error);
        throw error;
    }
}