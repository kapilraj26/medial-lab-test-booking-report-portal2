import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    const status = error.response?.status;

    // ======================================
    // 401 - UNAUTHORIZED
    // ======================================

    if (status === 401) {

      console.log("401 Unauthorized");

      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");

      alert("Session expired. Please login again.");

      window.location.href = "/login";
    }


    // ======================================
    // 403 - FORBIDDEN
    // ======================================

    else if (status === 403) {

      console.log("403 Forbidden");

      alert(
        error.response?.data?.detail ||
        "Access denied. You are not allowed to perform this action."
      );
    }


    // ======================================
    // 404 - NOT FOUND
    // ======================================

    else if (status === 404) {

      console.log("404 Not Found");

      alert(
        error.response?.data?.detail ||
        "Requested resource was not found."
      );
    }


    // ======================================
    // 422 - VALIDATION ERROR
    // ======================================

    else if (status === 422) {

      console.log("422 Validation Error");

      alert(
        error.response?.data?.detail ||
        "Please check the entered information."
      );
    }


    // ======================================
    // 500 - SERVER ERROR
    // ======================================

    else if (status === 500) {

      console.log("500 Internal Server Error");

      alert(
        "Internal server error. Please try again later."
      );
    }


    // ======================================
    // OTHER ERRORS
    // ======================================

    else {

      console.error("API Error:", error);
    }

    return Promise.reject(error);
  }
);


export default api;