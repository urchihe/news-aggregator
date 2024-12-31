import axios from "axios";

export const axiosClient = axios.create({
    baseURL: "http://api.newsaggregator.localhost/",
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
