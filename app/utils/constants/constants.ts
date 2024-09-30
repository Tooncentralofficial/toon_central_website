import { ReqResponseType } from "./typess";

const SuccessResponse = (data?: any, message?: string): ReqResponseType|any => ({
  success: true,
  message: message || "",
  data,
});

const FailedResponse = (message?: string, data?: any): ReqResponseType => ({
  success: false,
  message: message || "",
  data,
});
export { SuccessResponse, FailedResponse };
