import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8000/"
});

axiosClient.interceptors.request.use((requestConfig) => {
    const access_token = JSON.parse(localStorage.getItem("quizUser"))?.access_token;
    if (access_token) {
        requestConfig.headers["Authorization"] = "Bearer " + access_token;
    }
    return requestConfig;
}, (error) => {
    console.log(error)
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((res) => {
    return res;
}, async (err) => {
    const originalConfig = err.config;
    const statusCode = err.response.status;
    const data = JSON.parse(localStorage.getItem("quizUser"));
    if (statusCode === 403 && originalConfig.url === "auth/token") {
        return Promise.reject(err);
    }
    if (statusCode === 403) {
        const tokenResponse = await axiosClient.post("auth/token", data);
        const access_token = tokenResponse.data.access_token;
        localStorage.setItem("quizUser", JSON.stringify({ ...data, access_token: access_token }));
        return axiosClient(originalConfig);
    }
    return err;
});

export default axiosClient;