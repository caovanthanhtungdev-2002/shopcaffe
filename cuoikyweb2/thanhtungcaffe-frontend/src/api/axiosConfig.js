import axios from "axios";

// ✅ URL backend
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8082/api";

// ✅ Tạo instance Axios
const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Thêm token Bearer vào mỗi request (nếu có)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi 401 / 403 tập trung
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token hết hạn hoặc không hợp lệ. Cần đăng nhập lại.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.warn("⚠️ Bạn không có quyền truy cập API này.");
    }
    return Promise.reject(error);
  }
);

export default instance;
