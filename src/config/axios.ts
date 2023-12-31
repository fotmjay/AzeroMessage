import axios from "axios";
import { APIENDPOINT } from "../constants/apiendpoint";

export const axiosInstance = axios.create({
  baseURL: APIENDPOINT.azeroMessageBackend,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});
