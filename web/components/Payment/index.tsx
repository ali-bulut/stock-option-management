import { FC, useMemo, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import EnvironmentHelper from "@/helpers/EnvironmentHelper";
import useDarkModeStore from "@/hooks/useDarkModeStore";
import { Button, Image, InputNumber, Modal, Radio, Typography } from "antd";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import { HttpClient } from "@/api/HttpClient";
import usePayment from "@/hooks/usePayment";
import { IPaymentMethod } from "@/interfaces/IPaymentMethod";

interface PaymentProps {
  lockPayableAmount: boolean;
  setLockPayableAmount: (lockPayableAmount: boolean) => void;
  payableAmount: string;
  setPayableAmount: (payableAmount: string) => void;
  onPaymentSuccess: () => void;
  clientSecret: string;

  selectedPaymentMethod?: IPaymentMethod | null;
  setSelectedPaymentMethod: (paymentMethod: IPaymentMethod | null) => void;
  paymentMethods?: IPaymentMethod[];
  paymentMethodsIsLoading?: boolean;
}

interface PaymentModalProps {
  open: boolean;
  closeModal: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: FC<PaymentModalProps> = (props) => {
  const [payableAmount, setPayableAmount] = useState<string>("");
  const [lockPayableAmount, setLockPayableAmount] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  const {
    onCreatePaymentIntent,
    createPaymentIntentMutation,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods,
    paymentMethodsIsLoading,
  } = usePayment(payableAmount);

  const onLockPayableAmount = async () => {
    setClientSecret(await onCreatePaymentIntent());
    setLockPayableAmount(true);
  };

  const onClose = () => {
    setLockPayableAmount(false);
    setPayableAmount("");
    setClientSecret(undefined);
    setSelectedPaymentMethod(undefined);

    props.closeModal();
    props.onPaymentSuccess();
  };

  return (
    <Modal
      destroyOnClose
      title="Transfer Money"
      footer={null}
      open={props.open}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-2">
        {!lockPayableAmount && (
          <div className="flex flex-col justify-end items-end space-y-3 mt-2">
            <InputNumber
              addonBefore="$"
              className="w-full"
              placeholder="Enter Transfer Amount"
              onChange={(e) => setPayableAmount(e || "")}
              value={payableAmount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              onPressEnter={onLockPayableAmount}
            />

            <Button
              className="w-fit"
              disabled={!payableAmount || createPaymentIntentMutation.isLoading}
              loading={createPaymentIntentMutation.isLoading}
              onClick={onLockPayableAmount}
            >
              Continue
            </Button>
          </div>
        )}

        {payableAmount && lockPayableAmount && clientSecret && (
          <PaymentContainer
            lockPayableAmount={lockPayableAmount}
            setLockPayableAmount={setLockPayableAmount}
            payableAmount={payableAmount}
            setPayableAmount={setPayableAmount}
            onPaymentSuccess={onClose}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            selectedPaymentMethod={selectedPaymentMethod}
            paymentMethods={paymentMethods}
            paymentMethodsIsLoading={paymentMethodsIsLoading}
            clientSecret={clientSecret}
          />
        )}
      </div>
    </Modal>
  );
};

const PaymentContainer: FC<PaymentProps> = (props) => {
  const stripePromise = loadStripe(EnvironmentHelper.STRIPE_PUBLIC_KEY);
  const { darkMode } = useDarkModeStore();

  const options: StripeElementsOptions = useMemo(() => {
    return {
      appearance: {
        theme: darkMode ? "night" : "flat",
        labels: "floating",
      },
      clientSecret: props.clientSecret,
    };
  }, [props.clientSecret, darkMode]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <Payment
        lockPayableAmount={props.lockPayableAmount}
        setLockPayableAmount={props.setLockPayableAmount}
        payableAmount={props.payableAmount}
        setPayableAmount={props.setPayableAmount}
        onPaymentSuccess={props.onPaymentSuccess}
        setSelectedPaymentMethod={props.setSelectedPaymentMethod}
        selectedPaymentMethod={props.selectedPaymentMethod}
        paymentMethods={props.paymentMethods}
        paymentMethodsIsLoading={props.paymentMethodsIsLoading}
        clientSecret={props.clientSecret}
      />
    </Elements>
  );
};

const Payment: FC<PaymentProps> = (props) => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkModeStore();
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitElements = async () => {
    if (!stripe || !elements) {
      return;
    }

    const toastId = toast.loading("Payment Processing...");

    try {
      setIsLoading(true);

      const response = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          save_payment_method: true,
        },
      });

      setIsLoading(false);
      toast.dismiss(toastId);

      if (response.error) {
        toast.error(response.error.message || "Something went wrong");
      } else {
        toast.success("Payment Completed!", { duration: 1500 });
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.PaymentMethodsApi.index.key()
        );
        props.onPaymentSuccess();
      }
    } catch (error) {
      console.log({ error });
      toast.dismiss(toastId);
      toast.error("Something went wrong");
    }
  };

  const onSubmitWithSavedCard = async () => {
    if (!stripe || !props.selectedPaymentMethod) {
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Payment Processing...");

      const response = await stripe.confirmCardPayment(props.clientSecret, {
        payment_method: props.selectedPaymentMethod?.id,
      });

      setIsLoading(false);
      toast.dismiss(toastId);

      if (response.error) {
        toast.error(response.error.message || "Something went wrong");
      } else {
        toast.success("Payment Completed!", { duration: 1500 });
        props.onPaymentSuccess();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onPay = async () => {
    props.selectedPaymentMethod === null
      ? onSubmitElements()
      : onSubmitWithSavedCard();
  };

  const onAddNewPaymentMethodSelected = async () => {
    props.setSelectedPaymentMethod(null);
  };

  return (
    <div className="flex flex-col space-y-3 mt-2">
      {props.paymentMethods?.slice(0, 4).map((paymentMethod) => (
        <div
          key={paymentMethod.id}
          className={classNames(
            "h-16 cursor-pointer p-2 rounded-md shadow-md hover:shadow-lg",
            darkMode && "bg-dark-accent"
          )}
          onClick={() => props.setSelectedPaymentMethod(paymentMethod)}
        >
          <div className="flex w-full items-center justify-between gap-2">
            {paymentMethod.card ? (
              <div className="flex grow items-center justify-between">
                <div className="w-12">
                  <Image
                    width={100}
                    preview={false}
                    src="/cc/visa.png"
                    alt={paymentMethod.card.brand}
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <Typography.Text className="text-right text-sm">
                    {`**** **** **** `}
                    {paymentMethod.card.last4}
                  </Typography.Text>
                  <Typography.Text className="text-right text-xs">
                    {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
                  </Typography.Text>
                </div>
              </div>
            ) : null}

            <Radio
              checked={props.selectedPaymentMethod?.id === paymentMethod.id}
              onChange={(e) => {
                props.setSelectedPaymentMethod(paymentMethod);
              }}
            />
          </div>
        </div>
      ))}

      <div
        className={classNames(
          "min-h-16 cursor-pointer p-2 rounded-md shadow-md hover:shadow-lg",
          props.selectedPaymentMethod !== null &&
            "flex justify-center items-center",
          darkMode && "bg-dark-accent"
        )}
        onClick={onAddNewPaymentMethodSelected}
      >
        <div
          className={classNames(
            "flex w-full items-center justify-between gap-2",
            props.selectedPaymentMethod === null && "mt-2"
          )}
        >
          <div className="flex grow justify-center items-center">
            <Typography.Text className="text-center text-md font-semibold">
              Add New Payment Method
            </Typography.Text>
          </div>
          <Radio
            checked={props.selectedPaymentMethod === null}
            onChange={onAddNewPaymentMethodSelected}
          />
        </div>

        {!props.paymentMethodsIsLoading &&
        props.selectedPaymentMethod === null ? (
          <div className="mt-2 mb-4">
            <PaymentElement
              id="payment-element"
              options={{
                layout: "accordion",
              }}
            />
          </div>
        ) : undefined}
      </div>

      <Button
        disabled={!stripe || !elements || isLoading || !props.payableAmount}
        loading={isLoading}
        onClick={onPay}
        className="font-semibold"
      >
        Pay {CurrencyHelper.format(Number(props.payableAmount))}
      </Button>
    </div>
  );
};
