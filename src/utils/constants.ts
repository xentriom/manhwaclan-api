import axios from "axios";

export const BASE_URL = "https://manhwaclan.com";

export const httpClient = axios.create({
  timeout: 8000,
  maxRedirects: 3,
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
  },
});
