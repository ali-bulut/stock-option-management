import { AuthenticationCookies } from "@/pages/api/login";
import { InternalAxiosRequestConfig } from "axios";
import cookie from "cookie";

export function getAuthCookie(): AuthenticationCookies | undefined {
  try {
    const authCookieString: string =
      process.browser && document.cookie
        ? cookie.parse(document.cookie).auth
        : "{}";

    const authCookie: AuthenticationCookies = JSON.parse(authCookieString);

    if (!authCookie["Authorization"])
      throw "Can't find Bearer token in auth cookie";

    return authCookie;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

const injectAuthHeadersAdapter = {
  onFulfilled: function (
    config: InternalAxiosRequestConfig<any>
  ): InternalAxiosRequestConfig<any> {
    try {
      const authCookie = getAuthCookie();

      config.headers.set("Authorization", authCookie?.Authorization);

      return config;
    } catch (error) {
      return config;
    }
  },
  onRejected: function (error: any) {
    // Do something with request error
    return Promise.reject(error);
  },
};

export default injectAuthHeadersAdapter;
