import { baseUrl } from "@/envs";
import axios from "axios";

export type ContentType = "form" | "json";
export const axiosInstance = axios.create({
  baseURL: `${baseUrl}/public/api/v1`,
  headers: { Accept: "application/json", "Content-type": "application/json" },
});

export const axiosPrivateInstance = (token: string, type: ContentType) =>
  axios.create({
    baseURL: `${baseUrl}/public/api/v1`,
    headers: {
      "Content-Type": `${
        type === "json" ? "application/json" : "multipart/form-data"
      }`,

      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
