import axios from "axios";
import {publicApi} from "./publicApi";
export const privateApi = axios.create({
    baseURL: "/api",
    withCredentials: true,
})

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
    const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
    }
    try{
        await publicApi.post("/api/auth/refresh")
        return privateApi(originalRequest)
    }
    catch (err) {
        console.log("Refresh failed", err);
        Promise.reject(err)

    }
    Promise.reject(error)
    

}
)