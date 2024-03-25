import { AxiosError } from "axios";

/**
 * This helper will contain a set of functions that would help with error parsing
 */
export default class ErrorHelper {
  /**
   * Helps parse Api errors
   * @param error An axios error serialized by Api
   * @returns A string of the error message
   */
  public static parseApiError = (
    error: AxiosError<{ errors: Array<string> }>
  ): string => {
    try {
      return error?.response?.data.errors
        ? error?.response?.data.errors.map((error) => error).join(", ")
        : `Something went wrong ${
            error?.response?.status ? `(${error?.response?.status})` : ""
          }`;
    } catch (error) {
      return "Something went wrong";
    }
  };
}
