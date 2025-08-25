import axios from "axios"

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_PORT}/api/v1`,
  withCredentials: true,
})

export default axiosClient
