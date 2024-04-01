import { Axios } from "axios";
import {
  IPaymentIntent,
  PaymentIntentParams,
} from "@/interfaces/IPaymentIntent";

const PaymentIntentsApi = (request: Axios) => ({
  create: async (params: PaymentIntentParams) =>
    await request.post<IPaymentIntent>("/api/v1/payment_intents", params),
});
export default PaymentIntentsApi;
