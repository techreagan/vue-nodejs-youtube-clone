import axios from 'axios'
import {group} from "@/store/modules/auth"

export default () => {
    const api = sessionStorage.getItem("api") + group + "/api/v1";

    const axiosInstance = axios.create({
        baseURL: api,
    })

    const token = localStorage.getItem('token')
    if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                location.reload()
            }
            return Promise.reject(error)
        }
    )

    return axiosInstance
}
