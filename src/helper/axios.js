import axios from "axios";
import { Endpoints } from "./common/Endpoint";

const apiRequest = axios.create({
  baseURL: Endpoints.BASE_URL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiRequest.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location = "/sign-in" 
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
