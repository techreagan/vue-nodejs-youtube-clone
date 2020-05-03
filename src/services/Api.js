import axios from 'axios'

export default () => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.VUE_APP_URL}/api/v1`
  })

  const token = localStorage.getItem('token')
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  return axiosInstance
}
