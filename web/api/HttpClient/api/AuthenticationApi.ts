import { IUserWithToken } from "@/interfaces/IUser";
import { Axios } from "axios";

export type LoginInputParams = {
  body: {
    email: string;
    password: string;
  };
};

export type RegisterInputParams = {
  body: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
};

const AuthenticationApi = (request: Axios) => ({
  login: async (params: LoginInputParams) =>
    await request.post<IUserWithToken>("/api/v1/sessions", params.body),
  register: async (params: RegisterInputParams) =>
    await request.post<IUserWithToken>("/api/v1/users", params.body),
});

export default AuthenticationApi;
