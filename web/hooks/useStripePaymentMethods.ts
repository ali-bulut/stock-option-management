import { useQuery } from "@tanstack/react-query";
import { HttpClient } from "@/api/HttpClient";

export default function useStripePaymentMethods() {
  const { data: paymentMethods, isLoading: paymentMethodsIsLoading } = useQuery(
    HttpClient.BrowserSide.PaymentMethodsApi.index.key(),
    HttpClient.BrowserSide.PaymentMethodsApi.index.fetcher
  );

  return { paymentMethods: paymentMethods, paymentMethodsIsLoading };
}
