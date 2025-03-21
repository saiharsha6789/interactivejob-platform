import axios from "axios";

export const baseURL = "http://localhost:8001/api/";
const axiosapi = axios.create({
  baseURL,
});
export default axiosapi;
