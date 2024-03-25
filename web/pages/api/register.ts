import cookie from "cookie";
import { HttpClient } from "@/api/HttpClient";
import type { NextApiRequest, NextApiResponse } from "next";
import { AxiosError, AxiosResponse } from "axios";
import { IUserWithToken } from "@/interfaces/IUser";
import { RegisterInputParams } from "@/api/HttpClient/api/AuthenticationApi";

export type AuthenticationResponse = AxiosResponse<IUserWithToken>;
export type AuthenticationCookies = {
  Authorization: string;
};

export const handleSuccessfulAuthResponse = (
  authResponse: AuthenticationResponse,
  nextResponse: NextApiResponse
) => {
  const authCookie: AuthenticationCookies = {
    Authorization: "Bearer " + authResponse.data.token,
  };
  nextResponse
    .setHeader(
      "Set-Cookie",
      cookie.serialize("auth", JSON.stringify(authCookie), {
        httpOnly: false,
        sameSite: "lax",
        maxAge: Math.pow(2, 31) - 1,
        path: "/",
      })
    )
    .status(200)
    .json({ user: authResponse.data });
};

async function Register(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params: RegisterInputParams = req.body;

    // Fetch user object and access token
    const response = await HttpClient.ServerSide.AuthenticationApi.register(
      params
    );

    // This helper will set the cookies for the client
    handleSuccessfulAuthResponse(response, res);
  } catch (error) {
    console.log(error);
    if (
      (error as AxiosError).isAxiosError == true &&
      (error as AxiosError).response !== undefined
    ) {
      res
        .status((error as AxiosError).response!.status)
        .json((error as AxiosError).response?.data);
    } else {
      res.status(500).json({ error: JSON.stringify(error, null, 2) });
    }
  }
}

export default Register;
