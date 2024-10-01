import axios from "axios";

const BASE_URL = (import.meta.env.VITE_NODE_ENV === "development") ? import.meta.env.VITE_LOCAL_SERVER : import.meta.env.VITE_DEPLOYED_SERVER;
axios.defaults.withCredentials = true;

export const request = axios.create({
    baseURL: BASE_URL, withCredentials: true, credentials: "include",
});
