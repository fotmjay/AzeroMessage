import axios from "axios";
import { APIENDPOINT } from "../constants/apiendpoint";

export const axiosInstance = axios.create({
  baseURL: APIENDPOINT.aleph,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_SUBSCAN_API_KEY,
  },
});
