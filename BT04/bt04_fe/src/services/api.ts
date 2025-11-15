import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://localhost:5000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  register(data: any) {
    return this.client.post("/auth/register", data);
  }

  login(data: any) {
    return this.client.post("/auth/login", data);
  }

  forgotPassword(data: any) {
    return this.client.post("/auth/forgot-password", data);
  }

  // resetPassword(data: any) {
  //   return this.client.post("/auth/reset-password", data);
  // }

  getCurrentUser() {
    return this.client.get("/auth/current-user");
  }

  logout() {
    return this.client.post("/auth/logout");
  }
}

export default new ApiClient();
