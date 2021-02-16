import axios from "axios";
import Router from 'next/router';

let instance = axios.create({
  baseURL: "",
});

function createAxiosResponseInterceptor(axiosInstance) {
  const interceptor = axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Reject promise if usual error
      if (error.response && error.response.status === 403) {
        Router.push("/auth");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("avatar");
      }
      axiosInstance.interceptors.response.eject(interceptor);
      return Promise.reject(error);
    }
  );
}

createAxiosResponseInterceptor(instance);
export default instance;
