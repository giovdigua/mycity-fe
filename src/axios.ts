import axios from "axios";
import {useAuthStore} from "@/store/auth";

const instance = axios.create({
    baseURL: 'http://localhost/api',
    withCredentials: true,
});
instance.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;