import { AxiosRequestConfig } from "axios";

/**
 * This helper will contain a set of functions that would help with environment context
 */
export default class EnvironmentHelper {
  public static API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  public static STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;

  public static defaultAxiosRequestConfiguration = (): AxiosRequestConfig => ({
    // TODO: change it to https
    baseURL: `https://${this.API_URL}`,
  });
}
