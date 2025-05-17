import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      const token = JSON.parse(auth)?.jwtToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Dodany token JWT do nagłówka:", token); // debug
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

