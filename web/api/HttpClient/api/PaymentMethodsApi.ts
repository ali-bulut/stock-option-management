import { Axios } from "axios";
import { QueryFunctionContext } from "@tanstack/react-query";
import { IPaymentMethod } from "@/interfaces/IPaymentMethod";

const indexKey = (): [string, string] => ["payment_methods", "index"];

const PaymentMethodsApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof indexKey>>
    ) => {
      const response = await request.get<Array<IPaymentMethod>>(
        "/api/v1/payment_methods"
      );
      return response.data;
    },
    key: indexKey,
  },
});
export default PaymentMethodsApi;
