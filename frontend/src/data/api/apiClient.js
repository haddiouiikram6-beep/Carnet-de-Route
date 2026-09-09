import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.1.98:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;