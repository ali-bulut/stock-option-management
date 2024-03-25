import axios from "axios";
import { IUserWithToken } from "@/interfaces/IUser";
import {
  LoginInputParams,
  RegisterInputParams,
} from "../HttpClient/api/AuthenticationApi";

export const ServerAuthentication = {
  login: (params: LoginInputParams) =>
    axios.post<{ user: IUserWithToken }>("/api/login", params),
  register: (params: RegisterInputParams) =>
    axios.post<{ user: IUserWithToken }>("/api/register", params),
  logout: () =>
    new Promise((resolve, reject) => {
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      resolve(true);
    }),
};
