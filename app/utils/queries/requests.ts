"use server";
import { LogoutUser } from "@/app/auth/logout/logout";
import { FailedResponse, SuccessResponse } from "../constants/constants";
import {
  ContentType,
  axiosInstance,
  axiosPrivateInstance,
} from "./axiosInstance";

export const getRequest = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    if (response.data?.status) {
      return SuccessResponse(response?.data?.data, response?.data?.message);
    } else {
      return FailedResponse(
        response?.data?.message || "Some error occured",
        response?.data
      );
    }
  } catch (error: any) {
    return FailedResponse(
      error?.response?.data?.message || "Some error occured",
      error?.response?.data
    );
  }
};

export const getRequestProtected = async (url: string, token: any) => {
  try {
    const response = await axiosPrivateInstance(token, "json").get(url);
    if (response.data?.status) {
      return SuccessResponse(response?.data?.data, response?.data?.message);
    } else {
      return FailedResponse(
        response?.data?.message || "Some error occured",
        response?.data
      );
    }
  } catch (error: any) {
    console.log("err", error?.response);
    if (error?.response?.status === 401) {
      return await LogoutUser();
    }
    return FailedResponse(
      error?.response?.data?.message || "Some error occured",
      error?.response?.data
    );
  }
};

export const postRequest = async (data: any, url: string) => {
  try {
    const response = await axiosInstance.post(url, data);
    if (response.data?.status) {
      return SuccessResponse(response?.data?.data, response?.data?.message);
    } else {
      return FailedResponse(
        response?.data?.message || "Some error occured",
        response?.data
      );
    }
  } catch (error: any) {
    console.log("response error", error);
    return FailedResponse(
      error?.response?.data?.message || "Some error occured",
      error?.response?.data
    );
  }
};
export const postRequestProtected = async (
  data: any,
  url: string,
  token: string,
  type: ContentType
) => {
  try {
    const response = await axiosPrivateInstance(token, type).post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data?.status) {
      return SuccessResponse(response?.data?.data, response?.data?.message);
    } else {
      return FailedResponse(
        response?.data?.message || "Some error occured",
        response?.data
      );
    }
  } catch (error: any) {
    console.log("error:", error);
    if (error?.response?.status === 401) {
      return await LogoutUser();
    }
    return FailedResponse(
      error?.response?.data?.message || "Some error occured",
      error?.response?.data
    );
  }
};

export const patchRequestProtected = async (
  data: any,
  url: string,
  token: string,
  type?: ContentType
) => {
  try {
    const response = await axiosPrivateInstance(token, type||"json").patch(
      url,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data?.status) {
      return SuccessResponse(response?.data?.data, response?.data?.message);
    } else {
      return FailedResponse(
        response?.data?.message || "Some error occured",
        response?.data
      );
    }
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return await LogoutUser();
    }
    return FailedResponse(
      error?.response?.data?.message || "Some error occured",
      error?.response?.data
    );
  }
};
// let errResponse =
// err.response?.status == undefined
//   ? navigator.onLine
//     ? { message: "Possible network error" }
//     : { message: "No internet connection" }
//   : err?.response?.data;
// let errRespData = {
// error: errResponse?.message,
// };
