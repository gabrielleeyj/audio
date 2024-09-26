import axios from "./axios";
import { useEffect } from "react";

const useAxiosAuth = () => {

    useEffect(() => {
        let token = sessionStorage.getItem("jwt");

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
        }
    }, []);

    return axios;
}

export default useAxiosAuth;

