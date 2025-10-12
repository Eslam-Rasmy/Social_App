import type {
  IFailureResponse,
  ISuccessResponse,
} from "../../Common/Interfaces/response.interface.js";

export function SucessResponse<T>(
  message = "Your request is processed successfully",
  status = 200,
  data?: T
): ISuccessResponse {
  return {
    meta: {
      status,
      success: true,
    },
    data: {
      message,
      data,
    },
  };
}

export function FailedResponse(
  message = "Your request is failed",
  status = 500,
  error?: object
): IFailureResponse {
  return {
    meta: {
      status,
      success: false,
    },
    error: {
      message,
      context: error,
    },
  };
}
