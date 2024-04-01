import { useMutation } from "@tanstack/react-query";
import { HttpClient } from "@/api/HttpClient";
import { useState } from "react";
import useStripePaymentMethods from "./useStripePaymentMethods";
import { IPaymentMethod } from "@/interfaces/IPaymentMethod";

export default function usePayment(payableAmount: string) {
  const { paymentMethods, paymentMethodsIsLoading } = useStripePaymentMethods();

  const createPaymentIntentMutation = useMutation(
    HttpClient.BrowserSide.PaymentIntentsApi.create
  );

  const onCreatePaymentIntent = async () => {
    try {
      const res = await createPaymentIntentMutation.mutateAsync({
        amount: Number(payableAmount),
      });

      return res.data.client_secret;
    } catch (err) {
      console.log(err);
    }
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    IPaymentMethod | null | undefined
  >();

  return {
    paymentMethods: paymentMethods,
    paymentMethodsIsLoading,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    onCreatePaymentIntent,
    createPaymentIntentMutation,
  };
}
