import baseURL from "../config/apiBaseUrl.js";
import axios from "axios";

export const axiosInstance = async({method, url, data, params}) => {
    try{
        const response = await axios({
            method,
            url: `${baseURL}${url}`,
            data,
            params,
        });
        return response.data;
    } catch (error){
        console.error("API error", error);
        throw error;
    }
}